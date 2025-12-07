/* =====================================================
   RZECZY ZNALEZIONE - Admin Panel Application Logic
   v2.0 - Updated schema with municipality, county, voivodeship
   ===================================================== */

// =====================================================
// DATA STORAGE
// =====================================================
let items = [];
let currentStep = 1;
let editingIndex = -1;

// Category mappings (English keys with Polish labels)
// Use API_CATEGORIES from api.js if available, otherwise define locally
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

// Status mappings
// Use API_STATUSES from api.js if available, otherwise define locally
const STATUSES = (typeof API_STATUSES !== 'undefined') ? API_STATUSES : {
    'stored': { pl: 'Przechowywany', icon: 'fa-box' },
    'returned': { pl: 'Zwrocony wlascicielowi', icon: 'fa-check-circle' },
    'liquidated': { pl: 'Zlikwidowany', icon: 'fa-times-circle' }
};

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateFoundInput = document.getElementById('dataZnalezienia');
    if (dateFoundInput) {
        dateFoundInput.value = today;
    }

    // Set default collection deadline (2 years from now)
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
    const deadlineInput = document.getElementById('dataWaznosci');
    if (deadlineInput) {
        deadlineInput.value = twoYearsLater.toISOString().split('T')[0];
    }

    // Initialize event listeners
    initializeDropZone();
    initializeFormListeners();
    initializeNavigationListeners();
    initializeExportListeners();
    initializeLanguageSwitcher();
    await initializeAuth();

    // Show first step
    showStep(1);
}

// =====================================================
// LANGUAGE SWITCHER
// =====================================================
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

// =====================================================
// AUTHENTICATION
// =====================================================
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
        const adminMenuItem = isAdmin ? `<a href="admin.html" id="adminBtn"><i class="fas fa-user-shield"></i> <span data-i18n="admin_panel">Administrator</span></a>` : '';

        navAuth.innerHTML = `
            <div class="user-menu">
                <button type="button" class="user-menu-btn" id="userMenuBtn">
                    <i class="fas fa-user-circle"></i>
                    <span>${api.user.name || api.user.email}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-menu-dropdown" id="userMenuDropdown">
                    <a href="profile.html" id="profileBtn"><i class="fas fa-user"></i> <span data-i18n="nav_profile">Profil</span></a>
                    ${adminMenuItem}
                    <a href="javascript:void(0)" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> <span data-i18n="nav_logout">Wyloguj</span></a>
                </div>
            </div>
        `;

        // Update translations for dynamically added elements
        if (typeof i18n !== 'undefined') {
            i18n.updateUI();
        }

        // Add dropdown toggle
        const userMenuBtn = document.getElementById('userMenuBtn');
        const dropdown = document.getElementById('userMenuDropdown');

        userMenuBtn.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
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
                const logoutMsg = (typeof i18n !== 'undefined') ? i18n.t('logout_success') : 'Wylogowano pomyslnie';
                showToast('success', 'Sukces', logoutMsg);
            }
        });
    } else {
        navAuth.innerHTML = `<a href="javascript:void(0)" class="nav-link" id="loginBtn" data-i18n="nav_login">Zaloguj</a>`;

        // Update translations
        if (typeof i18n !== 'undefined') {
            i18n.updateUI();
        }

        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

function showLoginModal() {
    // Create modal if it doesn't exist
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
                    <h2 style="margin-bottom: 1.5rem;"><i class="fas fa-sign-in-alt"></i> <span data-i18n="login">Logowanie</span></h2>
                    <form id="loginForm" class="item-form">
                        <div class="form-group">
                            <label for="loginEmail" class="required" data-i18n="email">Email</label>
                            <input type="email" id="loginEmail" required placeholder="twoj@email.pl">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword" class="required" data-i18n="password">Haslo</label>
                            <input type="password" id="loginPassword" required placeholder="Twoje haslo">
                        </div>
                        <div class="form-actions" style="justify-content: flex-end;">
                            <button type="button" class="btn btn-outline" onclick="closeLoginModal()"><span data-i18n="cancel">Anuluj</span></button>
                            <button type="submit" class="btn btn-primary"><span data-i18n="login_button">Zaloguj</span></button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Update translations for modal elements
        if (typeof i18n !== 'undefined') {
            i18n.updateUI();
        }

        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                if (typeof api !== 'undefined') {
                    await api.login(email, password);
                    closeLoginModal();
                    updateAuthUI(true);
                    const successMsg = (typeof i18n !== 'undefined') ? i18n.t('login_success') : 'Zalogowano pomyslnie';
                    showToast('success', 'Sukces', successMsg);
                }
            } catch (error) {
                const errorMsg = error.message || ((typeof i18n !== 'undefined') ? i18n.t('invalid_credentials') : 'Blad logowania');
                showToast('error', 'Blad', errorMsg);
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

// =====================================================
// DRAG & DROP FILE UPLOAD
// =====================================================
function initializeDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const removeFile = document.getElementById('removeFile');

    if (!dropZone || !fileInput) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when file is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, false);

    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Remove file button
    if (removeFile) {
        removeFile.addEventListener('click', () => {
            fileInput.value = '';
            document.getElementById('fileInfo').style.display = 'none';
            dropZone.style.display = 'block';
            items = [];
        });
    }

    // Download template
    const downloadTemplate = document.getElementById('downloadTemplate');
    if (downloadTemplate) {
        downloadTemplate.addEventListener('click', (e) => {
            e.preventDefault();
            downloadExcelTemplate();
        });
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleFile(file) {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        showToast('error', 'Blad', 'Nieobslugiwany format pliku. Uzyj .xlsx, .xls lub .csv');
        return;
    }

    // Show file info
    document.getElementById('dropZone').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'flex';
    document.getElementById('fileName').textContent = file.name;

    // Parse file
    parseFile(file);
}

function parseFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                showToast('warning', 'Uwaga', 'Plik jest pusty lub ma nieprawidlowy format');
                return;
            }

            // Map data to our format
            items = jsonData.map((row, index) => mapRowToItem(row, index));

            showToast('success', 'Sukces', `Wczytano ${items.length} przedmiotow z pliku`);

            // Go to preview
            setTimeout(() => {
                showStep(3);
            }, 500);

        } catch (error) {
            console.error('Error parsing file:', error);
            showToast('error', 'Blad', 'Nie udalo sie wczytac pliku. Sprawdz format danych.');
        }
    };

    reader.readAsArrayBuffer(file);
}

