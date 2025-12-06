/* =====================================================
   RZECZY ZNALEZIONE - Application Logic
   HackNation 2024
   ===================================================== */

// =====================================================
// DATA STORAGE
// =====================================================
let items = [];
let currentStep = 1;
let editingIndex = -1;

// Category icons mapping
const categoryIcons = {
    'telefon': '📱',
    'portfel': '👛',
    'klucze': '🔑',
    'torba': '👜',
    'odziez': '👕',
    'bizuteria': '💍',
    'elektronika': '💻',
    'dokumenty': '📄',
    'inne': '📦'
};

// Category labels
const categoryLabels = {
    'telefon': 'Telefon',
    'portfel': 'Portfel / Dokumenty',
    'klucze': 'Klucze',
    'torba': 'Torba / Plecak',
    'odziez': 'Odzież',
    'bizuteria': 'Biżuteria / Zegarek',
    'elektronika': 'Elektronika',
    'dokumenty': 'Dokumenty',
    'inne': 'Inne'
};

// Status labels
const statusLabels = {
    'oczekuje_na_wlasciciela': '⏳ Oczekuje na właściciela',
    'odebrane': '✅ Odebrane',
    'przekazane_do_skarbu': '📦 Przekazane do Skarbu Państwa'
};

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataZnalezienia').value = today;
    
    // Set default expiry date (2 years from now)
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
    document.getElementById('dataWaznosci').value = twoYearsLater.toISOString().split('T')[0];
    
    // Initialize event listeners
    initializeDropZone();
    initializeFormListeners();
    initializeNavigationListeners();
    initializeExportListeners();
    
    // Show first step
    showStep(1);
}

