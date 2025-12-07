/**
 * Internationalization (i18n) - Multi-language Support
 * Supports: Polish (pl), English (en)
 */

const translations = {
    pl: {
        // General
        app_name: 'Rzeczy Znalezione',
        app_subtitle: 'Portal danych o rzeczach znalezionych',
        search: 'Szukaj',
        loading: 'Ladowanie...',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usun',
        edit: 'Edytuj',
        back: 'Wstecz',
        next: 'Dalej',
        close: 'Zamknij',
        yes: 'Tak',
        no: 'Nie',
        all: 'Wszystkie',
        none: 'Brak',
        required: 'Wymagane',
        optional: 'Opcjonalne',

        // Navigation
        nav_admin: 'Panel urzednika',
        nav_search: 'Szukaj rzeczy',
        nav_portal: 'Portal dane.gov.pl',
        nav_login: 'Zaloguj',
        nav_logout: 'Wyloguj',
        nav_profile: 'Profil',

        // Auth
        login: 'Logowanie',
        register: 'Rejestracja',
        email: 'Email',
        password: 'Haslo',
        password_confirm: 'Potwierdz haslo',
        name: 'Imie i nazwisko',
        organization: 'Organizacja',
        phone: 'Telefon',
        login_button: 'Zaloguj sie',
        register_button: 'Zarejestruj sie',
        forgot_password: 'Nie pamietasz hasla?',
        login_success: 'Zalogowano pomyslnie',
        logout_success: 'Wylogowano pomyslnie',
        auth_required: 'Wymagane logowanie',
        invalid_credentials: 'Nieprawidlowy email lub haslo',

        // Categories
        category: 'Kategoria',
        categories: {
            phone: 'Telefon',
            documents: 'Dokumenty',
            jewelry: 'Bizuteria',
            keys: 'Klucze',
            wallet: 'Portfel',
            clothing: 'Odziez',
            electronics: 'Elektronika',
            bicycle: 'Rower',
            other: 'Inne'
        },

        // Statuses
        status: 'Status',
        statuses: {
            stored: 'Przechowywany',
            returned: 'Zwrocony wlascicielowi',
            liquidated: 'Zlikwidowany'
        },

        // Item fields
        item_name: 'Nazwa przedmiotu',
        description: 'Opis',
        date_found: 'Data znalezienia',
        location_found: 'Miejsce znalezienia',
        location_type: 'Typ miejsca',
        municipality: 'Gmina',
        county: 'Powiat',
        voivodeship: 'Wojewodztwo',
        estimated_value: 'Szacunkowa wartosc',
        collection_deadline: 'Termin odbioru',
        photo: 'Zdjecie',
        notes: 'Uwagi',

        // Location types
        location_types: {
            public_transport: 'Transport publiczny',
            office: 'Urzad / Instytucja',
            shop: 'Sklep / Centrum handlowe',
            park: 'Park / Teren zielony',
            street: 'Ulica / Chodnik',
            parking: 'Parking',
            school: 'Szkola / Uczelnia',
            hospital: 'Szpital / Przychodnia',
            other: 'Inne'
        },

        // Office
        office: 'Biuro Rzeczy Znalezionych',
        office_name: 'Nazwa biura',
        office_address: 'Adres',
        office_phone: 'Telefon',
        office_email: 'Email',
        office_hours: 'Godziny otwarcia',

        // Voivodeships
        voivodeships: {
            dolnoslaskie: 'Dolnoslaskie',
            'kujawsko-pomorskie': 'Kujawsko-pomorskie',
            lubelskie: 'Lubelskie',
            lubuskie: 'Lubuskie',
            lodzkie: 'Lodzkie',
            malopolskie: 'Malopolskie',
            mazowieckie: 'Mazowieckie',
            opolskie: 'Opolskie',
            podkarpackie: 'Podkarpackie',
            podlaskie: 'Podlaskie',
            pomorskie: 'Pomorskie',
            slaskie: 'Slaskie',
            swietokrzyskie: 'Swietokrzyskie',
            'warminsko-mazurskie': 'Warminsko-mazurskie',
            wielkopolskie: 'Wielkopolskie',
            zachodniopomorskie: 'Zachodniopomorskie'
        },

        // Search
        search_placeholder: 'Wpisz czego szukasz...',
        search_results: 'Wyniki wyszukiwania',
        no_results: 'Brak wynikow',
        results_count: '{count} wynikow',
        filters: 'Filtry',
        clear_filters: 'Wyczysc filtry',
        date_from: 'Data od',
        date_to: 'Data do',

        // Views
        view_grid: 'Widok siatki',
        view_list: 'Widok listy',
        view_map: 'Widok mapy',

        // Steps
        step: 'Krok',
        step_1: 'Wybierz zrodlo',
        step_2: 'Wprowadz dane',
        step_3: 'Sprawdz podglad',
        step_4: 'Pobierz plik',

        // Upload
        upload_file: 'Wgraj plik',
        drag_drop: 'Przeciagnij plik tutaj',
        or: 'lub',
        select_file: 'Wybierz plik',
        supported_formats: 'Obslugiwane formaty: .xlsx, .xls, .csv',
        download_template: 'Pobierz szablon',
        fill_form: 'Wypelnij formularz',

        // Export
        export: 'Eksport',
        export_json: 'Pobierz JSON',
        export_csv: 'Pobierz CSV',
        export_success: 'Plik zostal pobrany',

        // Messages
        success: 'Sukces',
        error: 'Blad',
        warning: 'Uwaga',
        info: 'Informacja',
        item_created: 'Przedmiot zostal dodany',
        item_updated: 'Przedmiot zostal zaktualizowany',
        item_deleted: 'Przedmiot zostal usuniety',
        confirm_delete: 'Czy na pewno chcesz usunac?',

        // Stats
        statistics: 'Statystyki',
        total_items: 'Wszystkich przedmiotow',
        awaiting_collection: 'Oczekujacych na odbior',
        returned_to_owner: 'Zwroconych wlascicielom',
        data_sources: 'Zrodel danych',

        // Footer
        footer_about: 'Mechanizm do udostepniania danych o rzeczach znalezionych',
        footer_project: 'Projekt stworzony na HackNation 2025',
        footer_links: 'Linki',
        footer_contact: 'Kontakt',
        footer_copyright: '© 2025 Otwarte Dane - Kancelaria Prezesa Rady Ministrow'
    },

    en: {
        // General
        app_name: 'Lost and Found',
        app_subtitle: 'Lost items data portal',
        search: 'Search',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        close: 'Close',
        yes: 'Yes',
        no: 'No',
        all: 'All',
        none: 'None',
        required: 'Required',
        optional: 'Optional',

        // Navigation
        nav_admin: 'Admin Panel',
        nav_search: 'Search Items',
        nav_portal: 'dane.gov.pl Portal',
        nav_login: 'Login',
        nav_logout: 'Logout',
        nav_profile: 'Profile',

        // Auth
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        password_confirm: 'Confirm password',
        name: 'Full name',
        organization: 'Organization',
        phone: 'Phone',
        login_button: 'Sign in',
        register_button: 'Sign up',
        forgot_password: 'Forgot password?',
        login_success: 'Logged in successfully',
        logout_success: 'Logged out successfully',
        auth_required: 'Authentication required',
        invalid_credentials: 'Invalid email or password',

        // Categories
        category: 'Category',
        categories: {
            phone: 'Phone',
            documents: 'Documents',
            jewelry: 'Jewelry',
            keys: 'Keys',
            wallet: 'Wallet',
            clothing: 'Clothing',
            electronics: 'Electronics',
            bicycle: 'Bicycle',
            other: 'Other'
        },

        // Statuses
        status: 'Status',
        statuses: {
            stored: 'Stored',
            returned: 'Returned to owner',
            liquidated: 'Liquidated'
        },

        // Item fields
        item_name: 'Item name',
        description: 'Description',
        date_found: 'Date found',
        location_found: 'Location found',
        location_type: 'Location type',
        municipality: 'Municipality',
        county: 'County',
        voivodeship: 'Voivodeship',
        estimated_value: 'Estimated value',
        collection_deadline: 'Collection deadline',
        photo: 'Photo',
        notes: 'Notes',

        // Location types
        location_types: {
            public_transport: 'Public transport',
            office: 'Office / Institution',
            shop: 'Shop / Mall',
            park: 'Park / Green area',
            street: 'Street / Sidewalk',
            parking: 'Parking',
            school: 'School / University',
            hospital: 'Hospital / Clinic',
            other: 'Other'
        },

        // Office
        office: 'Lost and Found Office',
        office_name: 'Office name',
        office_address: 'Address',
        office_phone: 'Phone',
        office_email: 'Email',
        office_hours: 'Opening hours',

        // Voivodeships
        voivodeships: {
            dolnoslaskie: 'Lower Silesian',
            'kujawsko-pomorskie': 'Kuyavian-Pomeranian',
            lubelskie: 'Lublin',
            lubuskie: 'Lubusz',
            lodzkie: 'Lodz',
            malopolskie: 'Lesser Poland',
            mazowieckie: 'Masovian',
            opolskie: 'Opole',
            podkarpackie: 'Subcarpathian',
            podlaskie: 'Podlaskie',
            pomorskie: 'Pomeranian',
            slaskie: 'Silesian',
            swietokrzyskie: 'Holy Cross',
            'warminsko-mazurskie': 'Warmian-Masurian',
            wielkopolskie: 'Greater Poland',
            zachodniopomorskie: 'West Pomeranian'
        },

        // Search
        search_placeholder: 'What are you looking for...',
        search_results: 'Search results',
        no_results: 'No results',
        results_count: '{count} results',
        filters: 'Filters',
        clear_filters: 'Clear filters',
        date_from: 'Date from',
        date_to: 'Date to',

        // Views
        view_grid: 'Grid view',
        view_list: 'List view',
        view_map: 'Map view',

        // Steps
        step: 'Step',
        step_1: 'Choose source',
        step_2: 'Enter data',
        step_3: 'Preview',
        step_4: 'Download file',

        // Upload
        upload_file: 'Upload file',
        drag_drop: 'Drag file here',
        or: 'or',
        select_file: 'Select file',
        supported_formats: 'Supported formats: .xlsx, .xls, .csv',
        download_template: 'Download template',
        fill_form: 'Fill form',

        // Export
        export: 'Export',
        export_json: 'Download JSON',
        export_csv: 'Download CSV',
        export_success: 'File downloaded',

        // Messages
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        item_created: 'Item created',
        item_updated: 'Item updated',
        item_deleted: 'Item deleted',
        confirm_delete: 'Are you sure you want to delete?',

        // Stats
        statistics: 'Statistics',
        total_items: 'Total items',
        awaiting_collection: 'Awaiting collection',
        returned_to_owner: 'Returned to owners',
        data_sources: 'Data sources',

        // Footer
        footer_about: 'Mechanism for sharing lost and found data',
        footer_project: 'Project created for HackNation 2025',
        footer_links: 'Links',
        footer_contact: 'Contact',
        footer_copyright: '© 2025 Open Data - Chancellery of the Prime Minister'
    }
};