function mapRowToItem(row, index) {
    const today = new Date().toISOString().split('T')[0];
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

    return {
        id: row.id || row.ID || row.Id || generateId(index),
        item_name: row.item_name || row['Nazwa przedmiotu'] || row.name || '',
        category: mapCategory(row.category || row.kategoria || row.Kategoria || 'other'),
        description: row.description || row.opis || row.Opis || '',
        date_found: formatDate(row.date_found || row.data_znalezienia || row['Data znalezienia'] || today),
        location_found: row.location_found || row.miejsce_znalezienia || row['Miejsce znalezienia'] || '',
        location_type: row.location_type || row.typ_miejsca || '',
        municipality: row.municipality || row.gmina || row.Gmina || '',
        county: row.county || row.powiat || row.Powiat || '',
        voivodeship: row.voivodeship || row.wojewodztwo || row.Wojewodztwo || '',
        estimated_value: parseFloat(row.estimated_value || row.szacunkowa_wartosc || 0) || null,
        status: mapStatus(row.status || row.Status || 'stored'),
        collection_deadline: formatDate(row.collection_deadline || row.data_waznosci || twoYearsLater.toISOString().split('T')[0]),
        lost_and_found_office: {
            name: row.office_name || row['Nazwa biura'] || '',
            address: row.office_address || row['Adres biura'] || '',
            phone: row.office_phone || row.Telefon || '',
            email: row.office_email || row.Email || '',
            opening_hours: row.office_hours || row['Godziny otwarcia'] || ''
        },
        entry_date: today,
        update_date: today,
        photo_url: row.photo_url || row.zdjecie_url || '',
        notes: row.notes || row.uwagi || ''
    };
}

function mapCategory(value) {
    if (!value) return 'other';
    const lowerValue = value.toLowerCase();
    const categoryMap = {
        'telefon': 'phone',
        'phone': 'phone',
        'dokumenty': 'documents',
        'documents': 'documents',
        'bizuteria': 'jewelry',
        'jewelry': 'jewelry',
        'zegarek': 'jewelry',
        'klucze': 'keys',
        'keys': 'keys',
        'portfel': 'wallet',
        'wallet': 'wallet',
        'odziez': 'clothing',
        'clothing': 'clothing',
        'elektronika': 'electronics',
        'electronics': 'electronics',
        'rower': 'bicycle',
        'bicycle': 'bicycle',
        'inne': 'other',
        'other': 'other'
    };
    return categoryMap[lowerValue] || 'other';
}

