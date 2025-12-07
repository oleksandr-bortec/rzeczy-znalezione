/**
 * Statistics Routes
 */

const express = require('express');
const db = require('../database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/stats
 * Get overall statistics
 */
router.get('/', optionalAuth, (req, res, next) => {
    try {
        const stats = {};

        // Total items
        stats.total = db.prepare('SELECT COUNT(*) as count FROM items').get().count;

        // By status
        const byStatus = db.prepare(`
            SELECT status, COUNT(*) as count FROM items GROUP BY status
        `).all();

        stats.stored = byStatus.find(s => s.status === 'stored')?.count || 0;
        stats.returned = byStatus.find(s => s.status === 'returned')?.count || 0;
        stats.liquidated = byStatus.find(s => s.status === 'liquidated')?.count || 0;

        // Unique offices (sources)
        stats.sources = db.prepare(`
            SELECT COUNT(DISTINCT office_name) as count FROM items
        `).get().count;

        // Items this month
        const firstOfMonth = new Date();
        firstOfMonth.setDate(1);
        stats.this_month = db.prepare(`
            SELECT COUNT(*) as count FROM items WHERE date_found >= ?
        `).get(firstOfMonth.toISOString().split('T')[0]).count;

        // Return rate
        stats.return_rate = stats.total > 0
            ? Math.round((stats.returned / stats.total) * 100)
            : 0;

        res.json({ data: stats });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats/by-category
 * Statistics by category
 */
router.get('/by-category', optionalAuth, (req, res, next) => {
    try {
        const categoryNames = {
            phone: 'Telefon', documents: 'Dokumenty', jewelry: 'Bizuteria',
            keys: 'Klucze', wallet: 'Portfel', clothing: 'Odziez',
            electronics: 'Elektronika', bicycle: 'Rower', other: 'Inne'
        };

        const stats = db.prepare(`
            SELECT category, COUNT(*) as count
            FROM items
            GROUP BY category
            ORDER BY count DESC
        `).all();

        const formatted = stats.map(s => ({
            category: s.category,
            category_pl: categoryNames[s.category] || s.category,
            count: s.count
        }));

        res.json({ data: formatted });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats/by-voivodeship
 * Statistics by voivodeship
 */
router.get('/by-voivodeship', optionalAuth, (req, res, next) => {
    try {
        const stats = db.prepare(`
            SELECT voivodeship, COUNT(*) as count
            FROM items
            GROUP BY voivodeship
            ORDER BY count DESC
        `).all();

        res.json({ data: stats });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats/by-month
 * Statistics by month (last 12 months)
 */
router.get('/by-month', optionalAuth, (req, res, next) => {
    try {
        const stats = db.prepare(`
            SELECT
                strftime('%Y-%m', date_found) as month,
                COUNT(*) as count
            FROM items
            WHERE date_found >= date('now', '-12 months')
            GROUP BY strftime('%Y-%m', date_found)
            ORDER BY month
        `).all();

        res.json({ data: stats });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats/recent
 * Recently found items
 */
router.get('/recent', optionalAuth, (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const items = db.prepare(`
            SELECT public_id, item_name, category, date_found, municipality, status
            FROM items
            ORDER BY date_found DESC, created_at DESC
            LIMIT ?
        `).all(limit);

        res.json({ data: items });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stats/offices
 * Top offices by item count
 */
router.get('/offices', optionalAuth, (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const offices = db.prepare(`
            SELECT
                office_name as name,
                office_address as address,
                office_phone as phone,
                COUNT(*) as items_count,
                voivodeship
            FROM items
            GROUP BY office_name
            ORDER BY items_count DESC
            LIMIT ?
        `).all(limit);

        res.json({ data: offices });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
