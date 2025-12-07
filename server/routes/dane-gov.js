/**
 * dane.gov.pl API Integration Routes
 */

const express = require('express');
const fetch = require('node-fetch');
const db = require('../database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

const DANE_GOV_API_URL = process.env.DANE_GOV_API_URL || 'https://api.dane.gov.pl';
const DANE_GOV_API_VERSION = process.env.DANE_GOV_API_VERSION || '1.4';

/**
 * GET /api/dane-gov/search
 * Search dane.gov.pl datasets
 */
router.get('/search', async (req, res, next) => {
    try {
        const { q, page = 1, per_page = 20 } = req.query;

        const params = new URLSearchParams({
            q: q || 'rzeczy znalezione',
            page,
            per_page
        });

        const response = await fetch(
            `${DANE_GOV_API_URL}/${DANE_GOV_API_VERSION}/datasets?${params}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`dane.gov.pl API error: ${response.status}`);
        }

        const data = await response.json();

        res.json({
            data: data.data || [],
            meta: data.meta || {
                total: 0,
                page: parseInt(page),
                per_page: parseInt(per_page)
            }
        });
    } catch (error) {
        console.error('dane.gov.pl search error:', error);
        res.status(502).json({ error: 'Failed to fetch from dane.gov.pl' });
    }
});

/**
 * GET /api/dane-gov/datasets/:id
 * Get dataset details from dane.gov.pl
 */
router.get('/datasets/:id', async (req, res, next) => {
    try {
        const response = await fetch(
            `${DANE_GOV_API_URL}/${DANE_GOV_API_VERSION}/datasets/${req.params.id}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({ error: 'Dataset not found' });
            }
            throw new Error(`dane.gov.pl API error: ${response.status}`);
        }

        const data = await response.json();
        res.json({ data: data.data || data });
    } catch (error) {
        console.error('dane.gov.pl dataset error:', error);
        res.status(502).json({ error: 'Failed to fetch dataset from dane.gov.pl' });
    }
});

/**
 * GET /api/dane-gov/datasets/:id/resources
 * Get dataset resources from dane.gov.pl
 */
router.get('/datasets/:id/resources', async (req, res, next) => {
    try {
        const response = await fetch(
            `${DANE_GOV_API_URL}/${DANE_GOV_API_VERSION}/datasets/${req.params.id}/resources`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`dane.gov.pl API error: ${response.status}`);
        }

        const data = await response.json();
        res.json({ data: data.data || [] });
    } catch (error) {
        console.error('dane.gov.pl resources error:', error);
        res.status(502).json({ error: 'Failed to fetch resources from dane.gov.pl' });
    }
});

/**
 * GET /api/dane-gov/resources/:id/data
 * Get resource data from dane.gov.pl
 */
