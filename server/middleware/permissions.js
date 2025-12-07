/**
 * Permissions and Access Control System
 * Centralized permission checks for the application
 */

// Define permissions for each role
const PERMISSIONS = {
    admin: {
        // User management
        users_view: true,
        users_create: true,
        users_update: true,
        users_delete: true,
        users_manage_roles: true,

        // Item management
        items_view: true,
        items_create: true,
        items_update: true,
        items_delete: true,
        items_bulk: true,

        // System
        system_settings: true,
        audit_log_view: true,
        stats_view: true,
        export_all: true,
        import_data: true,

        // Data sync
        dane_gov_sync: true,
        dane_gov_publish: true
    },

    official: {
        // User management
        users_view: false,
        users_create: false,
        users_update: false,
        users_delete: false,
        users_manage_roles: false,

        // Item management
        items_view: true,
        items_create: true,
        items_update: true,  // Can update own organization's items
        items_delete: false,  // Cannot delete
        items_bulk: true,

        // System
        system_settings: false,
        audit_log_view: false,  // Can only see own activity
        stats_view: true,
        export_all: false,  // Can only export own data
        import_data: true,

        // Data sync
        dane_gov_sync: true,
        dane_gov_publish: true
    },

    user: {
        // User management
        users_view: false,
        users_create: false,
        users_update: false,
        users_delete: false,
        users_manage_roles: false,

        // Item management
        items_view: true,  // Read-only access
        items_create: false,
        items_update: false,
        items_delete: false,
        items_bulk: false,

        // System
        system_settings: false,
        audit_log_view: false,
        stats_view: true,  // Can view public stats
        export_all: false,
        import_data: false,

        // Data sync
        dane_gov_sync: false,
        dane_gov_publish: false
    }
};

/**
 * Check if user has permission
 * @param {object} user - User object with role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function hasPermission(user, permission) {
    if (!user || !user.role) {
        return false;
    }

    const rolePermissions = PERMISSIONS[user.role];
    if (!rolePermissions) {
        return false;
    }

    return rolePermissions[permission] === true;
}

/**
 * Check if user can access resource
 * @param {object} user - User object
 * @param {object} resource - Resource object (item, user, etc.)
 * @param {string} action - Action to perform (view, update, delete)
 * @returns {boolean}
 */
function canAccessResource(user, resource, action) {
    if (!user || !resource) {
        return false;
    }

    // Admin can access everything
    if (user.role === 'admin') {
        return true;
    }

    // Officials can only access their organization's resources
    if (user.role === 'official') {
        // For items
        if (resource.created_by) {
            // Check if item belongs to user's organization
            // In a real implementation, we would check organization match
            return resource.created_by === user.id;
        }

        // For users, officials cannot access other users
        if (resource.id && resource.email) {
            return resource.id === user.id;  // Can only access own user record
        }
    }

    // Regular users can only view public data
    if (user.role === 'user') {
        return action === 'view';
    }

    return false;
}

/**
 * Middleware to check specific permission
 * @param {string} permission - Permission to check
 */
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!hasPermission(req.user, permission)) {
            return res.status(403).json({
                error: 'Permission denied',
                required_permission: permission,
                user_role: req.user.role
            });
        }

        next();
    };
}

/**
 * Middleware to check resource access
 * @param {string} action - Action to perform
 * @param {function} getResource - Function to get resource from request
 */
function requireResourceAccess(action, getResource) {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            const resource = await getResource(req);

            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }

            if (!canAccessResource(req.user, resource, action)) {
                return res.status(403).json({
                    error: 'Access denied to this resource',
                    action: action
                });
            }

            // Attach resource to request for later use
            req.resource = resource;
            next();

        } catch (error) {
            return res.status(500).json({ error: 'Error checking resource access' });
        }
    };
}

/**
 * Get user's effective permissions
 * @param {object} user - User object with role
 * @returns {object} Object containing all permissions
 */
function getUserPermissions(user) {
    if (!user || !user.role) {
        return {};
    }

    return PERMISSIONS[user.role] || {};
}

/**
 * Filter items based on user's access level
 * @param {object} user - User object
 * @param {array} items - Array of items
 * @returns {array} Filtered items
 */
function filterAccessibleItems(user, items) {
    if (!user || !items) {
        return [];
    }

    // Admin sees everything
    if (user.role === 'admin') {
        return items;
    }

    // Officials see their organization's items
    if (user.role === 'official') {
        return items.filter(item =>
            item.created_by === user.id ||
            item.organization === user.organization
        );
    }

    // Regular users see all items (read-only)
    return items;
}

module.exports = {
    PERMISSIONS,
    hasPermission,
    canAccessResource,
    requirePermission,
    requireResourceAccess,
    getUserPermissions,
    filterAccessibleItems
};