function mapStatus(value) {
    if (!value) return 'stored';
    const lowerValue = value.toLowerCase();
    const statusMap = {
        'przechowywany': 'stored',
        'stored': 'stored',
        'oczekuje': 'stored',
        'zwrocony': 'returned',
        'returned': 'returned',
        'odebrane': 'returned',
        'zlikwidowany': 'liquidated',
        'liquidated': 'liquidated',
        'przekazane': 'liquidated'
    };
    return statusMap[lowerValue] || 'stored';
}

function formatDate(value) {
    if (!value) return '';

    try {
        // If it's already a string in correct format
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return value;
        }

        // If it's an Excel serial date number
        if (typeof value === 'number') {
            const date = new Date((value - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }

        // Try to parse as date
        const date = new Date(value);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
    } catch (e) {
        console.error('Date parsing error:', e);
    }

    return new Date().toISOString().split('T')[0];
}

function generateId(index) {
    const date = new Date();
    const year = date.getFullYear();
    const num = String(index + 1).padStart(4, '0');
    return `RZ/${year}/${num}`;
}

// =====================================================
// EXCEL TEMPLATE DOWNLOAD
// =====================================================
function downloadExcelTemplate() {
    const templateData = [
        {
            'ID': 'RZ/2024/0001',
            'Nazwa przedmiotu': 'Telefon Samsung Galaxy S23',
            'Kategoria': 'phone',
            'Opis': 'Telefon Samsung Galaxy S23, kolor czarny, pekniety ekran',
            'Data znalezienia': '2024-01-15',
            'Miejsce znalezienia': 'Autobus linii 144, przystanek Rynek',
            'Typ miejsca': 'public_transport',
            'Gmina': 'Krakow',
            'Powiat': 'Krakow',
            'Wojewodztwo': 'malopolskie',
            'Szacunkowa wartosc (PLN)': 2500,
            'Status': 'stored',
            'Termin odbioru': '2026-01-15',
            'Nazwa biura': 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            'Adres biura': 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            'Telefon': '+48 12 345 67 89',
            'Email': 'rzeczy.znalezione@powiat.krakow.pl',
            'Godziny otwarcia': 'Pon-Pt: 8:00-16:00',
            'Link do zdjecia': '',
            'Uwagi': ''
        },
        {
            'ID': 'RZ/2024/0002',
            'Nazwa przedmiotu': 'Portfel skorzany brazowy',
            'Kategoria': 'wallet',
            'Opis': 'Portfel skorzany brazowy, zawiera dokumenty',
            'Data znalezienia': '2024-01-16',
            'Miejsce znalezienia': 'Park Miejski, przy fontannie',
            'Typ miejsca': 'park',
            'Gmina': 'Krakow',
            'Powiat': 'Krakow',
            'Wojewodztwo': 'malopolskie',
            'Szacunkowa wartosc (PLN)': 150,
            'Status': 'stored',
            'Termin odbioru': '2026-01-16',
            'Nazwa biura': 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            'Adres biura': 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            'Telefon': '+48 12 345 67 89',
            'Email': 'rzeczy.znalezione@powiat.krakow.pl',
            'Godziny otwarcia': 'Pon-Pt: 8:00-16:00',
            'Link do zdjecia': '',
            'Uwagi': ''
        }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rzeczy Znalezione');

    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // ID
        { wch: 30 }, // Nazwa przedmiotu
        { wch: 12 }, // Kategoria
        { wch: 50 }, // Opis
        { wch: 15 }, // Data znalezienia
        { wch: 40 }, // Miejsce znalezienia
        { wch: 18 }, // Typ miejsca
        { wch: 15 }, // Gmina
        { wch: 15 }, // Powiat
        { wch: 18 }, // Wojewodztwo
        { wch: 20 }, // Szacunkowa wartosc
        { wch: 12 }, // Status
        { wch: 15 }, // Termin odbioru
        { wch: 40 }, // Nazwa biura
        { wch: 40 }, // Adres biura
        { wch: 18 }, // Telefon
        { wch: 30 }, // Email
        { wch: 20 }, // Godziny otwarcia
        { wch: 30 }, // Link do zdjecia
        { wch: 30 }  // Uwagi
    ];

    XLSX.writeFile(wb, 'szablon_rzeczy_znalezione_v2.xlsx');
    showToast('success', 'Pobrano', 'Szablon Excel zostal pobrany');
}

// =====================================================
// FORM HANDLING
// =====================================================
function initializeFormListeners() {
    const form = document.getElementById('itemForm');
    const startFormBtn = document.getElementById('startForm');
    const addAnotherBtn = document.getElementById('addAnother');

    if (!form) return;

    // Start form button
    if (startFormBtn) {
        startFormBtn.addEventListener('click', () => {
            showStep(2);
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            addItemFromForm();
            showStep(3);
        }
    });

    // Add another button
    if (addAnotherBtn) {
        addAnotherBtn.addEventListener('click', () => {
            if (validateForm()) {
                addItemFromForm();
                resetForm();
                showToast('success', 'Dodano', 'Przedmiot zostal dodany. Mozesz wprowadzic kolejny.');
            }
        });
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateForm() {
    const form = document.getElementById('itemForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate email if provided
    const emailField = document.getElementById('officeEmail');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Podaj prawidlowy adres email');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    clearFieldError(field);

    if (field.required && !field.value.trim()) {
        showFieldError(field, 'To pole jest wymagane');
        return false;
    }

    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'Podaj prawidlowy adres email');
        return false;
    }

    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'Podaj prawidlowy numer telefonu');
        return false;
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorSpan = field.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorSpan = field.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\+\-\(\)]{9,}$/.test(phone);
}

