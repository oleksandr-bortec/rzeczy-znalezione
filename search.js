/* =====================================================
   RZECZY ZNALEZIONE - Search Page Logic
   ===================================================== */

// Use constants from api.js if available
const CATEGORIES = (typeof API_CATEGORIES !== 'undefined') ? API_CATEGORIES : {
    'phone': { pl: 'Telefon', icon: 'fa-mobile-alt' },
    'documents': { pl: 'Dokumenty', icon: 'fa-file-alt' },
    'jewelry': { pl: 'Bizuteria', icon: 'fa-gem' },
    'keys': { pl: 'Klucze', icon: 'fa-key' },
    'wallet': { pl: 'Portfel', icon: 'fa-wallet' },
    'clothing': { pl: 'Odziez', icon: 'fa-tshirt' },
    'electronics': { pl: 'Elektronika', icon: 'fa-laptop' },
    'bicycle': { pl: 'Rower', icon: 'fa-bicycle' },
    'other': { pl: 'Inne', icon: 'fa-box' }
};

const STATUSES = (typeof API_STATUSES !== 'undefined') ? API_STATUSES : {
    'stored': { pl: 'Przechowywany', icon: 'fa-box' },
    'returned': { pl: 'Zwrocony wlascicielowi', icon: 'fa-check-circle' },
    'liquidated': { pl: 'Zlikwidowany', icon: 'fa-times-circle' }
};

// State
let currentView = 'grid';
let currentPage = 1;
let currentFilters = {};
let searchResults = [];
let map = null;
let markers = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeFilters();
    initializeViewToggle();
    initializeModal();
    initializeLanguageSwitcher();
    initializeAuth();
    loadStatistics();
});

/**
 * Initialize authentication
 */
async function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const navAuth = document.getElementById('navAuth');

    if (!navAuth) return;

    // Check if user is logged in
    if (typeof api !== 'undefined' && api.isAuthenticated()) {
        // Fetch current user data to ensure we have the latest info
        await api.getCurrentUser();
        updateAuthUI(true);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

function updateAuthUI(isLoggedIn) {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;

    if (isLoggedIn && typeof api !== 'undefined' && api.user) {
        const isAdmin = api.user.role === 'admin';
        const adminMenuItem = isAdmin ? '<a href="admin.html" id="adminBtn"><i class="fas fa-user-shield"></i> Administrator</a>' : '';

        navAuth.innerHTML = `
            <div class="user-menu">
                <button type="button" class="user-menu-btn" id="userMenuBtn">
                    <i class="fas fa-user-circle"></i>
                    <span>${api.user.name || api.user.email}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-menu-dropdown" id="userMenuDropdown">
                    <a href="profile.html" id="profileBtn"><i class="fas fa-user"></i> Profil</a>
                    ${adminMenuItem}
                    <a href="javascript:void(0)" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Wyloguj</a>
                </div>
            </div>
        `;

        const userMenuBtn = document.getElementById('userMenuBtn');
        const dropdown = document.getElementById('userMenuDropdown');

        userMenuBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                dropdown.classList.remove('show');
            }
        });

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            if (typeof api !== 'undefined') {
                await api.logout();
                updateAuthUI(false);
                showToast('success', 'Sukces', 'Wylogowano pomyslnie');
            }
        });
    } else {
        navAuth.innerHTML = `<a href="javascript:void(0)" class="nav-link" id="loginBtn" data-i18n="nav_login">Zaloguj</a>`;
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

function showLoginModal() {
    let modal = document.getElementById('loginModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeLoginModal()"></div>
            <div class="modal-content" style="max-width: 400px;">
                <button type="button" class="modal-close" onclick="closeLoginModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <h2 style="margin-bottom: 1.5rem;"><i class="fas fa-sign-in-alt"></i> Logowanie</h2>
                    <form id="loginForm" class="item-form">
                        <div class="form-group">
                            <label for="loginEmail" class="required">Email</label>
                            <input type="email" id="loginEmail" required placeholder="twoj@email.pl">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword" class="required">Haslo</label>
                            <input type="password" id="loginPassword" required placeholder="Twoje haslo">
                        </div>
                        <div class="form-actions" style="justify-content: flex-end;">
                            <button type="button" class="btn btn-outline" onclick="closeLoginModal()">Anuluj</button>
                            <button type="submit" class="btn btn-primary">Zaloguj</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                if (typeof api !== 'undefined') {
                    await api.login(email, password);
                    closeLoginModal();
                    updateAuthUI(true);
                    showToast('success', 'Sukces', 'Zalogowano pomyslnie');
                }
            } catch (error) {
                showToast('error', 'Blad', error.message || 'Blad logowania');
            }
        });
    }

    modal.classList.add('active');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Initialize language switcher
 */
function initializeLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');

    // Set active button based on current language
    const currentLang = typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'pl';
    langBtns.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (typeof i18n !== 'undefined') {
                i18n.setLanguage(lang);

                // Update active state
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // Initialize UI with current language on page load
    if (typeof i18n !== 'undefined') {
        i18n.updateUI();
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchQuery');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        currentPage = 1;
        performSearch();
    });

    // Debounced live search
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.length >= 3 || searchInput.value.length === 0) {
                currentPage = 1;
                performSearch();
            }
        }, 500);
    });
}

/**
 * Initialize filters
 */
function initializeFilters() {
    const filtersToggle = document.getElementById('filtersToggle');
    const advancedFilters = document.getElementById('advancedFilters');
    const clearFilters = document.getElementById('clearFilters');

    // Toggle filters visibility
    filtersToggle.addEventListener('click', function() {
        advancedFilters.classList.toggle('show');
        filtersToggle.classList.toggle('active');
    });

    // Clear filters
    clearFilters.addEventListener('click', function() {
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterVoivodeship').value = '';
        document.getElementById('filterCounty').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterStatus').value = '';
        currentPage = 1;
        performSearch();
    });

    // Filter change handlers
    const filterInputs = advancedFilters.querySelectorAll('select, input');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            currentPage = 1;
            performSearch();
        });
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            performSearch();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        currentPage++;
        performSearch();
    });
}

/**
 * Initialize view toggle
 */
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            setView(view);
        });
    });
}

/**
 * Set current view
 */
function setView(view) {
    currentView = view;

    // Update buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Show correct container
    document.getElementById('resultsGrid').style.display = view === 'grid' ? 'grid' : 'none';
    document.getElementById('resultsList').style.display = view === 'list' ? 'flex' : 'none';
    document.getElementById('resultsMap').style.display = view === 'map' ? 'block' : 'none';

    // Initialize map if needed
    if (view === 'map' && !map) {
        initializeMap();
    }

    // Re-render results
    if (searchResults.length > 0) {
        renderResults(searchResults);
    }
}

/**
 * Perform search
 */
async function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();

    // Collect filters
    currentFilters = {
        query: query,
        category: document.getElementById('filterCategory').value,
        voivodeship: document.getElementById('filterVoivodeship').value,
        county: document.getElementById('filterCounty').value,
        date_from: document.getElementById('filterDateFrom').value,
        date_to: document.getElementById('filterDateTo').value,
        status: document.getElementById('filterStatus').value,
        page: currentPage,
        perPage: 12
    };

    // Show loading
    showLoading();

    try {
        const response = await daneGovAPI.searchLostItems(currentFilters);
        searchResults = response.data;

        if (searchResults.length > 0) {
            showResults(response);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Search error:', error);
        showToast('error', 'Blad', 'Wystapil blad podczas wyszukiwania');
        showNoResults();
    }
}

/**
 * Show loading state
 */
function showLoading() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('resultsGrid').style.display = 'none';
    document.getElementById('resultsList').style.display = 'none';
    document.getElementById('resultsMap').style.display = 'none';
    document.getElementById('resultsHeader').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

/**
 * Show results
 */