router.get('/resources/:id/data', async (req, res, next) => {
    try {
        const { page = 1, per_page = 100 } = req.query;

        const params = new URLSearchParams({ page, per_page });

        const response = await fetch(
            `${DANE_GOV_API_URL}/${DANE_GOV_API_VERSION}/resources/${req.params.id}/data?${params}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`dane.gov.pl API error: ${response.status}`);
        }

        const data = await response.json();
        res.json({ data: data.data || [], meta: data.meta });
    } catch (error) {
        console.error('dane.gov.pl resource data error:', error);
        res.status(502).json({ error: 'Failed to fetch resource data from dane.gov.pl' });
    }
});

/**
 * POST /api/dane-gov/export
 * Export local items to dane.gov.pl format
 */
router.post('/export', authenticateToken, requireRole('admin', 'official'), async (req, res, next) => {
    try {
        const { format = 'json', status, voivodeship } = req.body;

        let whereClause = ['1=1'];
        let params = [];

        if (status) {
            whereClause.push('status = ?');
            params.push(status);
        }

        if (voivodeship) {
            whereClause.push('voivodeship = ?');
            params.push(voivodeship);
        }

        const items = db.prepare(`
            SELECT * FROM items WHERE ${whereClause.join(' AND ')}
            ORDER BY date_found DESC
        `).all(...params);

        const categoryNames = {
            phone: 'Telefon', documents: 'Dokumenty', jewelry: 'Bizuteria',
            keys: 'Klucze', wallet: 'Portfel', clothing: 'Odziez',
            electronics: 'Elektronika', bicycle: 'Rower', other: 'Inne'
        };

        const statusNames = {
            stored: 'Przechowywany', returned: 'Zwrocony', liquidated: 'Zlikwidowany'
        };

        // Format for dane.gov.pl
        const exportData = {
            metadata: {
                title: 'Rzeczy Znalezione',
                description: 'Rejestr rzeczy znalezionych zgodny z ustawa z dnia 20 lutego 2015 r. o rzeczach znalezionych',
                category: 'government_and_public_sector',
                update_frequency: 'weekly',
                created: new Date().toISOString(),
                source: 'dane.gov.pl - Mechanizm Rzeczy Znalezionych',
                license: 'CC0 1.0',
                language: 'pl'
            },
            data: items.map(item => ({
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
                entry_date: item.entry_date,
                update_date: item.update_date,
                photo_url: item.photo_url,
                notes: item.notes
            }))
        };

        logAudit(req.user.id, 'EXPORT_DANE_GOV', 'export', null, null, { count: items.length, format }, req.ip);

        if (format === 'csv') {
            // CSV format
            const headers = [
                'ID', 'Nazwa', 'Kategoria', 'Opis', 'Data znalezienia',
                'Miejsce znalezienia', 'Gmina', 'Powiat', 'Wojewodztwo',
                'Status', 'Termin odbioru', 'Biuro', 'Adres biura', 'Telefon'
            ];

            const rows = exportData.data.map(item => [
                item.id,
                item.item_name,
                item.category_pl,
                item.description,
                item.date_found,
                item.location_found,
                item.municipality,
                item.county,
                item.voivodeship,
                item.status_pl,
                item.collection_deadline,
                item.lost_and_found_office.name,
                item.lost_and_found_office.address,
                item.lost_and_found_office.phone
            ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));

            const csv = [headers.join(','), ...rows].join('\n');

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=rzeczy_znalezione.csv');
            return res.send('\uFEFF' + csv);
        }

        // JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=rzeczy_znalezione.json');
        res.json(exportData);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/dane-gov/import
 * Import data from dane.gov.pl dataset
 */
router.post('/import', authenticateToken, requireRole('admin'), async (req, res, next) => {
    try {
        const { resource_id } = req.body;

        if (!resource_id) {
            return res.status(400).json({ error: 'resource_id is required' });
        }

        // Fetch data from dane.gov.pl
        const response = await fetch(
            `${DANE_GOV_API_URL}/${DANE_GOV_API_VERSION}/resources/${resource_id}/data?per_page=1000`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`dane.gov.pl API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            return res.status(400).json({ error: 'Invalid data format from dane.gov.pl' });
        }

        // Import items
        let imported = 0;
        let skipped = 0;

        for (const item of data.data) {
            try {
                // Check if already exists
                const existing = db.prepare('SELECT id FROM items WHERE public_id = ?')
                    .get(item.id || item.public_id);

                if (existing) {
                    skipped++;
                    continue;
                }

                // Insert
                db.prepare(`
                    INSERT INTO items (
                        public_id, item_name, category, description,
                        date_found, location_found, location_type,
                        municipality, county, voivodeship,
                        estimated_value, status, collection_deadline,
                        office_name, office_address, office_phone, office_email, office_hours,
                        dane_gov_dataset_id, synced_to_dane_gov
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                `).run(
                    item.id || item.public_id || `IMP/${Date.now()}/${imported}`,
                    item.item_name || item.nazwa || 'Unknown',
                    item.category || 'other',
                    item.description || item.opis || '',
                    item.date_found || item.data_znalezienia || new Date().toISOString().split('T')[0],
                    item.location_found || item.miejsce_znalezienia || '',
                    item.location_type || null,
                    item.municipality || item.gmina || '',
                    item.county || item.powiat || '',
                    item.voivodeship || item.wojewodztwo || '',
                    item.estimated_value || null,
                    item.status || 'stored',
                    item.collection_deadline || null,
                    item.lost_and_found_office?.name || item.biuro || '',
                    item.lost_and_found_office?.address || item.adres_biura || '',
                    item.lost_and_found_office?.phone || item.telefon || '',
                    item.lost_and_found_office?.email || null,
                    item.lost_and_found_office?.opening_hours || null,
                    resource_id
                );
                imported++;
            } catch (err) {
                console.error('Import item error:', err);
                skipped++;
            }
        }

        logAudit(req.user.id, 'IMPORT_DANE_GOV', 'import', resource_id, null, { imported, skipped }, req.ip);

        res.json({
            message: `Imported ${imported} items, skipped ${skipped}`,
            imported,
            skipped
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