function addItemFromForm() {
    const form = document.getElementById('itemForm');
    const formData = new FormData(form);
    const today = new Date().toISOString().split('T')[0];

    const item = {
        id: generateId(items.length),
        item_name: formData.get('item_name'),
        category: formData.get('category'),
        description: formData.get('description'),
        date_found: formData.get('date_found'),
        location_found: formData.get('location_found'),
        location_type: formData.get('location_type'),
        municipality: formData.get('municipality'),
        county: formData.get('county'),
        voivodeship: formData.get('voivodeship'),
        estimated_value: parseFloat(formData.get('estimated_value')) || null,
        status: formData.get('status'),
        collection_deadline: formData.get('collection_deadline'),
        lost_and_found_office: {
            name: formData.get('office_name'),
            address: formData.get('office_address'),
            phone: formData.get('office_phone'),
            email: formData.get('office_email'),
            opening_hours: formData.get('office_hours')
        },
        entry_date: today,
        update_date: today,
        photo_url: formData.get('photo_url'),
        notes: formData.get('notes')
    };

    if (editingIndex >= 0) {
        items[editingIndex] = item;
        editingIndex = -1;
    } else {
        items.push(item);
    }

    updateItemsList();
}

function resetForm() {
    const form = document.getElementById('itemForm');
    form.reset();

    // Reset to defaults
    const today = new Date().toISOString().split('T')[0];
    const dateFoundInput = document.getElementById('dataZnalezienia');
    if (dateFoundInput) {
        dateFoundInput.value = today;
    }

    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
    const deadlineInput = document.getElementById('dataWaznosci');
    if (deadlineInput) {
        deadlineInput.value = twoYearsLater.toISOString().split('T')[0];
    }

    editingIndex = -1;
}