function showResults(response) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('resultsHeader').style.display = 'flex';
    document.getElementById('pagination').style.display = 'flex';

    // Update results info
    document.getElementById('resultsCount').textContent = response.meta.total;
    const queryText = currentFilters.query ? ` dla "${currentFilters.query}"` : '';
    document.getElementById('resultsQuery').textContent = queryText;

    // Update pagination
    document.getElementById('currentPage').textContent = response.meta.page;
    document.getElementById('totalPages').textContent = response.meta.totalPages;
    document.getElementById('prevPage').disabled = response.meta.page <= 1;
    document.getElementById('nextPage').disabled = response.meta.page >= response.meta.totalPages;

    // Render results in current view
    renderResults(response.data);
}

/**
 * Show no results state
 */
function showNoResults() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'block';
    document.getElementById('resultsGrid').style.display = 'none';
    document.getElementById('resultsList').style.display = 'none';
    document.getElementById('resultsMap').style.display = 'none';
    document.getElementById('resultsHeader').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

/**
 * Render results based on current view
 */
function renderResults(items) {
    if (currentView === 'grid') {
        renderGridView(items);
    } else if (currentView === 'list') {
        renderListView(items);
    } else if (currentView === 'map') {
        renderMapView(items);
    }
}

/**
 * Render grid view
 */