// =====================================================
// DRAG & DROP FILE UPLOAD
// =====================================================
function initializeDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    
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
    removeFile.addEventListener('click', () => {
        fileInput.value = '';
        fileInfo.style.display = 'none';
        dropZone.style.display = 'block';
        items = [];
    });
    
    // Download template
    document.getElementById('downloadTemplate').addEventListener('click', (e) => {
        e.preventDefault();
        downloadExcelTemplate();
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleFile(file) {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/csv'
    ];
    
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showToast('error', 'Błąd', 'Nieobsługiwany format pliku. Użyj .xlsx, .xls lub .csv');
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
                showToast('warning', 'Uwaga', 'Plik jest pusty lub ma nieprawidłowy format');
                return;
            }
            
            // Map data to our format
            items = jsonData.map((row, index) => mapRowToItem(row, index));
            
            showToast('success', 'Sukces', `Wczytano ${items.length} przedmiotów z pliku`);
            
            // Go to preview
            setTimeout(() => {
                showStep(3);
            }, 500);
            
        } catch (error) {
            console.error('Error parsing file:', error);
            showToast('error', 'Błąd', 'Nie udało się wczytać pliku. Sprawdź format danych.');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function mapRowToItem(row, index) {
    // Try to map various column names to our format
    return {
        id: row.id || row.ID || row.Id || generateId(index),
        kategoria: mapCategory(row.kategoria || row.Kategoria || row.category || row.Category || 'inne'),
        opis: row.opis || row.Opis || row.description || row.Description || '',
        kolor: row.kolor || row.Kolor || row.color || row.Color || '',
        marka: row.marka || row.Marka || row.brand || row.Brand || '',
        data_znalezienia: formatDate(row.data_znalezienia || row['Data znalezienia'] || row.date || row.Date || new Date()),
        miejsce_znalezienia: row.miejsce_znalezienia || row['Miejsce znalezienia'] || row.location || row.Location || '',
        typ_miejsca: row.typ_miejsca || row['Typ miejsca'] || row.place_type || '',
        miejsce_przechowywania: row.miejsce_przechowywania || row['Miejsce przechowywania'] || row.storage || '',
        kontakt_telefon: row.kontakt_telefon || row['Telefon'] || row.phone || row.Phone || '',
        kontakt_email: row.kontakt_email || row['Email'] || row.email || row.Email || '',
        status: row.status || row.Status || 'oczekuje_na_wlasciciela',
        zdjecie_url: row.zdjecie_url || row['Zdjęcie'] || row.photo || row.Photo || '',
        data_waznosci: formatDate(row.data_waznosci || row['Data ważności'] || row.expiry || '')
    };
}

function mapCategory(value) {
    const lowerValue = value.toLowerCase();
    const categoryMap = {
        'telefon': 'telefon',
        'phone': 'telefon',
        'portfel': 'portfel',
        'wallet': 'portfel',
        'dokumenty': 'dokumenty',
        'documents': 'dokumenty',
        'klucze': 'klucze',
        'keys': 'klucze',
        'torba': 'torba',
        'bag': 'torba',
        'plecak': 'torba',
        'backpack': 'torba',
        'odzież': 'odziez',
        'odziez': 'odziez',
        'clothing': 'odziez',
        'biżuteria': 'bizuteria',
        'bizuteria': 'bizuteria',
        'jewelry': 'bizuteria',
        'zegarek': 'bizuteria',
        'watch': 'bizuteria',
        'elektronika': 'elektronika',
        'electronics': 'elektronika',
        'inne': 'inne',
        'other': 'inne'
    };
    
    return categoryMap[lowerValue] || 'inne';
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
    // Create template data
    const templateData = [
        {
            'ID': 'RZ/2024/0001',
            'Kategoria': 'telefon',
            'Opis': 'iPhone 14 Pro, kolor czarny, bez etui',
            'Kolor': 'czarny',
            'Marka': 'Apple',
            'Data znalezienia': '2024-01-15',
            'Miejsce znalezienia': 'Autobus linii 144, przystanek Rynek',
            'Typ miejsca': 'transport_publiczny',
            'Miejsce przechowywania': 'Biuro Rzeczy Znalezionych, ul. Główna 1',
            'Telefon': '+48 12 345 67 89',
            'Email': 'biuro@urzad.gov.pl',
            'Status': 'oczekuje_na_wlasciciela',
            'Zdjęcie URL': '',
            'Data ważności': '2026-01-15'
        },
        {
            'ID': 'RZ/2024/0002',
            'Kategoria': 'portfel',
            'Opis': 'Portfel skórzany brązowy, zawiera dokumenty',
            'Kolor': 'brązowy',
            'Marka': '',
            'Data znalezienia': '2024-01-16',
            'Miejsce znalezienia': 'Park Miejski, przy fontannie',
            'Typ miejsca': 'park',
            'Miejsce przechowywania': 'Biuro Rzeczy Znalezionych, ul. Główna 1',
            'Telefon': '+48 12 345 67 89',
            'Email': 'biuro@urzad.gov.pl',
            'Status': 'oczekuje_na_wlasciciela',
            'Zdjęcie URL': '',
            'Data ważności': '2026-01-16'
        }
    ];
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rzeczy Znalezione');
    
    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, // ID
        { wch: 12 }, // Kategoria
        { wch: 40 }, // Opis
        { wch: 12 }, // Kolor
        { wch: 12 }, // Marka
        { wch: 15 }, // Data znalezienia
        { wch: 40 }, // Miejsce znalezienia
        { wch: 20 }, // Typ miejsca
        { wch: 40 }, // Miejsce przechowywania
        { wch: 18 }, // Telefon
        { wch: 25 }, // Email
        { wch: 25 }, // Status
        { wch: 30 }, // Zdjęcie URL
        { wch: 15 }  // Data ważności
    ];
    
    // Download
    XLSX.writeFile(wb, 'szablon_rzeczy_znalezione.xlsx');
    
    showToast('success', 'Pobrano', 'Szablon Excel został pobrany');
}

// =====================================================
// FORM HANDLING
// =====================================================
function initializeFormListeners() {
    const form = document.getElementById('itemForm');
    const startFormBtn = document.getElementById('startForm');
    const addAnotherBtn = document.getElementById('addAnother');
    
    // Start form button
    startFormBtn.addEventListener('click', () => {
        showStep(2);
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            addItemFromForm();
            showStep(3);
        }
    });
    
    // Add another button
    addAnotherBtn.addEventListener('click', () => {
        if (validateForm()) {
            addItemFromForm();
            resetForm();
            showToast('success', 'Dodano', 'Przedmiot został dodany. Możesz wprowadzić kolejny.');
        }
    });
    
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
    const emailField = document.getElementById('kontaktEmail');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Podaj prawidłowy adres email');
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
        showFieldError(field, 'Podaj prawidłowy adres email');
        return false;
    }
    
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'Podaj prawidłowy numer telefonu');
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
    // Allow various phone formats
    return /^[\d\s\+\-\(\)]{9,}$/.test(phone);
}

