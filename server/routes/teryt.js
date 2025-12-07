/**
 * TERYT API Routes
 * Endpoints for territorial division codes and auto-complete
 */

const express = require('express');
const terytService = require('../services/terytService');

const router = express.Router();

/**
 * GET /api/teryt/wojewodztwa
 * Get all voivodeships
 */
router.get('/wojewodztwa', (req, res) => {
    try {
        const wojewodztwa = terytService.getAllWojewodztwa();
        res.json({
            success: true,
            count: wojewodztwa.length,
            data: wojewodztwa
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch voivodeships',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/powiaty?wojewodztwo=malopolskie
 * Get counties for voivodeship
 */
router.get('/powiaty', (req, res) => {
    try {
        const { wojewodztwo } = req.query;

        if (!wojewodztwo) {
            return res.status(400).json({
                success: false,
                error: 'Voivodeship parameter is required'
            });
        }

        const powiaty = terytService.getPowiatyForWojewodztwo(wojewodztwo);

        res.json({
            success: true,
            wojewodztwo,
            count: powiaty.length,
            data: powiaty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch counties',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/gminy?powiat=krakow&wojewodztwo=malopolskie
 * Get municipalities for county
 */
router.get('/gminy', (req, res) => {
    try {
        const { powiat, wojewodztwo } = req.query;

        if (!wojewodztwo) {
            return res.status(400).json({
                success: false,
                error: 'Voivodeship parameter is required'
            });
        }

        const gminy = terytService.getGminyForPowiat(powiat, wojewodztwo);

        res.json({
            success: true,
            wojewodztwo,
            powiat: powiat || 'all',
            count: gminy.length,
            data: gminy
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch municipalities',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/autocomplete/gmina?q=krakow&wojewodztwo=malopolskie
 * Auto-complete for municipality names
 */
router.get('/autocomplete/gmina', (req, res) => {
    try {
        const { q, wojewodztwo } = req.query;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        const suggestions = terytService.autocompleteGmina(q, wojewodztwo);

        res.json({
            success: true,
            query: q,
            count: suggestions.length,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Auto-complete failed',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/autocomplete/powiat?q=krak&wojewodztwo=malopolskie
 * Auto-complete for county names
 */
router.get('/autocomplete/powiat', (req, res) => {
    try {
        const { q, wojewodztwo } = req.query;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        const suggestions = terytService.autocompletePowiat(q, wojewodztwo);

        res.json({
            success: true,
            query: q,
            count: suggestions.length,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Auto-complete failed',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/autocomplete?q=warszawa&type=gmina&wojewodztwo=mazowieckie
 * Universal auto-complete (gmina, powiat, or both)
 */
router.get('/autocomplete', (req, res) => {
    try {
        const { q, type = 'all', wojewodztwo } = req.query;

        if (!q || q.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        const suggestions = terytService.getSuggestions(q, type, wojewodztwo);

        res.json({
            success: true,
            query: q,
            type,
            count: suggestions.length,
            suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Auto-complete failed',
            message: error.message
        });
    }
});

/**
 * POST /api/teryt/validate
 * Validate territorial division data
 */
router.post('/validate', (req, res) => {
    try {
        const { gmina, powiat, wojewodztwo } = req.body;

        const validation = {
            wojewodztwo: {
                value: wojewodztwo,
                valid: wojewodztwo ? terytService.validateWojewodztwo(wojewodztwo) : false
            },
            powiat: {
                value: powiat,
                valid: powiat && wojewodztwo ? terytService.validatePowiat(powiat, wojewodztwo) : false
            },
            gmina: {
                value: gmina,
                valid: gmina && powiat && wojewodztwo
                    ? terytService.validateGmina(gmina, powiat, wojewodztwo)
                    : false
            }
        };

        const allValid = validation.wojewodztwo.valid &&
                        validation.powiat.valid &&
                        validation.gmina.valid;

        res.json({
            success: true,
            valid: allValid,
            details: validation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Validation failed',
            message: error.message
        });
    }
});

/**
 * GET /api/teryt/info?gmina=Kraków&powiat=Kraków&wojewodztwo=małopolskie
 * Get complete location information
 */
router.get('/info', (req, res) => {
    try {
        const { gmina, powiat, wojewodztwo } = req.query;

        if (!gmina || !powiat || !wojewodztwo) {
            return res.status(400).json({
                success: false,
                error: 'gmina, powiat, and wojewodztwo parameters are required'
            });
        }

        const info = terytService.getLocationInfo(gmina, powiat, wojewodztwo);

        res.json({
            success: true,
            data: info
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get location info',
            message: error.message
        });
    }
});

module.exports = router;
