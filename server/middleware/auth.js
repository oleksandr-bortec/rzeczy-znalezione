/**
 * Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

/**
 * Verify JWT token
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if user still exists and is active
        const user = db.prepare('SELECT id, email, name, role, organization, is_active FROM users WHERE id = ?').get(decoded.userId);

        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
}

/**
 * Require specific role(s)
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

/**
 * Optional authentication - doesn't fail if no token
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.prepare('SELECT id, email, name, role, organization, is_active FROM users WHERE id = ?').get(decoded.userId);

        if (user && user.is_active) {
            req.user = user;
        }
    } catch (error) {
        // Ignore errors for optional auth
    }

    next();
}

/**
 * Log audit action
 */
function logAudit(userId, action, entityType, entityId, oldValue = null, newValue = null, ipAddress = null) {
    try {
        db.prepare(`
            INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_value, new_value, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(userId, action, entityType, entityId,
            oldValue ? JSON.stringify(oldValue) : null,
            newValue ? JSON.stringify(newValue) : null,
            ipAddress
        );
    } catch (error) {
        console.error('Audit log error:', error);
    }
}

module.exports = {
    authenticateToken,
    requireRole,
    optionalAuth,
    logAudit,
    JWT_SECRET
};
