/* =====================================================
   RZECZY ZNALEZIONE - API Service v2.0
   Supports: Local backend + dane.gov.pl fallback
   ===================================================== */

// API Configuration
const LOCAL_API_URL = '/api';
const DANE_GOV_API_URL = 'https://api.dane.gov.pl';

// Category mappings (API version)
const API_CATEGORIES = {
    phone: { pl: 'Telefon', en: 'Phone', icon: 'fa-mobile-alt' },
    documents: { pl: 'Dokumenty', en: 'Documents', icon: 'fa-file-alt' },
    jewelry: { pl: 'Bizuteria', en: 'Jewelry', icon: 'fa-gem' },
    keys: { pl: 'Klucze', en: 'Keys', icon: 'fa-key' },
    wallet: { pl: 'Portfel', en: 'Wallet', icon: 'fa-wallet' },
    clothing: { pl: 'Odziez', en: 'Clothing', icon: 'fa-tshirt' },
    electronics: { pl: 'Elektronika', en: 'Electronics', icon: 'fa-laptop' },
    bicycle: { pl: 'Rower', en: 'Bicycle', icon: 'fa-bicycle' },
    other: { pl: 'Inne', en: 'Other', icon: 'fa-box' }
};

// Status mappings (API version)
const API_STATUSES = {
    stored: { pl: 'Przechowywany', en: 'Stored', icon: 'fa-box', class: 'stored' },
    returned: { pl: 'Zwrocony', en: 'Returned', icon: 'fa-check-circle', class: 'returned' },
    liquidated: { pl: 'Zlikwidowany', en: 'Liquidated', icon: 'fa-times-circle', class: 'liquidated' }
};

// Voivodeships
const VOIVODESHIPS = [
    { id: 'dolnoslaskie', name: 'Dolnoslaskie', nameEn: 'Lower Silesian' },
    { id: 'kujawsko-pomorskie', name: 'Kujawsko-pomorskie', nameEn: 'Kuyavian-Pomeranian' },
    { id: 'lubelskie', name: 'Lubelskie', nameEn: 'Lublin' },
    { id: 'lubuskie', name: 'Lubuskie', nameEn: 'Lubusz' },
    { id: 'lodzkie', name: 'Lodzkie', nameEn: 'Lodz' },
    { id: 'malopolskie', name: 'Malopolskie', nameEn: 'Lesser Poland' },
    { id: 'mazowieckie', name: 'Mazowieckie', nameEn: 'Masovian' },
    { id: 'opolskie', name: 'Opolskie', nameEn: 'Opole' },
    { id: 'podkarpackie', name: 'Podkarpackie', nameEn: 'Subcarpathian' },
    { id: 'podlaskie', name: 'Podlaskie', nameEn: 'Podlaskie' },
    { id: 'pomorskie', name: 'Pomorskie', nameEn: 'Pomeranian' },
    { id: 'slaskie', name: 'Slaskie', nameEn: 'Silesian' },
    { id: 'swietokrzyskie', name: 'Swietokrzyskie', nameEn: 'Holy Cross' },
    { id: 'warminsko-mazurskie', name: 'Warminsko-mazurskie', nameEn: 'Warmian-Masurian' },
    { id: 'wielkopolskie', name: 'Wielkopolskie', nameEn: 'Greater Poland' },
    { id: 'zachodniopomorskie', name: 'Zachodniopomorskie', nameEn: 'West Pomeranian' }
];

/**
 * API Service for Rzeczy Znalezione
 * Connects to local backend first, falls back to dane.gov.pl
 */
