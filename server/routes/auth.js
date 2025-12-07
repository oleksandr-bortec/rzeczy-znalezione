/**
 * Authentication Routes
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken, logAudit, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('organization').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, organization, phone } = req.body;

        // Check if email exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = db.prepare(`
            INSERT INTO users (email, password, name, organization, phone, role)
            VALUES (?, ?, ?, ?, ?, 'user')
        `).run(email, hashedPassword, name, organization || null, phone || null);

        const userId = result.lastInsertRowid;

        // Generate token
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        logAudit(userId, 'REGISTER', 'user', userId, null, { email, name }, req.ip);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: userId,
                email,
                name,
                role: 'user',
                organization
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = db.prepare(`
            SELECT id, email, password, name, role, organization, is_active, language
            FROM users WHERE email = ?
        `).get(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: 'Account is disabled' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        logAudit(user.id, 'LOGIN', 'user', user.id, null, null, req.ip);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organization: user.organization,
                language: user.language
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticateToken, (req, res) => {
    const user = db.prepare(`
        SELECT id, email, name, role, organization, phone, language, created_at
        FROM users WHERE id = ?
    `).get(req.user.id);

    res.json({ user });
});

/**
 * PUT /api/auth/me
 * Update current user
 */
router.put('/me', authenticateToken, [
    body('name').optional().trim().notEmpty(),
    body('organization').optional().trim(),
    body('phone').optional().trim(),
    body('language').optional().isIn(['pl', 'en'])
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, organization, phone, language } = req.body;
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (organization !== undefined) {
            updates.push('organization = ?');
            params.push(organization || null);
        }
        if (phone !== undefined) {
            updates.push('phone = ?');
            params.push(phone || null);
        }
        if (language) {
            updates.push('language = ?');
            params.push(language);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(req.user.id);

        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

        const user = db.prepare(`
            SELECT id, email, name, role, organization, phone, language
            FROM users WHERE id = ?
        `).get(req.user.id);

        logAudit(req.user.id, 'UPDATE_PROFILE', 'user', req.user.id, null, req.body, req.ip);

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/auth/password
 * Change password
 */
router.put('/password', authenticateToken, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(hashedPassword, req.user.id);

        logAudit(req.user.id, 'CHANGE_PASSWORD', 'user', req.user.id, null, null, req.ip);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/logout
 * Logout user (for audit)
 */
router.post('/logout', authenticateToken, (req, res) => {
    logAudit(req.user.id, 'LOGOUT', 'user', req.user.id, null, null, req.ip);
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
