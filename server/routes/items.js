/**
 * Items Routes - CRUD for lost and found items
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateToken, requireRole, optionalAuth, logAudit } = require('../middleware/auth');

const router = express.Router();

// Category and status mappings
const CATEGORIES = ['phone', 'documents', 'jewelry', 'keys', 'wallet', 'clothing', 'electronics', 'bicycle', 'other'];
const STATUSES = ['stored', 'returned', 'liquidated'];
const VOIVODESHIPS = [
    'dolnoslaskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'lodzkie',
    'malopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
    'pomorskie', 'slaskie', 'swietokrzyskie', 'warminsko-mazurskie',
    'wielkopolskie', 'zachodniopomorskie'
];

/**
 * Generate public ID (RZ/YYYY/NNNN)
 */
function generatePublicId() {
    const year = new Date().getFullYear();
    const count = db.prepare("SELECT COUNT(*) as count FROM items WHERE public_id LIKE ?").get(`RZ/${year}/%`);
    const num = String((count?.count || 0) + 1).padStart(4, '0');
    return `RZ/${year}/${num}`;
}

/**
 * GET /api/items
 * List items with filtering and pagination
 */
router.get('/', optionalAuth, [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('per_page').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('q').optional().trim(),
    query('category').optional().isIn(CATEGORIES),
    query('status').optional().isIn(STATUSES),
    query('voivodeship').optional().isIn(VOIVODESHIPS),
    query('county').optional().trim(),
    query('date_from').optional().isISO8601().toDate(),
    query('date_to').optional().isISO8601().toDate(),
    query('sort').optional().isIn(['date_found', 'created_at', 'item_name']),
    query('order').optional().isIn(['asc', 'desc'])
], (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const page = req.query.page || 1;
        const perPage = req.query.per_page || 20;
        const offset = (page - 1) * perPage;

        let whereClause = ['1=1'];
        let params = [];

        // Full-text search
        if (req.query.q) {
            const searchIds = db.prepare(`
                SELECT rowid FROM items_fts WHERE items_fts MATCH ?
            `).all(req.query.q + '*').map(r => r.rowid);

            if (searchIds.length > 0) {
                whereClause.push(`id IN (${searchIds.join(',')})`);
            } else {
                // Fallback to LIKE search
                whereClause.push('(item_name LIKE ? OR description LIKE ?)');
                params.push(`%${req.query.q}%`, `%${req.query.q}%`);
            }
        }

        if (req.query.category) {
            whereClause.push('category = ?');
            params.push(req.query.category);
        }

        if (req.query.status) {
            whereClause.push('status = ?');
            params.push(req.query.status);
        }

        if (req.query.voivodeship) {
            whereClause.push('voivodeship = ?');
            params.push(req.query.voivodeship);
        }

        if (req.query.county) {
            whereClause.push('county LIKE ?');
            params.push(`%${req.query.county}%`);
        }

        if (req.query.date_from) {
            whereClause.push('date_found >= ?');
            params.push(req.query.date_from.toISOString().split('T')[0]);
        }

        if (req.query.date_to) {
            whereClause.push('date_found <= ?');
            params.push(req.query.date_to.toISOString().split('T')[0]);
        }

        const sort = req.query.sort || 'created_at';
        const order = req.query.order || 'desc';
        const orderClause = `ORDER BY ${sort} ${order}`;

        // Count total
        const countSql = `SELECT COUNT(*) as total FROM items WHERE ${whereClause.join(' AND ')}`;
        const total = db.prepare(countSql).get(...params).total;

        // Get items
        const sql = `
            SELECT
                id, public_id, item_name, category, description,
                date_found, location_found, location_type,
                coordinates_lat, coordinates_lon,
                municipality, county, voivodeship,
                estimated_value, status, collection_deadline,
                office_name, office_address, office_phone, office_email, office_hours,
                photo_url, notes, entry_date, update_date
            FROM items
            WHERE ${whereClause.join(' AND ')}
            ${orderClause}
            LIMIT ? OFFSET ?
        `;

        const items = db.prepare(sql).all(...params, perPage, offset);

        // Format items
        const formattedItems = items.map(formatItem);

        res.json({
            data: formattedItems,
            meta: {
                total,
                page,
                per_page: perPage,
                total_pages: Math.ceil(total / perPage)
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/items/:id
 * Get single item by public_id or id
 */
router.get('/:id', optionalAuth, (req, res, next) => {
    try {
        const item = db.prepare(`
            SELECT * FROM items WHERE public_id = ? OR id = ?
        `).get(req.params.id, req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ data: formatItem(item) });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/items
 * Create new item
 */
router.post('/', authenticateToken, requireRole('admin', 'official'), [
    body('item_name').trim().notEmpty().isLength({ min: 3, max: 200 }),
    body('category').isIn(CATEGORIES),
    body('description').trim().notEmpty().isLength({ min: 10, max: 2000 }),
    body('date_found').isISO8601().toDate(),
    body('location_found').trim().notEmpty().isLength({ min: 5, max: 500 }),
    body('location_type').optional().trim(),
    body('coordinates_lat').optional().isFloat({ min: -90, max: 90 }),
    body('coordinates_lon').optional().isFloat({ min: -180, max: 180 }),
    body('municipality').trim().notEmpty(),
    body('county').trim().notEmpty(),
    body('voivodeship').isIn(VOIVODESHIPS),
    body('estimated_value').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(STATUSES),
    body('collection_deadline').optional().isISO8601().toDate(),
    body('office_name').trim().notEmpty(),
    body('office_address').trim().notEmpty(),
    body('office_phone').trim().notEmpty(),
    body('office_email').optional().isEmail(),
    body('office_hours').optional().trim(),
    body('photo_url').optional().isURL(),
    body('notes').optional().trim()
], (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const publicId = generatePublicId();
        const data = req.body;

        // Calculate collection deadline if not provided (2 years from date_found)
        let collectionDeadline = data.collection_deadline;
        if (!collectionDeadline && data.date_found) {
            const deadline = new Date(data.date_found);
            deadline.setFullYear(deadline.getFullYear() + 2);
            collectionDeadline = deadline.toISOString().split('T')[0];
        }

        const result = db.prepare(`
            INSERT INTO items (
                public_id, item_name, category, description,
                date_found, location_found, location_type,
                coordinates_lat, coordinates_lon,
                municipality, county, voivodeship,
                estimated_value, status, collection_deadline,
                office_name, office_address, office_phone, office_email, office_hours,
                photo_url, notes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            publicId,
            data.item_name,
            data.category,
            data.description,
            data.date_found.toISOString().split('T')[0],
            data.location_found,
            data.location_type || null,
            data.coordinates_lat || null,
            data.coordinates_lon || null,
            data.municipality,
            data.county,
            data.voivodeship,
            data.estimated_value || null,
            data.status || 'stored',
            collectionDeadline,
            data.office_name,
            data.office_address,
            data.office_phone,
            data.office_email || null,
            data.office_hours || null,
            data.photo_url || null,
            data.notes || null,
            req.user.id
        );

        const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);

        logAudit(req.user.id, 'CREATE_ITEM', 'item', publicId, null, data, req.ip);

        res.status(201).json({
            message: 'Item created successfully',
            data: formatItem(item)
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/items/:id
 * Update item
 */
router.put('/:id', authenticateToken, requireRole('admin', 'official'), [
    body('item_name').optional().trim().notEmpty().isLength({ min: 3, max: 200 }),
    body('category').optional().isIn(CATEGORIES),
    body('description').optional().trim().notEmpty().isLength({ min: 10, max: 2000 }),
    body('date_found').optional().isISO8601().toDate(),
    body('location_found').optional().trim().notEmpty(),
    body('status').optional().isIn(STATUSES),
    body('voivodeship').optional().isIn(VOIVODESHIPS)
], (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const item = db.prepare('SELECT * FROM items WHERE public_id = ? OR id = ?')
            .get(req.params.id, req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const allowedFields = [
            'item_name', 'category', 'description', 'date_found', 'location_found',
            'location_type', 'coordinates_lat', 'coordinates_lon', 'municipality',
            'county', 'voivodeship', 'estimated_value', 'status', 'collection_deadline',
            'office_name', 'office_address', 'office_phone', 'office_email', 'office_hours',
            'photo_url', 'notes'
        ];

        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                let value = req.body[field];
                if (value instanceof Date) {
                    value = value.toISOString().split('T')[0];
                }
                params.push(value === '' ? null : value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updates.push('update_date = CURRENT_DATE');
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(item.id);

        db.prepare(`UPDATE items SET ${updates.join(', ')} WHERE id = ?`).run(...params);

        const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(item.id);

        logAudit(req.user.id, 'UPDATE_ITEM', 'item', item.public_id, item, req.body, req.ip);

        res.json({
            message: 'Item updated successfully',
            data: formatItem(updatedItem)
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/items/:id
 * Delete item
 */
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) => {
    try {
        const item = db.prepare('SELECT * FROM items WHERE public_id = ? OR id = ?')
            .get(req.params.id, req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        db.prepare('DELETE FROM items WHERE id = ?').run(item.id);

        logAudit(req.user.id, 'DELETE_ITEM', 'item', item.public_id, item, null, req.ip);

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/items/bulk
 * Bulk create items (for Excel import)
 */
router.post('/bulk', authenticateToken, requireRole('admin', 'official'), (req, res, next) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required' });
        }

        if (items.length > 1000) {
            return res.status(400).json({ error: 'Maximum 1000 items per request' });
        }

        const results = { created: 0, errors: [] };

        const insertStmt = db.prepare(`
            INSERT INTO items (
                public_id, item_name, category, description,
                date_found, location_found, location_type,
                municipality, county, voivodeship,
                estimated_value, status, collection_deadline,
                office_name, office_address, office_phone, office_email, office_hours,
                photo_url, notes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction((items) => {
            for (let i = 0; i < items.length; i++) {
                const data = items[i];
                try {
                    const publicId = generatePublicId();

                    // Calculate collection deadline
                    let collectionDeadline = data.collection_deadline;
                    if (!collectionDeadline && data.date_found) {
                        const deadline = new Date(data.date_found);
                        deadline.setFullYear(deadline.getFullYear() + 2);
                        collectionDeadline = deadline.toISOString().split('T')[0];
                    }

                    insertStmt.run(
                        publicId,
                        data.item_name,
                        data.category || 'other',
                        data.description,
                        data.date_found,
                        data.location_found,
                        data.location_type || null,
                        data.municipality,
                        data.county,
                        data.voivodeship,
                        data.estimated_value || null,
                        data.status || 'stored',
                        collectionDeadline,
                        data.office_name,
                        data.office_address,
                        data.office_phone,
                        data.office_email || null,
                        data.office_hours || null,
                        data.photo_url || null,
                        data.notes || null,
                        req.user.id
                    );
                    results.created++;
                } catch (error) {
                    results.errors.push({ index: i, error: error.message });
                }
            }
        });

        transaction(items);

        logAudit(req.user.id, 'BULK_CREATE_ITEMS', 'item', null, null, { count: results.created }, req.ip);

        res.status(201).json({
            message: `Created ${results.created} items`,
            results
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Format item for API response
 */
function formatItem(item) {
    const categoryNames = {
        phone: 'Telefon', documents: 'Dokumenty', jewelry: 'Bizuteria',
        keys: 'Klucze', wallet: 'Portfel', clothing: 'Odziez',
        electronics: 'Elektronika', bicycle: 'Rower', other: 'Inne'
    };

    const statusNames = {
        stored: 'Przechowywany', returned: 'Zwrocony', liquidated: 'Zlikwidowany'
    };

    return {
        id: item.public_id,
        item_name: item.item_name,
        category: item.category,
        category_pl: categoryNames[item.category] || 'Inne',
        description: item.description,
        date_found: item.date_found,
        location_found: item.location_found,
        location_type: item.location_type,
        coordinates: item.coordinates_lat && item.coordinates_lon
            ? { lat: item.coordinates_lat, lon: item.coordinates_lon }
            : null,
        municipality: item.municipality,
        county: item.county,
        voivodeship: item.voivodeship,
        estimated_value: item.estimated_value,
        status: item.status,
        status_pl: statusNames[item.status] || item.status,
        collection_deadline: item.collection_deadline,
        lost_and_found_office: {
            name: item.office_name,
            address: item.office_address,
            phone: item.office_phone,
            email: item.office_email,
            opening_hours: item.office_hours
        },
        photo_url: item.photo_url,
        notes: item.notes,
        entry_date: item.entry_date,
        update_date: item.update_date
    };
}

module.exports = router;