class RzeczyZnalezioneAPI {
    constructor() {
        this.localUrl = LOCAL_API_URL;
        this.daneGovUrl = DANE_GOV_API_URL;
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('auth_user') || 'null');
        this.useLocalBackend = true;
    }

    /**
     * Get auth headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Make API request to local backend
     */
    async request(endpoint, options = {}) {
        const url = `${this.localUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            // Handle auth errors
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    /**
     * Login user
     */
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        this.token = response.token;
        this.user = response.user;

        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return response;
    }

    /**
     * Register new user
     */
    async register(data) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        this.token = response.token;
        this.user = response.user;

        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return response;
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.token) {
                await this.request('/auth/logout', { method: 'POST' });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }

    /**
     * Get current user
     */
    async getCurrentUser() {
        if (!this.token) return null;

        try {
            const response = await this.request('/auth/me');
            this.user = response.user;
            localStorage.setItem('auth_user', JSON.stringify(this.user));
            return this.user;
        } catch (error) {
            this.logout();
            return null;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(data) {
        const response = await this.request('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        this.user = response.user;
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return response;
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        return this.request('/auth/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }

    /**
     * Check if logged in
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Check if user has role
     */
    hasRole(...roles) {
        return this.user && roles.includes(this.user.role);
    }

    // =====================================================
    // ITEMS
    // =====================================================

    /**
     * Search for lost and found items
     */
    async searchItems(filters = {}) {
        const params = new URLSearchParams();

        if (filters.query) params.append('q', filters.query);
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.voivodeship) params.append('voivodeship', filters.voivodeship);
        if (filters.county) params.append('county', filters.county);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);
        if (filters.page) params.append('page', filters.page);
        if (filters.per_page) params.append('per_page', filters.per_page || filters.perPage);

        return this.request(`/items?${params}`);
    }

    /**
     * Alias for backward compatibility
     */
    async searchLostItems(filters = {}) {
        return this.searchItems(filters);
    }

    /**
     * Get single item
     */
    async getItem(id) {
        return this.request(`/items/${id}`);
    }

    /**
     * Create new item
     */
    async createItem(data) {
        return this.request('/items', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update item
     */
    async updateItem(id, data) {
        return this.request(`/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete item
     */
    async deleteItem(id) {
        return this.request(`/items/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Bulk create items (for Excel import)
     */
    async bulkCreateItems(items) {
        return this.request('/items/bulk', {
            method: 'POST',
            body: JSON.stringify({ items })
        });
    }

    // =====================================================
    // STATISTICS
    // =====================================================

    /**
     * Get statistics
     */
    async getStatistics() {
        try {
            const response = await this.request('/stats');
            return response.data;
        } catch (error) {
            // Fallback to default stats
            return {
                total: 0,
                stored: 0,
                returned: 0,
                liquidated: 0,
                sources: 0
            };
        }
    }

    /**
     * Get statistics by category
     */
    async getStatsByCategory() {
        return this.request('/stats/by-category');
    }

    /**
     * Get statistics by voivodeship
     */
    async getStatsByVoivodeship() {
        return this.request('/stats/by-voivodeship');
    }

    /**
     * Get statistics by month
     */
    async getStatsByMonth() {
        return this.request('/stats/by-month');
    }

    /**
     * Get recent items
     */
    async getRecentItems(limit = 10) {
        return this.request(`/stats/recent?limit=${limit}`);
    }

    // =====================================================
    // DANE.GOV.PL INTEGRATION
    // =====================================================

    /**
     * Search dane.gov.pl datasets
     */
    async searchDaneGov(query = '') {
        return this.request(`/dane-gov/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get dane.gov.pl dataset
     */
    async getDaneGovDataset(id) {
        return this.request(`/dane-gov/datasets/${id}`);
    }

    /**
     * Export items to dane.gov.pl format
     */
    async exportToDaneGov(format = 'json', filters = {}) {
        return this.request('/dane-gov/export', {
            method: 'POST',
            body: JSON.stringify({ format, ...filters })
        });
    }

    /**
     * Import items from dane.gov.pl
     */
    async importFromDaneGov(resourceId) {
        return this.request('/dane-gov/import', {
            method: 'POST',
            body: JSON.stringify({ resource_id: resourceId })
        });
    }

    // =====================================================
    // USERS (Admin only)
    // =====================================================

    /**
     * Get all users
     */
    async getUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/users?${params}`);
    }

    /**
     * Get single user
     */
    async getUser(id) {
        return this.request(`/users/${id}`);
    }

    /**
     * Create user
     */
    async createUser(data) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update user
     */
    async updateUser(id, data) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete/deactivate user
     */
    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }

    // =====================================================
    // HEALTH CHECK
    // =====================================================

    /**
     * Check API health
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.localUrl}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Create global API instance
const api = new RzeczyZnalezioneAPI();

// Legacy alias for backward compatibility
const daneGovAPI = {
    searchLostItems: (filters) => api.searchItems(filters),
    getStatistics: () => api.getStatistics(),
    searchDatasets: (query) => api.searchDaneGov(query),
    getDataset: (id) => api.getDaneGovDataset(id)
};

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration.scope);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RzeczyZnalezioneAPI, api, daneGovAPI, API_CATEGORIES, API_STATUSES, VOIVODESHIPS };
}