function addItemFromForm() {
    const form = document.getElementById('itemForm');
    const formData = new FormData(form);
    
    const item = {
        id: generateId(items.length),
        kategoria: formData.get('kategoria'),
        opis: formData.get('opis'),
        kolor: formData.get('kolor'),
        marka: formData.get('marka'),
        data_znalezienia: formData.get('data_znalezienia'),
        miejsce_znalezienia: formData.get('miejsce_znalezienia'),
        typ_miejsca: formData.get('typ_miejsca'),
        miejsce_przechowywania: formData.get('miejsce_przechowywania'),
        kontakt_telefon: formData.get('kontakt_telefon'),
        kontakt_email: formData.get('kontakt_email'),
        status: formData.get('status'),
        zdjecie_url: formData.get('zdjecie_url'),
        data_waznosci: formData.get('data_waznosci')
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
    document.getElementById('dataZnalezienia').value = today;
    
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
    document.getElementById('dataWaznosci').value = twoYearsLater.toISOString().split('T')[0];
    
    editingIndex = -1;
}

function updateItemsList() {
    const listCard = document.getElementById('itemsListCard');
    const list = document.getElementById('itemsList');
    const count = document.getElementById('itemsCount');
    
    if (items.length > 0) {
        listCard.style.display = 'block';
        count.textContent = items.length;
        
        list.innerHTML = items.map((item, index) => `
            <div class="item-row">
                <div class="item-info">
                    <div class="item-category">${categoryIcons[item.kategoria] || '📦'}</div>
                    <div class="item-details">
                        <h4>${item.opis.substring(0, 50)}${item.opis.length > 50 ? '...' : ''}</h4>
                        <p>${categoryLabels[item.kategoria] || 'Inne'} • ${item.data_znalezienia}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn-icon" onclick="editItem(${index})" title="Edytuj">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-icon" onclick="deleteItem(${index})" title="Usuń">
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
    document.getElementById('kategoria').value = item.kategoria;
    document.getElementById('opis').value = item.opis;
    document.getElementById('kolor').value = item.kolor;
    document.getElementById('marka').value = item.marka;
    document.getElementById('dataZnalezienia').value = item.data_znalezienia;
    document.getElementById('miejsceZnalezienia').value = item.miejsce_znalezienia;
    document.getElementById('typMiejsca').value = item.typ_miejsca;
    document.getElementById('miejscePrzechowywania').value = item.miejsce_przechowywania;
    document.getElementById('kontaktTelefon').value = item.kontakt_telefon;
    document.getElementById('kontaktEmail').value = item.kontakt_email;
    document.getElementById('status').value = item.status;
    document.getElementById('zdjecieUrl').value = item.zdjecie_url;
    document.getElementById('dataWaznosci').value = item.data_waznosci;
    
    // Scroll to form
    document.getElementById('itemForm').scrollIntoView({ behavior: 'smooth' });
    
    showToast('info', 'Edycja', 'Edytujesz wybrany przedmiot');
}

function deleteItem(index) {
    if (confirm('Czy na pewno chcesz usunąć ten przedmiot?')) {
        items.splice(index, 1);
        updateItemsList();
        showToast('success', 'Usunięto', 'Przedmiot został usunięty');
    }
}

// =====================================================
// NAVIGATION
// =====================================================
function initializeNavigationListeners() {
    // Back buttons
    document.getElementById('backToStep1').addEventListener('click', () => showStep(1));
    document.getElementById('backToStep2').addEventListener('click', () => showStep(2));
    document.getElementById('backToStep3').addEventListener('click', () => showStep(3));
    
    // Forward buttons
    document.getElementById('goToPreview').addEventListener('click', () => {
        if (items.length > 0) {
            showStep(3);
        } else {
            showToast('warning', 'Uwaga', 'Dodaj przynajmniej jeden przedmiot');
        }
    });
    
    document.getElementById('goToExport').addEventListener('click', () => showStep(4));
    
    // Start over
    document.getElementById('startOver').addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz rozpocząć od nowa? Wszystkie dane zostaną utracone.')) {
            items = [];
            resetForm();
            document.getElementById('fileInput').value = '';
            document.getElementById('fileInfo').style.display = 'none';
            document.getElementById('dropZone').style.display = 'block';
            updateItemsList();
            showStep(1);
            showToast('info', 'Zresetowano', 'Możesz rozpocząć wprowadzanie danych od nowa');
        }
    });
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
    document.getElementById(`step${step}`).classList.add('active');
    
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
    
    let validCount = 0;
    let errorCount = 0;
    
    previewBody.innerHTML = items.map((item, index) => {
        const isValid = item.kategoria && item.opis && item.data_znalezienia && 
                       item.miejsce_znalezienia && item.miejsce_przechowywania && item.kontakt_telefon;
        
        if (isValid) {
            validCount++;
        } else {
            errorCount++;
        }
        
        return `
            <tr class="${isValid ? '' : 'error-row'}">
                <td>${item.id}</td>
                <td>${categoryIcons[item.kategoria] || '📦'} ${categoryLabels[item.kategoria] || 'Inne'}</td>
                <td>${item.opis.substring(0, 40)}${item.opis.length > 40 ? '...' : ''}</td>
                <td>${item.data_znalezienia}</td>
                <td>${item.miejsce_znalezienia.substring(0, 30)}${item.miejsce_znalezienia.length > 30 ? '...' : ''}</td>
                <td>${statusLabels[item.status] || item.status}</td>
                <td>
                    <button type="button" class="btn-icon" onclick="editItemFromPreview(${index})" title="Edytuj">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-icon" onclick="deleteItemFromPreview(${index})" title="Usuń">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    previewCount.textContent = items.length;
    previewValid.textContent = validCount;
    previewErrors.textContent = errorCount;
    
    // Update error count color
    previewErrors.style.color = errorCount > 0 ? 'var(--color-error)' : 'var(--color-success)';
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
    document.getElementById('exportJSON').addEventListener('click', exportToJSON);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
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
            description: "Rejestr rzeczy znalezionych",
            category: "government_and_public_sector",
            update_frequency: "weekly",
            created: new Date().toISOString(),
            source: "dane.gov.pl - Mechanizm Rzeczy Znalezionych",
            license: "CC0 1.0"
        },
        data: items.map(item => ({
            id: item.id,
            kategoria: item.kategoria,
            kategoria_nazwa: categoryLabels[item.kategoria] || 'Inne',
            opis: item.opis,
            kolor: item.kolor,
            marka: item.marka,
            data_znalezienia: item.data_znalezienia,
            miejsce_znalezienia: item.miejsce_znalezienia,
            typ_miejsca: item.typ_miejsca,
            miejsce_przechowywania: item.miejsce_przechowywania,
            kontakt: {
                telefon: item.kontakt_telefon,
                email: item.kontakt_email
            },
            status: item.status,
            status_nazwa: statusLabels[item.status] || item.status,
            zdjecie_url: item.zdjecie_url,
            data_waznosci: item.data_waznosci,
            ostatnia_aktualizacja: new Date().toISOString()
        }))
    };
    
    // Download JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'rzeczy_znalezione.json');
    
    showToast('success', 'Pobrano', 'Plik JSON został pobrany');
}

function exportToCSV() {
    if (items.length === 0) {
        showToast('warning', 'Uwaga', 'Brak danych do eksportu');
        return;
    }
    
    // Prepare CSV data
    const csvData = items.map(item => ({
        'ID': item.id,
        'Kategoria': categoryLabels[item.kategoria] || 'Inne',
        'Opis': item.opis,
        'Kolor': item.kolor,
        'Marka': item.marka,
        'Data znalezienia': item.data_znalezienia,
        'Miejsce znalezienia': item.miejsce_znalezienia,
        'Typ miejsca': item.typ_miejsca,
        'Miejsce przechowywania': item.miejsce_przechowywania,
        'Telefon kontaktowy': item.kontakt_telefon,
        'Email kontaktowy': item.kontakt_email,
        'Status': statusLabels[item.status] || item.status,
        'URL zdjęcia': item.zdjecie_url,
        'Data ważności': item.data_waznosci
    }));
    
    // Create CSV using SheetJS
    const ws = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    // Download CSV
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }); // BOM for Excel
    downloadBlob(blob, 'rzeczy_znalezione.csv');
    
    showToast('success', 'Pobrano', 'Plik CSV został pobrany');
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
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Make functions available globally for onclick handlers
window.editItem = editItem;
window.deleteItem = deleteItem;
window.editItemFromPreview = editItemFromPreview;
window.deleteItemFromPreview = deleteItemFromPreview;
