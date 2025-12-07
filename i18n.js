/**
 * Internationalization (i18n) - Multi-language Support
 * Supports: Polish (pl), English (en)
 */

const translations = {
    pl: {
        // General
        app_name: 'Rzeczy Znalezione',
        app_subtitle: 'Mechanizm do szybkiego udostępniania danych o rzeczach znalezionych w portalu dane.gov.pl',
        skip_to_content: 'Przejdź do treści głównej',
        govpl_text: 'Serwis Rzeczypospolitej Polskiej',
        open_data: 'Otwarte Dane',
        search: 'Szukaj',
        loading: 'Ładowanie...',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
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
        nav_admin: 'Panel urzędnika',
        nav_search: 'Szukaj rzeczy',
        nav_portal: 'Portal dane.gov.pl',
        nav_login: 'Zaloguj',
        nav_logout: 'Wyloguj',
        nav_profile: 'Profil',

        // Auth
        login: 'Logowanie',
        register: 'Rejestracja',
        email: 'Email',
        password: 'Hasło',
        password_confirm: 'Potwierdź hasło',
        name: 'Imię i nazwisko',
        organization: 'Organizacja',
        phone: 'Telefon',
        login_button: 'Zaloguj się',
        register_button: 'Zarejestruj się',
        forgot_password: 'Nie pamiętasz hasła?',
        login_success: 'Zalogowano pomyślnie',
        logout_success: 'Wylogowano pomyślnie',
        auth_required: 'Wymagane logowanie',
        invalid_credentials: 'Nieprawidłowy email lub hasło',

        // Categories
        category: 'Kategoria',
        categories: {
            phone: 'Telefon',
            documents: 'Dokumenty',
            jewelry: 'Biżuteria',
            keys: 'Klucze',
            wallet: 'Portfel',
            clothing: 'Odzież',
            electronics: 'Elektronika',
            bicycle: 'Rower',
            other: 'Inne'
        },

        // Statuses
        status: 'Status',
        statuses: {
            stored: 'Przechowywany',
            returned: 'Zwrócony właścicielowi',
            liquidated: 'Zlikwidowany'
        },

        // Item fields
        item_name: 'Nazwa przedmiotu',
        description: 'Opis przedmiotu',
        date_found: 'Data znalezienia',
        location_found: 'Miejsce znalezienia',
        location_type: 'Typ miejsca',
        municipality: 'Gmina',
        county: 'Powiat',
        voivodeship: 'Województwo',
        estimated_value: 'Szacunkowa wartość (PLN)',
        collection_deadline: 'Termin odbioru',
        photo: 'Zdjęcie',
        photo_url: 'Link do zdjęcia (opcjonalne)',
        notes: 'Dodatkowe uwagi',
        basic_info: 'Podstawowe informacje',
        location_section: 'Lokalizacja znalezienia',
        office_section: 'Biuro Rzeczy Znalezionych',
        additional_info: 'Dodatkowe informacje',
        select_category: '-- Wybierz kategorię --',
        select: '-- Wybierz --',
        select_voivodeship: '-- Wybierz województwo --',
        // Placeholders
        item_name_placeholder: 'Np. Telefon Samsung Galaxy S23, Portfel skorzany',
        description_placeholder: 'Np. Telefon Samsung Galaxy S23, kolor czarny, pęknięty ekran w lewym górnym rogu, etui silikonowe niebieskie',
        description_hint: 'Podaj szczegółowy opis z kolorem, marką, cechami szczególnymi',
        estimated_value_placeholder: 'Np. 2500',
        value_hint: 'Wymagane dla przedmiotów o wartości powyżej 100 PLN',
        location_placeholder: 'Np. Autobus linii 144, przystanek Rynek Glowny',
        municipality_placeholder: 'Np. Kraków',
        county_placeholder: 'Np. Kraków',
        office_name_placeholder: 'Np. Biuro Rzeczy Znalezionych Starostwa Powiatowego',
        office_address_placeholder: 'Np. ul. Glowna 1, pok. 101, 31-000 Krakow',
        office_hours_placeholder: 'Np. Pon-Pt: 8:00-16:00',
        photo_hint: 'Podaj link do zdjęcia przedmiotu (jeśli dostępne)',
        deadline_hint: 'Zgodnie z ustawą, rzeczy znalezione przechowywane są przez 2 lata',
        notes_placeholder: 'Dodatkowe informacje o przedmiocie...',

        // Location types
        location_types: {
            public_transport: 'Transport publiczny',
            office: 'Urząd / Instytucja',
            shop: 'Sklep / Centrum handlowe',
            park: 'Park / Teren zielony',
            street: 'Ulica / Chodnik',
            parking: 'Parking',
            school: 'Szkoła / Uczelnia',
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
            dolnoslaskie: 'Dolnośląskie',
            'kujawsko-pomorskie': 'Kujawsko-pomorskie',
            lubelskie: 'Lubelskie',
            lubuskie: 'Lubuskie',
            lodzkie: 'Łódzkie',
            malopolskie: 'Małopolskie',
            mazowieckie: 'Mazowieckie',
            opolskie: 'Opolskie',
            podkarpackie: 'Podkarpackie',
            podlaskie: 'Podlaskie',
            pomorskie: 'Pomorskie',
            slaskie: 'Śląskie',
            swietokrzyskie: 'Świętokrzyskie',
            'warminsko-mazurskie': 'Warmińsko-mazurskie',
            wielkopolskie: 'Wielkopolskie',
            zachodniopomorskie: 'Zachodniopomorskie'
        },

        // Search
        search_title: 'Szukaj Rzeczy Znalezionych',
        search_subtitle: 'Centralna wyszukiwarka rzeczy znalezionych z całej Polski',
        search_placeholder: 'Wpisz czego szukasz...',
        search_results: 'Wyniki wyszukiwania',
        no_results: 'Brak wyników',
        results_count: '{count} wyników',
        results_text: 'wyników',
        searching: 'Wyszukiwanie...',
        start_searching: 'Rozpocznij wyszukiwanie',
        start_searching_desc: 'Wpisz czego szukasz lub skorzystaj z filtrów, aby znaleźć zgubiony przedmiot.',
        no_results_desc: 'Nie znaleziono przedmiotów pasujących do Twojego wyszukiwania.',
        no_results_suggestion: 'Spróbuj zmniejszyć liczbę filtrów lub użyć innych słów kluczowych.',
        filters: 'Filtry',
        advanced_filters: 'Filtry zaawansowane',
        clear_filters: 'Wyczyść filtry',
        date_from: 'Data od',
        date_to: 'Data do',

        // Views
        view_grid: 'Widok siatki',
        view_list: 'Widok listy',
        view_map: 'Widok mapy',
        view_details: 'Zobacz szczegóły',

        // Steps
        step: 'Krok',
        step_1: 'Wybierz źródło',
        step_2: 'Wprowadź dane',
        step_3: 'Sprawdź podgląd',
        step_4: 'Pobierz plik',
        step1_label: 'Wybierz źródło',
        step2_label: 'Wprowadź dane',
        step3_label: 'Sprawdź podgląd',
        step4_label: 'Pobierz plik',
        step1_title: 'Krok 1: Wybierz sposób wprowadzania danych',
        step1_desc: 'Wybierz, w jaki sposób chcesz dodać dane o rzeczach znalezionych:',
        step2_title: 'Krok 2: Wprowadź dane o rzeczy znalezionej',
        step3_title: 'Krok 3: Sprawdź podgląd danych',
        step3_desc: 'Sprawdź poprawność danych przed wygenerowaniem pliku do portalu dane.gov.pl',
        step4_title: 'Krok 4: Pobierz plik do portalu dane.gov.pl',
        step4_desc: 'Wybierz format pliku i pobierz dane gotowe do publikacji w portalu dane.gov.pl',

        // Upload
        upload_file: 'Wgraj plik Excel/CSV',
        upload_desc: 'Przeciągnij i upuść plik lub kliknij, aby wybrać. Obsługiwane formaty: .xlsx, .xls, .csv',
        drag_file: 'Przeciągnij plik tutaj',
        or: 'lub',
        choose_file: 'Wybierz plik',
        drag_drop: 'Przeciagnij plik tutaj',
        select_file: 'Wybierz plik',
        supported_formats: 'Obslugiwane formaty: .xlsx, .xls, .csv',
        download_template: 'Pobierz szablon Excel',
        fill_form: 'Wypełnij formularz',
        form_desc: 'Wprowadź dane ręcznie. Idealne dla pojedynczych przedmiotów lub małej liczby wpisów.',
        start_entry: 'Rozpocznij wprowadzanie',

        // Export
        export: 'Eksport',
        export_json: 'Pobierz JSON',
        export_csv: 'Pobierz CSV',
        export_success: 'Plik został pobrany',
        format_json: 'Format JSON',
        format_csv: 'Format CSV',
        json_desc: 'Zalecany format dla dane.gov.pl. Maszynowo czytelny, gotowy do API.',
        csv_desc: 'Uniwersalny format tabelaryczny. Można otworzyć w Excel.',
        download_json: 'Pobierz JSON',
        download_csv: 'Pobierz CSV',
        what_next: 'Co dalej?',
        next_step1: 'Pobierz plik w wybranym formacie',
        next_step2: 'Zaloguj się do dane.gov.pl',
        next_step3: 'Przejdź do Panel Administratora → Dane → Dodaj zbiór danych',
        next_step4: 'Wgraj pobrany plik jako zasób',
        next_step5: 'Opublikuj zbiór danych',

        // Messages
        success: 'Sukces',
        error: 'Błąd',
        warning: 'Uwaga',
        info: 'Informacja',
        item_created: 'Przedmiot został dodany',
        item_updated: 'Przedmiot został zaktualizowany',
        item_deleted: 'Przedmiot został usunięty',
        confirm_delete: 'Czy na pewno chcesz usunąć?',

        // Stats
        statistics: 'Statystyki',
        total_items: 'Wszystkich przedmiotów',
        awaiting_collection: 'Oczekujących na odbiór',
        returned_to_owner: 'Zwróconych właścicielom',
        data_sources: 'Źródeł danych (urzędów)',

        // Info section
        how_it_works: 'Jak to działa?',
        how_step1: 'Wpisz opis zgubionego przedmiotu w wyszukiwarkę',
        how_step2: 'Użyj filtrów, aby zawęzić wyniki do odpowiedniego regionu',
        how_step3: 'Przeglądaj znalezione przedmioty',
        how_step4: 'Jeśli znajdziesz swoją rzecz, skontaktuj się z odpowiednim biurem',
        about_project: 'O projekcie',
        about_desc1_part1: 'Centralna wyszukiwarka rzeczy znalezionych łączy dane z Biur Rzeczy Znalezionych z całej Polski. Dane są udostępniane przez portal',
        about_desc1_part2: 'w ramach otwartych danych publicznych.',
        about_desc2: 'Zgodnie z ustawą z dnia 20 lutego 2015 r. o rzeczach znalezionych, przedmioty przechowywane są przez 2 lata od daty znalezienia.',
        legal_basis: 'Podstawa prawna',
        legal_text: 'Ustawa z dnia 20 lutego 2015 r. o rzeczach znalezionych (Dz.U. 2015 poz. 397)',
        view_law: 'Zobacz ustawę',

        // Footer
        footer_about: 'Mechanizm do udostępniania danych o rzeczach znalezionych',
        footer_project: 'Projekt stworzony na HackNation 2025',
        footer_links: 'Linki',
        footer_contact: 'Kontakt',
        footer_copyright: '© 2025 Otwarte Dane - Kancelaria Prezesa Rady Ministrów',

        // Profile Page
        profile_title: 'Profil użytkownika',
        profile_subtitle: 'Zarządzaj swoim profilem i ustawieniami konta',
        personal_info: 'Informacje osobiste',
        security: 'Bezpieczeństwo',
        settings: 'Ustawienia',
        activity: 'Aktywność',
        change_password: 'Zmiana hasła',
        change_password_desc: 'Regularnie zmieniaj hasło, aby zabezpieczyć swoje konto',
        current_password: 'Obecne hasło',
        new_password: 'Nowe hasło',
        confirm_password_label: 'Potwierdź nowe hasło',
        password_min_length: 'Minimum 8 znaków',
        active_sessions: 'Aktywne sesje',
        current_session: 'Bieżąca sesja',
        logged_in: 'Zalogowano',
        language_interface: 'Język interfejsu',
        save_settings: 'Zapisz ustawienia',
        danger_zone: 'Strefa niebezpieczna',
        deactivate_account: 'Dezaktywacja konta',
        deactivate_desc: 'Po dezaktywacji konta nie będziesz mógł się zalogować',
        deactivate_button: 'Dezaktywuj konto',
        admin_panel: 'Panel administratora',

        // Admin Page
        admin_title: 'Panel Administratora',
        admin_subtitle: 'Zarządzanie użytkownikami i statystykami',
        dashboard: 'Dashboard',
        users: 'Użytkownicy',
        permissions: 'Uprawnienia',
        permissions_users: 'użytkowników',
        audit_log: 'Dziennik zdarzeń',
        system_settings: 'Ustawienia systemu',
        my_profile: 'Mój profil',
        users_count: 'Użytkowników',
        items_count: 'Przedmiotów',
        events_today: 'Zdarzeń (dzisiaj)',
        database: 'Baza danych',
        recent_activity: 'Najnowsza aktywność',
        user_management: 'Zarządzanie użytkownikami',
        add_user: 'Dodaj użytkownika',
        user: 'Użytkownik',
        organization: 'Organizacja',
        loading_users: 'Ładowanie użytkowników...',
        roles_permissions: 'Role i uprawnienia',
        roles_description: 'System obsługuje trzy role użytkowników z różnymi poziomami dostępu:',
        admin_permissions: 'Pełny dostęp do wszystkich funkcji systemu',
        manage_users_permissions: 'Zarządzanie użytkownikami i uprawnieniami',
        admin_panel_access: 'Dostęp do panelu administratora',
        view_audit_log: 'Przeglądanie dziennika zdarzeń',
        system_config: 'Konfiguracja systemu',
        create_edit_delete: 'Tworzenie, edycja i usuwanie wszystkich danych',
        add_edit_items: 'Dodawanie i edycja rzeczy znalezionych',
        manage_org_data: 'Zarządzanie danymi swojej organizacji',
        export_data: 'Eksport danych do dane.gov.pl',
        view_statistics: 'Przeglądanie statystyk',
        browse_public: 'Przeglądanie publicznego portalu',
        search_items: 'Wyszukiwanie rzeczy znalezionych',
        read_only: 'Dostęp tylko do odczytu',
        change_permissions: 'Zmiana uprawnień',
        change_permissions_desc: 'Aby zmienić rolę użytkownika, przejdź do zakładki "Użytkownicy" i kliknij przycisk "Edytuj" przy wybranym użytkowniku.',
        total_users: 'Całkowita liczba użytkowników',
        active_users: 'Aktywni użytkownicy',
        admins: 'Administratorzy',
        officials: 'Urzędnicy',
        official: 'Urzędnik',
        role: 'Rola',
        created: 'Utworzono',
        actions: 'Akcje',
        active: 'Aktywny',
        inactive: 'Nieaktywny',
        make_admin: 'Nadaj uprawnienia admin',
        remove_admin: 'Odbierz uprawnienia admin',
        activate: 'Aktywuj',
        deactivate: 'Dezaktywuj',
        all_actions: 'Wszystkie akcje',
        create_action: 'Utworzenie',
        update_action: 'Aktualizacja',
        delete_action: 'Usunięcie',
        login_action: 'Logowanie',
        refresh_btn: 'Odśwież',
        system_info: 'Informacje o systemie',
        version: 'Wersja',
        environment: 'Środowisko',
        maintenance: 'Konserwacja',
        download_backup: 'Pobierz kopię zapasową bazy danych',
        clear_cache: 'Wyczyść cache',
        danger_zone_title: 'Strefa niebezpieczna',
        danger_zone_desc: 'Poniższe akcje są nieodwracalne. Zachowaj ostrożność.',
        reset_database: 'Zresetuj bazę danych',
        add_user_title: 'Dodaj użytkownika',
        full_name: 'Imię i nazwisko',
        phone_number: 'Telefon',
        user_password: 'Hasło',
        password_min: 'Minimum 8 znaków',
        user_organization: 'Organizacja',
        user_role: 'Rola',
        role_user: 'Użytkownik',
        role_official: 'Urzędnik',
        role_admin: 'Administrator',
        account_active: 'Konto aktywne',
        for_officials: 'Dla urzędników',
        admin_panel_link: 'Panel administracyjny',
        data_schema: 'Schemat danych (JSON)',

        // Common UI
        welcome: 'Witaj',
        dashboard: 'Panel glowny',
        home: 'Strona glowna',
        about: 'O nas',
        contact: 'Kontakt',
        location: 'Miejsce',
        items: 'przedmiotów',
        valid: 'poprawnych',
        errors: 'błędów',
        add_another: 'Dodaj i wprowadź kolejny',
        next_preview: 'Dalej do podglądu',
        added_items: 'Dodane przedmioty',
        go_to_preview: 'Przejdź do podglądu',
        back_to_edit: 'Wróć do edycji',
        go_to_export: 'Przejdź do eksportu',
        back_to_preview: 'Wróć do podglądu',
        start_over: 'Rozpocznij od nowa',
        links: 'Linki',
        portal_link: 'Portal dane.gov.pl',
        knowledge_base: 'Baza wiedzy',
        api_docs: 'API dokumentacja',
        footer_desc: 'Mechanizm do udostępniania danych o rzeczach znalezionych w portalu dane.gov.pl',
        footer_note: 'Projekt stworzony na HackNation 2024',
        copyright: '© 2025 Otwarte Dane - Kancelaria Prezesa Rady Ministrów',
        help: 'Pomoc',
        privacy: 'Prywatność',
        terms: 'Regulamin',
        loading_text: 'Ładowanie danych...',
        no_data: 'Brak danych',
        error_loading: 'Błąd ładowania danych',
        try_again: 'Spróbuj ponownie',
        refresh: 'Odśwież',
        apply: 'Zastosuj',
        reset: 'Resetuj',
        clear: 'Wyczyść',
        select_all: 'Zaznacz wszystkie',
        deselect_all: 'Odznacz wszystkie',
        showing: 'Wyświetlanie',
        of: 'z',
        items_text: 'elementów',
        page: 'Strona',
        per_page: 'Na stronę',
        first: 'Pierwsza',
        last: 'Ostatnia',
        previous: 'Poprzednia',
        next_page: 'Następna'
    },

    en: {
        // General
        app_name: 'Lost and Found',
        app_subtitle: 'Mechanism for quick sharing of lost and found data on the dane.gov.pl portal',
        skip_to_content: 'Skip to main content',
        govpl_text: 'Service of the Republic of Poland',
        open_data: 'Open Data',
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
        description: 'Item description',
        date_found: 'Date found',
        location_found: 'Location found',
        location_type: 'Location type',
        municipality: 'Municipality',
        county: 'County',
        voivodeship: 'Voivodeship',
        estimated_value: 'Estimated value (PLN)',
        collection_deadline: 'Collection deadline',
        photo: 'Photo',
        photo_url: 'Photo link (optional)',
        notes: 'Additional notes',
        basic_info: 'Basic information',
        location_section: 'Location found',
        office_section: 'Lost and Found Office',
        additional_info: 'Additional information',
        select_category: '-- Select category --',
        select: '-- Select --',
        select_voivodeship: '-- Select voivodeship --',
        // Placeholders
        item_name_placeholder: 'E.g., Samsung Galaxy S23 Phone, Leather wallet',
        description_placeholder: 'E.g., Samsung Galaxy S23 phone, black color, cracked screen in top left corner, blue silicone case',
        description_hint: 'Provide detailed description with color, brand, special features',
        estimated_value_placeholder: 'E.g., 2500',
        value_hint: 'Required for items valued over 100 PLN',
        location_placeholder: 'E.g., Bus line 144, Main Square stop',
        municipality_placeholder: 'E.g., Krakow',
        county_placeholder: 'E.g., Krakow',
        office_name_placeholder: 'E.g., District Office Lost and Found Bureau',
        office_address_placeholder: 'E.g., Main St. 1, room 101, 31-000 Krakow',
        office_hours_placeholder: 'E.g., Mon-Fri: 8:00-16:00',
        photo_hint: 'Provide a link to item photo (if available)',
        deadline_hint: 'According to law, found items are stored for 2 years',
        notes_placeholder: 'Additional information about the item...',

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
        search_title: 'Search Lost and Found Items',
        search_subtitle: 'Central lost and found search engine for all of Poland',
        search_placeholder: 'What are you looking for...',
        search_results: 'Search results',
        no_results: 'No results',
        results_count: '{count} results',
        results_text: 'results',
        searching: 'Searching...',
        start_searching: 'Start searching',
        start_searching_desc: 'Type what you are looking for or use filters to find a lost item.',
        no_results_desc: 'No items found matching your search.',
        no_results_suggestion: 'Try reducing the number of filters or use different keywords.',
        filters: 'Filters',
        advanced_filters: 'Advanced filters',
        clear_filters: 'Clear filters',
        date_from: 'Date from',
        date_to: 'Date to',

        // Views
        view_grid: 'Grid view',
        view_list: 'List view',
        view_map: 'Map view',
        view_details: 'View details',

        // Steps
        step: 'Step',
        step_1: 'Choose source',
        step_2: 'Enter data',
        step_3: 'Preview',
        step_4: 'Download file',
        step1_label: 'Choose source',
        step2_label: 'Enter data',
        step3_label: 'Review preview',
        step4_label: 'Download file',
        step1_title: 'Step 1: Choose data entry method',
        step1_desc: 'Choose how you want to add lost and found data:',
        step2_title: 'Step 2: Enter found item data',
        step3_title: 'Step 3: Review data preview',
        step3_desc: 'Check data correctness before generating file for dane.gov.pl portal',
        step4_title: 'Step 4: Download file for dane.gov.pl portal',
        step4_desc: 'Choose file format and download data ready for publication on dane.gov.pl portal',

        // Upload
        upload_file: 'Upload Excel/CSV file',
        upload_desc: 'Drag and drop file or click to select. Supported formats: .xlsx, .xls, .csv',
        drag_file: 'Drag file here',
        or: 'or',
        choose_file: 'Choose file',
        drag_drop: 'Drag file here',
        select_file: 'Select file',
        supported_formats: 'Supported formats: .xlsx, .xls, .csv',
        download_template: 'Download Excel template',
        fill_form: 'Fill form',
        form_desc: 'Enter data manually. Perfect for single items or small number of entries.',
        start_entry: 'Start entering',

        // Export
        export: 'Export',
        export_json: 'Download JSON',
        export_csv: 'Download CSV',
        export_success: 'File downloaded',
        format_json: 'JSON Format',
        format_csv: 'CSV Format',
        json_desc: 'Recommended format for dane.gov.pl. Machine-readable, API-ready.',
        csv_desc: 'Universal tabular format. Can be opened in Excel.',
        download_json: 'Download JSON',
        download_csv: 'Download CSV',
        what_next: 'What\'s next?',
        next_step1: 'Download file in your chosen format',
        next_step2: 'Log in to dane.gov.pl',
        next_step3: 'Go to Admin Panel → Data → Add dataset',
        next_step4: 'Upload the downloaded file as a resource',
        next_step5: 'Publish the dataset',

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
        data_sources: 'Data sources (offices)',

        // Info section
        how_it_works: 'How does it work?',
        how_step1: 'Enter description of your lost item in the search bar',
        how_step2: 'Use filters to narrow results to the appropriate region',
        how_step3: 'Browse found items',
        how_step4: 'If you find your item, contact the appropriate office',
        about_project: 'About the project',
        about_desc1_part1: 'The central lost and found search engine connects data from Lost and Found Offices across Poland. The data is provided through the',
        about_desc1_part2: 'portal as part of open public data.',
        about_desc2: 'According to the Act of February 20, 2015 on found items, items are stored for 2 years from the date of finding.',
        legal_basis: 'Legal basis',
        legal_text: 'Act of February 20, 2015 on found items (Journal of Laws 2015, item 397)',
        view_law: 'View the law',

        // Footer
        footer_about: 'Mechanism for sharing lost and found data',
        footer_project: 'Project created for HackNation 2025',
        footer_links: 'Links',
        footer_contact: 'Contact',
        footer_copyright: '© 2025 Open Data - Chancellery of the Prime Minister',

        // Profile Page
        profile_title: 'User Profile',
        profile_subtitle: 'Manage your profile and account settings',
        personal_info: 'Personal Information',
        security: 'Security',
        settings: 'Settings',
        activity: 'Activity',
        change_password: 'Change Password',
        change_password_desc: 'Change your password regularly to keep your account secure',
        current_password: 'Current password',
        new_password: 'New password',
        confirm_password_label: 'Confirm new password',
        password_min_length: 'Minimum 8 characters',
        active_sessions: 'Active Sessions',
        current_session: 'Current session',
        logged_in: 'Logged in',
        language_interface: 'Interface Language',
        save_settings: 'Save Settings',
        danger_zone: 'Danger Zone',
        deactivate_account: 'Account Deactivation',
        deactivate_desc: 'After deactivation, you will not be able to log in',
        deactivate_button: 'Deactivate Account',
        admin_panel: 'Administrator Panel',

        // Admin Page
        admin_title: 'Administrator Panel',
        admin_subtitle: 'Manage users and statistics',
        dashboard: 'Dashboard',
        users: 'Users',
        permissions: 'Permissions',
        permissions_users: 'users',
        audit_log: 'Audit Log',
        system_settings: 'System Settings',
        my_profile: 'My Profile',
        users_count: 'Users',
        items_count: 'Items',
        events_today: 'Events (today)',
        database: 'Database',
        recent_activity: 'Recent Activity',
        user_management: 'User Management',
        add_user: 'Add User',
        user: 'User',
        organization: 'Organization',
        loading_users: 'Loading users...',
        roles_permissions: 'Roles and Permissions',
        roles_description: 'The system supports three user roles with different access levels:',
        admin_permissions: 'Full access to all system features',
        manage_users_permissions: 'User and permission management',
        admin_panel_access: 'Access to administrator panel',
        view_audit_log: 'View audit log',
        system_config: 'System configuration',
        create_edit_delete: 'Create, edit and delete all data',
        add_edit_items: 'Add and edit found items',
        manage_org_data: 'Manage organization data',
        export_data: 'Export data to dane.gov.pl',
        view_statistics: 'View statistics',
        browse_public: 'Browse public portal',
        search_items: 'Search found items',
        read_only: 'Read-only access',
        change_permissions: 'Change Permissions',
        change_permissions_desc: 'To change a user\'s role, go to the "Users" tab and click the "Edit" button next to the selected user.',
        total_users: 'Total Users',
        active_users: 'Active Users',
        admins: 'Administrators',
        officials: 'Officials',
        official: 'Official',
        role: 'Role',
        created: 'Created',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        make_admin: 'Make Admin',
        remove_admin: 'Remove Admin',
        activate: 'Activate',
        deactivate: 'Deactivate',
        all_actions: 'All actions',
        create_action: 'Create',
        update_action: 'Update',
        delete_action: 'Delete',
        login_action: 'Login',
        refresh_btn: 'Refresh',
        system_info: 'System Information',
        version: 'Version',
        environment: 'Environment',
        maintenance: 'Maintenance',
        download_backup: 'Download database backup',
        clear_cache: 'Clear cache',
        danger_zone_title: 'Danger Zone',
        danger_zone_desc: 'The following actions are irreversible. Exercise caution.',
        reset_database: 'Reset Database',
        add_user_title: 'Add User',
        full_name: 'Full name',
        phone_number: 'Phone',
        user_password: 'Password',
        password_min: 'Minimum 8 characters',
        user_organization: 'Organization',
        user_role: 'Role',
        role_user: 'User',
        role_official: 'Official',
        role_admin: 'Administrator',
        account_active: 'Active account',
        for_officials: 'For Officials',
        admin_panel_link: 'Administrative Panel',
        data_schema: 'Data Schema (JSON)',

        // Common UI
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        location: 'Location',
        items: 'items',
        valid: 'valid',
        errors: 'errors',
        add_another: 'Add and enter another',
        next_preview: 'Next to preview',
        added_items: 'Added items',
        go_to_preview: 'Go to preview',
        back_to_edit: 'Back to edit',
        go_to_export: 'Go to export',
        back_to_preview: 'Back to preview',
        start_over: 'Start over',
        links: 'Links',
        portal_link: 'dane.gov.pl Portal',
        knowledge_base: 'Knowledge base',
        api_docs: 'API documentation',
        footer_desc: 'Mechanism for quick sharing of lost and found data on the dane.gov.pl portal',
        footer_note: 'Project created at HackNation 2024',
        copyright: '© 2025 Open Data - Chancellery of the Prime Minister of Poland',
        help: 'Help',
        privacy: 'Privacy',
        terms: 'Terms',
        loading_text: 'Loading data...',
        no_data: 'No data',
        error_loading: 'Error loading data',
        try_again: 'Try again',
        refresh: 'Refresh',
        apply: 'Apply',
        reset: 'Reset',
        clear: 'Clear',
        select_all: 'Select All',
        deselect_all: 'Deselect All',
        showing: 'Showing',
        of: 'of',
        items_text: 'items',
        page: 'Page',
        per_page: 'Per page',
        first: 'First',
        last: 'Last',
        previous: 'Previous',
        next_page: 'Next'
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

        // Auto-translate common text (without data-i18n attributes)
        if (this.currentLanguage === 'en') {
            this.autoTranslate();
        }
    }

    /**
     * Auto-translate common Polish words to English
     * This works without needing data-i18n attributes
     */
    autoTranslate() {
        const textMap = {
            'Profil użytkownika': 'User Profile',
            'Profil': 'Profile',
            'Panel Administratora': 'Administrator Panel',
            'Panel urzędnika': 'Official Panel',
            'Szukaj rzeczy': 'Search Items',
            'Zaloguj': 'Login',
            'Wyloguj': 'Logout',
            'Zapisz': 'Save',
            'Anuluj': 'Cancel',
            'Edytuj': 'Edit',
            'Usuń': 'Delete',
            'Zamknij': 'Close',
            'Dalej': 'Next',
            'Wstecz': 'Back',
            'Informacje osobiste': 'Personal Information',
            'Bezpieczeństwo': 'Security',
            'Ustawienia': 'Settings',
            'Aktywność': 'Activity',
            'Administrator': 'Administrator',
            'Zarządzanie użytkownikami': 'User Management',
            'Statystyki': 'Statistics',
            'Akcje': 'Actions',
            'Email': 'Email',
            'Telefon': 'Phone',
            'Organizacja': 'Organization',
            'Imię i nazwisko': 'Full Name',
            'Hasło': 'Password',
            'Język interfejsu': 'Interface Language',
            'Polski': 'Polish',
            'Angielski': 'English'
        };

        // Replace text in all text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToUpdate = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const text = node.textContent.trim();
            if (text && textMap[text]) {
                nodesToUpdate.push({ node, newText: textMap[text] });
            }
        }

        // Update nodes
        nodesToUpdate.forEach(({ node, newText }) => {
            node.textContent = newText;
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
// Note: updateUI() is now called from each page's initializeLanguageSwitcher() function
// document.addEventListener('DOMContentLoaded', () => {
//     i18n.updateUI();
// });

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, i18n, translations };
}