function renderGridView(items) {
    const container = document.getElementById('resultsGrid');
    container.style.display = 'grid';

    container.innerHTML = items.map(item => `
        <div class="result-card" onclick="showItemDetail('${item.id}')">
            <div class="result-card-image">
                ${item.photo_url
                    ? `<img src="${item.photo_url}" alt="${item.item_name}">`
                    : `<i class="fas ${getCategoryIcon(item.category)}"></i>`
                }
                <span class="result-card-category">${item.category_pl}</span>
                <span class="result-card-status ${item.status}">${STATUSES[item.status]?.pl || item.status}</span>
            </div>
            <div class="result-card-body">
                <h3 class="result-card-title">${item.item_name}</h3>
                <p class="result-card-description">${item.description}</p>
                <div class="result-card-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(item.date_found)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${item.municipality}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render list view
 */
function renderListView(items) {
    const container = document.getElementById('resultsList');
    container.style.display = 'flex';

    container.innerHTML = items.map(item => `
        <div class="result-list-item" onclick="showItemDetail('${item.id}')">
            <div class="result-list-icon">
                <i class="fas ${getCategoryIcon(item.category)}"></i>
            </div>
            <div class="result-list-content">
                <div class="result-list-header">
                    <span class="result-list-title">${item.item_name}</span>
                    <span class="result-card-status ${item.status}">${STATUSES[item.status]?.pl || item.status}</span>
                </div>
                <p class="result-list-description">${item.description}</p>
                <div class="result-list-meta">
                    <span><i class="fas fa-tag"></i> ${item.category_pl}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(item.date_found)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${item.location_found}</span>
                    <span><i class="fas fa-building"></i> ${item.municipality}, ${item.voivodeship}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize map
 */
function initializeMap() {
    const mapContainer = document.getElementById('resultsMap');
    mapContainer.style.display = 'block';

    map = L.map('resultsMap').setView([52.0, 19.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

/**
 * Render map view
 */
function renderMapView(items) {
    const mapContainer = document.getElementById('resultsMap');
    mapContainer.style.display = 'block';

    if (!map) {
        initializeMap();
    }

    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add markers for items with coordinates
    const bounds = [];

    items.forEach(item => {
        if (item.coordinates && item.coordinates.lat && item.coordinates.lon) {
            const marker = L.marker([item.coordinates.lat, item.coordinates.lon])
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h4>${item.item_name}</h4>
                        <p>${item.category_pl}</p>
                        <p><i class="fas fa-calendar"></i> ${formatDate(item.date_found)}</p>
                        <button class="btn btn-primary btn-sm" onclick="showItemDetail('${item.id}')">
                            Zobacz szczegoly
                        </button>
                    </div>
                `);

            markers.push(marker);
            bounds.push([item.coordinates.lat, item.coordinates.lon]);
        }
    });

    // Fit map to markers
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Initialize modal
 */
function initializeModal() {
    const modal = document.getElementById('itemModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

/**
 * Show item detail modal
 */
function showItemDetail(itemId) {
    const item = searchResults.find(i => i.id === itemId);
    if (!item) return;

    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="item-detail-header">
            <div class="item-detail-image">
                ${item.photo_url
                    ? `<img src="${item.photo_url}" alt="${item.item_name}">`
                    : `<i class="fas ${getCategoryIcon(item.category)}"></i>`
                }
            </div>
            <div class="item-detail-info">
                <span class="item-detail-category">${item.category_pl}</span>
                <h2 class="item-detail-title">${item.item_name}</h2>
                <p class="item-detail-id">ID: ${item.id}</p>
                <span class="item-detail-status ${item.status}">
                    <i class="fas ${STATUSES[item.status]?.icon}"></i>
                    ${STATUSES[item.status]?.pl || item.status}
                </span>
            </div>
        </div>

        <div class="item-detail-section">
            <h4><i class="fas fa-info-circle"></i> Opis przedmiotu</h4>
            <p>${item.description}</p>
        </div>

        <div class="item-detail-section">
            <h4><i class="fas fa-map-marker-alt"></i> Miejsce znalezienia</h4>
            <p>${item.location_found}</p>
            <div class="item-detail-grid">
                <div class="item-detail-field">
                    <span class="item-detail-label">Gmina</span>
                    <span class="item-detail-value">${item.municipality}</span>
                </div>
                <div class="item-detail-field">
                    <span class="item-detail-label">Powiat</span>
                    <span class="item-detail-value">${item.county}</span>
                </div>
                <div class="item-detail-field">
                    <span class="item-detail-label">Wojewodztwo</span>
                    <span class="item-detail-value">${capitalize(item.voivodeship)}</span>
                </div>
                <div class="item-detail-field">
                    <span class="item-detail-label">Data znalezienia</span>
                    <span class="item-detail-value">${formatDate(item.date_found)}</span>
                </div>
            </div>
        </div>

        ${item.estimated_value ? `
        <div class="item-detail-section">
            <h4><i class="fas fa-money-bill-wave"></i> Szacunkowa wartosc</h4>
            <p>${item.estimated_value.toLocaleString('pl-PL')} PLN</p>
        </div>
        ` : ''}

        <div class="item-detail-section">
            <h4><i class="fas fa-clock"></i> Termin odbioru</h4>
            <p>Do ${formatDate(item.collection_deadline)}</p>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">
                Zgodnie z ustawa z dnia 20 lutego 2015 r. o rzeczach znalezionych
            </p>
        </div>

        <div class="item-detail-section">
            <h4><i class="fas fa-building"></i> Miejsce odbioru</h4>
            <div class="office-card">
                <h5>${item.lost_and_found_office.name}</h5>
                <p><i class="fas fa-map-marker-alt"></i> ${item.lost_and_found_office.address}</p>
                <p><i class="fas fa-phone"></i> <a href="tel:${item.lost_and_found_office.phone}">${item.lost_and_found_office.phone}</a></p>
                ${item.lost_and_found_office.email ? `
                    <p><i class="fas fa-envelope"></i> <a href="mailto:${item.lost_and_found_office.email}">${item.lost_and_found_office.email}</a></p>
                ` : ''}
                ${item.lost_and_found_office.opening_hours ? `
                    <p><i class="fas fa-clock"></i> ${item.lost_and_found_office.opening_hours}</p>
                ` : ''}
            </div>
        </div>
    `;

    document.getElementById('itemModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Load statistics
 */
async function loadStatistics() {
    try {
        const stats = await daneGovAPI.getStatistics();
        document.getElementById('statTotal').textContent = stats.total.toLocaleString('pl-PL');
        document.getElementById('statStored').textContent = stats.stored.toLocaleString('pl-PL');
        document.getElementById('statReturned').textContent = stats.returned.toLocaleString('pl-PL');
        document.getElementById('statSources').textContent = stats.sources.toLocaleString('pl-PL');
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

/**
 * Helper: Get category icon
 */
function getCategoryIcon(category) {
    return CATEGORIES[category]?.icon || 'fa-box';
}

/**
 * Helper: Format date
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Helper: Capitalize string
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Toast notification
 */
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// Make functions globally available
window.showItemDetail = showItemDetail;
window.closeModal = closeModal;