/**
 * i18n Class
 */
class I18n {
    constructor() {
        this.translations = translations;
        this.currentLanguage = this.detectLanguage();
    }

    /**
     * Detect browser language or use stored preference
     */
    detectLanguage() {
        // Check localStorage
        const stored = localStorage.getItem('language');
        if (stored && this.translations && this.translations[stored]) {
            return stored;
        }

        // Check browser language - fallback to 'pl' if language not supported
        const browserLang = navigator.language?.split('-')[0] || 'pl';
        return (this.translations && this.translations[browserLang]) ? browserLang : 'pl';
    }

    /**
     * Set current language
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            this.updateUI();
            return true;
        }
        return false;
    }

    /**
     * Get translation
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                // Fallback to Polish
                value = this.translations.pl;
                for (const k2 of keys) {
                    if (value && value[k2] !== undefined) {
                        value = value[k2];
                    } else {
                        return key;
                    }
                }
                break;
            }
        }

        // Replace parameters
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            for (const [param, val] of Object.entries(params)) {
                value = value.replace(`{${param}}`, val);
            }
        }

        return value;
    }

    /**
     * Get all translations for a nested key
     */
    getAll(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return {};
            }
        }

        return typeof value === 'object' ? value : {};
    }

    /**
     * Update all elements with data-i18n attribute
     */
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder) {
                    el.placeholder = translation;
                }
            } else {
                el.textContent = translation;
            }
        });

        // Update elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.dataset.i18nTitle);
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Create global instance
const i18n = new I18n();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    i18n.updateUI();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, i18n, translations };
}