function updateItemsList() {
    const listCard = document.getElementById('itemsListCard');
    const list = document.getElementById('itemsList');
    const count = document.getElementById('itemsCount');

    if (!listCard || !list) return;

    if (items.length > 0) {
        listCard.style.display = 'block';
        count.textContent = items.length;

        list.innerHTML = items.map((item, index) => `
            <div class="item-row">
                <div class="item-info">
                    <div class="item-category">
                        <i class="fas ${CATEGORIES[item.category]?.icon || 'fa-box'}"></i>
                    </div>
                    <div class="item-details">
                        <h4>${item.item_name.substring(0, 50)}${item.item_name.length > 50 ? '...' : ''}</h4>
                        <p>${CATEGORIES[item.category]?.pl || 'Inne'} | ${item.date_found} | ${item.municipality}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn-icon" onclick="editItem(${index})" title="Edytuj">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-icon" onclick="deleteItem(${index})" title="Usun">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        listCard.style.display = 'none';
    }
}

function editItem(index) {
    const item = items[index];
    editingIndex = index;

    // Fill form with item data
    document.getElementById('itemName').value = item.item_name || '';
    document.getElementById('kategoria').value = item.category || '';
    document.getElementById('opis').value = item.description || '';
    document.getElementById('dataZnalezienia').value = item.date_found || '';
    document.getElementById('miejsceZnalezienia').value = item.location_found || '';
    document.getElementById('typMiejsca').value = item.location_type || '';
    document.getElementById('gmina').value = item.municipality || '';
    document.getElementById('powiat').value = item.county || '';
    document.getElementById('wojewodztwo').value = item.voivodeship || '';
    document.getElementById('szacunkowaWartosc').value = item.estimated_value || '';
    document.getElementById('status').value = item.status || 'stored';
    document.getElementById('officeName').value = item.lost_and_found_office?.name || '';
    document.getElementById('officeAddress').value = item.lost_and_found_office?.address || '';
    document.getElementById('officePhone').value = item.lost_and_found_office?.phone || '';
    document.getElementById('officeEmail').value = item.lost_and_found_office?.email || '';
    document.getElementById('officeHours').value = item.lost_and_found_office?.opening_hours || '';
    document.getElementById('zdjecieUrl').value = item.photo_url || '';
    document.getElementById('dataWaznosci').value = item.collection_deadline || '';
    document.getElementById('uwagi').value = item.notes || '';

    // Scroll to form
    document.getElementById('itemForm').scrollIntoView({ behavior: 'smooth' });
    showToast('info', 'Edycja', 'Edytujesz wybrany przedmiot');
}

function deleteItem(index) {
    if (confirm('Czy na pewno chcesz usunac ten przedmiot?')) {
        items.splice(index, 1);
        updateItemsList();
        showToast('success', 'Usunieto', 'Przedmiot zostal usuniety');
    }
}

// =====================================================
// NAVIGATION
// =====================================================
function initializeNavigationListeners() {
    const backToStep1 = document.getElementById('backToStep1');
    const backToStep2 = document.getElementById('backToStep2');
    const backToStep3 = document.getElementById('backToStep3');
    const goToPreview = document.getElementById('goToPreview');
    const goToExport = document.getElementById('goToExport');
    const startOver = document.getElementById('startOver');

    if (backToStep1) backToStep1.addEventListener('click', () => showStep(1));
    if (backToStep2) backToStep2.addEventListener('click', () => showStep(2));
    if (backToStep3) backToStep3.addEventListener('click', () => showStep(3));

    if (goToPreview) {
        goToPreview.addEventListener('click', () => {
            if (items.length > 0) {
                showStep(3);
            } else {
                showToast('warning', 'Uwaga', 'Dodaj przynajmniej jeden przedmiot');
            }
        });
    }

    if (goToExport) goToExport.addEventListener('click', () => showStep(4));

    if (startOver) {
        startOver.addEventListener('click', () => {
            if (confirm('Czy na pewno chcesz rozpoczac od nowa? Wszystkie dane zostana utracone.')) {
                items = [];
                resetForm();
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
                const fileInfo = document.getElementById('fileInfo');
                if (fileInfo) fileInfo.style.display = 'none';
                const dropZone = document.getElementById('dropZone');
                if (dropZone) dropZone.style.display = 'block';
                updateItemsList();
                showStep(1);
                showToast('info', 'Zresetowano', 'Mozesz rozpoczac wprowadzanie danych od nowa');
            }
        });
    }
}

function showStep(step) {
    currentStep = step;

    // Update step indicators
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) {
            el.classList.add('completed');
        } else if (index + 1 === step) {
            el.classList.add('active');
        }
    });

    // Show correct content
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    const stepContent = document.getElementById(`step${step}`);
    if (stepContent) {
        stepContent.classList.add('active');
    }

    // Update preview if showing step 3
    if (step === 3) {
        updatePreview();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePreview() {
    const previewBody = document.getElementById('previewBody');
    const previewCount = document.getElementById('previewCount');
    const previewValid = document.getElementById('previewValid');
    const previewErrors = document.getElementById('previewErrors');

    if (!previewBody) return;

    let validCount = 0;
    let errorCount = 0;

    previewBody.innerHTML = items.map((item, index) => {
        const isValid = item.item_name && item.category && item.description &&
                       item.date_found && item.location_found && item.municipality &&
                       item.county && item.voivodeship && item.lost_and_found_office?.name &&
                       item.lost_and_found_office?.phone;

        if (isValid) {
            validCount++;
        } else {
            errorCount++;
        }

        return `
            <tr class="${isValid ? '' : 'error-row'}">
                <td>${item.id}</td>
                <td><i class="fas ${CATEGORIES[item.category]?.icon || 'fa-box'}"></i> ${CATEGORIES[item.category]?.pl || 'Inne'}</td>
                <td>${item.item_name.substring(0, 30)}${item.item_name.length > 30 ? '...' : ''}</td>
                <td>${item.date_found}</td>
                <td>${item.municipality}, ${item.voivodeship}</td>
                <td>${STATUSES[item.status]?.pl || item.status}</td>
                <td>
                    <button type="button" class="btn-icon" onclick="editItemFromPreview(${index})" title="Edytuj">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-icon" onclick="deleteItemFromPreview(${index})" title="Usun">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    if (previewCount) previewCount.textContent = items.length;
    if (previewValid) previewValid.textContent = validCount;
    if (previewErrors) {
        previewErrors.textContent = errorCount;
        previewErrors.style.color = errorCount > 0 ? 'var(--color-error)' : 'var(--color-success)';
    }
}

function editItemFromPreview(index) {
    editItem(index);
    showStep(2);
}

function deleteItemFromPreview(index) {
    deleteItem(index);
    updatePreview();
}

// =====================================================
// EXPORT FUNCTIONS
// =====================================================
function initializeExportListeners() {
    const exportJSON = document.getElementById('exportJSON');
    const exportCSV = document.getElementById('exportCSV');

    if (exportJSON) exportJSON.addEventListener('click', exportToJSON);
    if (exportCSV) exportCSV.addEventListener('click', exportToCSV);
}

function exportToJSON() {
    if (items.length === 0) {
        showToast('warning', 'Uwaga', 'Brak danych do eksportu');
        return;
    }

    // Create dane.gov.pl compatible JSON structure
    const exportData = {
        metadata: {
            title: "Rzeczy Znalezione",
            description: "Rejestr rzeczy znalezionych zgodny z ustawa z dnia 20 lutego 2015 r. o rzeczach znalezionych",
            category: "government_and_public_sector",
            update_frequency: "weekly",
            created: new Date().toISOString(),
            source: "dane.gov.pl - Mechanizm Rzeczy Znalezionych",
            license: "CC0 1.0",
            language: "pl"
        },
        data: items.map(item => ({
            id: item.id,
            item_name: item.item_name,
            category: item.category,
            category_pl: CATEGORIES[item.category]?.pl || 'Inne',
            description: item.description,
            date_found: item.date_found,
            location_found: item.location_found,
            location_type: item.location_type,
            municipality: item.municipality,
            county: item.county,
            voivodeship: item.voivodeship,
            estimated_value: item.estimated_value,
            status: item.status,
            status_pl: STATUSES[item.status]?.pl || item.status,
            collection_deadline: item.collection_deadline,
            lost_and_found_office: item.lost_and_found_office,
            entry_date: item.entry_date,
            update_date: item.update_date,
            photo_url: item.photo_url,
            notes: item.notes
        }))
    };

    // Download JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'rzeczy_znalezione.json');

    showToast('success', 'Pobrano', 'Plik JSON zostal pobrany');
}

function exportToCSV() {
    if (items.length === 0) {
        showToast('warning', 'Uwaga', 'Brak danych do eksportu');
        return;
    }

    // Prepare CSV data
    const csvData = items.map(item => ({
        'ID': item.id,
        'Nazwa przedmiotu': item.item_name,
        'Kategoria': CATEGORIES[item.category]?.pl || 'Inne',
        'Opis': item.description,
        'Data znalezienia': item.date_found,
        'Miejsce znalezienia': item.location_found,
        'Typ miejsca': item.location_type,
        'Gmina': item.municipality,
        'Powiat': item.county,
        'Wojewodztwo': item.voivodeship,
        'Szacunkowa wartosc (PLN)': item.estimated_value || '',
        'Status': STATUSES[item.status]?.pl || item.status,
        'Termin odbioru': item.collection_deadline,
        'Nazwa biura': item.lost_and_found_office?.name || '',
        'Adres biura': item.lost_and_found_office?.address || '',
        'Telefon': item.lost_and_found_office?.phone || '',
        'Email': item.lost_and_found_office?.email || '',
        'Godziny otwarcia': item.lost_and_found_office?.opening_hours || '',
        'Link do zdjecia': item.photo_url || '',
        'Uwagi': item.notes || ''
    }));

    // Create CSV using SheetJS
    const ws = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Download CSV with BOM for Excel compatibility
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'rzeczy_znalezione.csv');

    showToast('success', 'Pobrano', 'Plik CSV zostal pobrany');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

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

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// =====================================================
// GLOBAL FUNCTIONS
// =====================================================
window.editItem = editItem;
window.deleteItem = deleteItem;
window.editItemFromPreview = editItemFromPreview;
window.deleteItemFromPreview = deleteItemFromPreview;
