/**
 * Users Management Routes (Admin only)
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { body, query, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken, requireRole, logAudit } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/users
 * List all users (admin only)
 */
router.get('/', authenticateToken, requireRole('admin'), [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('per_page').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('role').optional().isIn(['admin', 'official', 'user']),
    query('search').optional().trim()
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

        if (req.query.role) {
            whereClause.push('role = ?');
            params.push(req.query.role);
        }

        if (req.query.search) {
            whereClause.push('(email LIKE ? OR name LIKE ? OR organization LIKE ?)');
            const search = `%${req.query.search}%`;
            params.push(search, search, search);
        }

        const total = db.prepare(`
            SELECT COUNT(*) as count FROM users WHERE ${whereClause.join(' AND ')}
        `).get(...params).count;

        const users = db.prepare(`
            SELECT id, email, name, role, organization, phone, is_active, language, created_at
            FROM users
            WHERE ${whereClause.join(' AND ')}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `).all(...params, perPage, offset);

        res.json({
            data: users,
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
 * GET /api/users/:id
 * Get single user
 */
router.get('/:id', authenticateToken, requireRole('admin'), (req, res, next) => {
    try {
        const user = db.prepare(`
            SELECT id, email, name, role, organization, phone, is_active, language, created_at, updated_at
            FROM users WHERE id = ?
        `).get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's item count
        const itemCount = db.prepare('SELECT COUNT(*) as count FROM items WHERE created_by = ?')
            .get(req.params.id).count;

        res.json({
            data: {
                ...user,
                items_count: itemCount
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/users
 * Create new user (admin only)
 */
router.post('/', authenticateToken, requireRole('admin'), [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    body('role').isIn(['admin', 'official', 'user']),
    body('organization').optional().trim(),
    body('phone').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, role, organization, phone } = req.body;

        // Check if email exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = db.prepare(`
            INSERT INTO users (email, password, name, role, organization, phone)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(email, hashedPassword, name, role, organization || null, phone || null);

        const user = db.prepare(`
            SELECT id, email, name, role, organization, phone, is_active, created_at
            FROM users WHERE id = ?
        `).get(result.lastInsertRowid);

        logAudit(req.user.id, 'CREATE_USER', 'user', user.id, null, { email, name, role }, req.ip);

        res.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', authenticateToken, requireRole('admin'), [
    body('name').optional().trim().notEmpty(),
    body('role').optional().isIn(['admin', 'official', 'user']),
    body('organization').optional().trim(),
    body('phone').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('language').optional().isIn(['pl', 'en'])
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent self-demotion
        if (req.params.id == req.user.id && req.body.role && req.body.role !== user.role) {
            return res.status(400).json({ error: 'Cannot change your own role' });
        }

        const allowedFields = ['name', 'role', 'organization', 'phone', 'is_active', 'language'];
        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(req.body[field]);
            }
        }

        // Handle password change
        if (req.body.password) {
            updates.push('password = ?');
            params.push(await bcrypt.hash(req.body.password, 12));
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(req.params.id);

        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

        const updatedUser = db.prepare(`
            SELECT id, email, name, role, organization, phone, is_active, language, created_at, updated_at
            FROM users WHERE id = ?
        `).get(req.params.id);

        logAudit(req.user.id, 'UPDATE_USER', 'user', req.params.id, user, req.body, req.ip);

        res.json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', authenticateToken, requireRole('admin'), (req, res, next) => {
    try {
        // Prevent self-deletion
        if (req.params.id == req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Soft delete - just deactivate
        db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(req.params.id);

        logAudit(req.user.id, 'DELETE_USER', 'user', req.params.id, user, null, req.ip);

        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
