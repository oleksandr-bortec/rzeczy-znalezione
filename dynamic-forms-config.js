/**
 * KILLER FEATURE #2: INTELIGENTNY FORMULARZ DYNAMICZNY
 * Dynamic form schemas for different item categories
 * Each category has specific fields that appear when selected
 */

const DYNAMIC_FORM_SCHEMAS = {
  // 📱 ELEKTRONIKA (Telefony, laptopy, tablety)
  electronics: {
    name: { pl: 'Elektronika', en: 'Electronics' },
    icon: 'fa-laptop',
    subcategories: [
      { value: 'phone', pl: 'Telefon', en: 'Phone' },
      { value: 'laptop', pl: 'Laptop', en: 'Laptop' },
      { value: 'tablet', pl: 'Tablet', en: 'Tablet' },
      { value: 'smartwatch', pl: 'Smartwatch', en: 'Smartwatch' },
      { value: 'headphones', pl: 'Słuchawki', en: 'Headphones' },
      { value: 'other_electronics', pl: 'Inna elektronika', en: 'Other electronics' }
    ],
    fields: [
      {
        id: 'subcategory',
        type: 'select',
        label: { pl: 'Typ urządzenia', en: 'Device type' },
        required: true,
        options: 'subcategories' // reference to subcategories
      },
      {
        id: 'brand',
        type: 'select',
        label: { pl: 'Marka', en: 'Brand' },
        required: true,
        options: [
          'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google', 'Motorola',
          'Nokia', 'LG', 'Sony', 'Oppo', 'Realme', 'Vivo', 'Asus', 'Lenovo',
          'HP', 'Dell', 'Acer', 'MSI', 'Inna'
        ],
        conditional: { field: 'subcategory', values: ['phone', 'laptop', 'tablet', 'smartwatch'] }
      },
      {
        id: 'model',
        type: 'text',
        label: { pl: 'Model', en: 'Model' },
        required: false,
        placeholder: { pl: 'np. iPhone 14 Pro, Galaxy S23', en: 'e.g. iPhone 14 Pro, Galaxy S23' }
      },
      {
        id: 'color',
        type: 'select',
        label: { pl: 'Kolor', en: 'Color' },
        required: true,
        options: [
          { value: 'black', pl: 'Czarny', en: 'Black' },
          { value: 'white', pl: 'Biały', en: 'White' },
          { value: 'gray', pl: 'Szary', en: 'Gray' },
          { value: 'silver', pl: 'Srebrny', en: 'Silver' },
          { value: 'gold', pl: 'Złoty', en: 'Gold' },
          { value: 'blue', pl: 'Niebieski', en: 'Blue' },
          { value: 'red', pl: 'Czerwony', en: 'Red' },
          { value: 'green', pl: 'Zielony', en: 'Green' },
          { value: 'purple', pl: 'Fioletowy', en: 'Purple' },
          { value: 'pink', pl: 'Różowy', en: 'Pink' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      },
      {
        id: 'screen_condition',
        type: 'select',
        label: { pl: 'Stan ekranu', en: 'Screen condition' },
        required: true,
        options: [
          { value: 'perfect', pl: 'Idealny', en: 'Perfect' },
          { value: 'minor_scratches', pl: 'Drobne rysy', en: 'Minor scratches' },
          { value: 'scratched', pl: 'Porysowany', en: 'Scratched' },
          { value: 'cracked', pl: 'Pęknięty', en: 'Cracked' },
          { value: 'broken', pl: 'Rozbity', en: 'Broken' }
        ],
        conditional: { field: 'subcategory', values: ['phone', 'tablet', 'smartwatch'] }
      },
      {
        id: 'imei',
        type: 'text',
        label: { pl: 'IMEI (jeśli widoczny)', en: 'IMEI (if visible)' },
        required: false,
        pattern: '[0-9]{15}',
        placeholder: { pl: '15 cyfr', en: '15 digits' },
        conditional: { field: 'subcategory', values: ['phone'] }
      },
      {
        id: 'serial_number',
        type: 'text',
        label: { pl: 'Numer seryjny', en: 'Serial number' },
        required: false,
        placeholder: { pl: 'jeśli widoczny', en: 'if visible' }
      },
      {
        id: 'has_case',
        type: 'radio',
        label: { pl: 'Etui/pokrowiec', en: 'Case/cover' },
        required: true,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ]
      },
      {
        id: 'sim_card',
        type: 'radio',
        label: { pl: 'Karta SIM', en: 'SIM card' },
        required: true,
        options: [
          { value: 'present', pl: 'Obecna', en: 'Present' },
          { value: 'absent', pl: 'Brak', en: 'Absent' }
        ],
        conditional: { field: 'subcategory', values: ['phone'] }
      },
      {
        id: 'memory_card',
        type: 'radio',
        label: { pl: 'Karta pamięci', en: 'Memory card' },
        required: false,
        options: [
          { value: 'present', pl: 'Obecna', en: 'Present' },
          { value: 'absent', pl: 'Brak', en: 'Absent' }
        ],
        conditional: { field: 'subcategory', values: ['phone', 'tablet'] }
      },
      {
        id: 'battery_status',
        type: 'select',
        label: { pl: 'Stan baterii', en: 'Battery status' },
        required: false,
        options: [
          { value: 'charged', pl: 'Naładowana', en: 'Charged' },
          { value: 'low', pl: 'Niski poziom', en: 'Low' },
          { value: 'dead', pl: 'Rozładowana', en: 'Dead' },
          { value: 'unknown', pl: 'Nieznany', en: 'Unknown' }
        ]
      },
      {
        id: 'accessories',
        type: 'checkbox',
        label: { pl: 'Akcesoria', en: 'Accessories' },
        required: false,
        options: [
          { value: 'charger', pl: 'Ładowarka', en: 'Charger' },
          { value: 'cable', pl: 'Kabel', en: 'Cable' },
          { value: 'headphones', pl: 'Słuchawki', en: 'Headphones' },
          { value: 'case', pl: 'Etui', en: 'Case' },
          { value: 'other', pl: 'Inne', en: 'Other' }
        ]
      }
    ]
  },

  // 📄 DOKUMENTY (Dowody, prawa jazdy, karty)
  documents: {
    name: { pl: 'Dokumenty', en: 'Documents' },
    icon: 'fa-file-alt',
    subcategories: [
      { value: 'id_card', pl: 'Dowód osobisty', en: 'ID card' },
      { value: 'passport', pl: 'Paszport', en: 'Passport' },
      { value: 'drivers_license', pl: 'Prawo jazdy', en: "Driver's license" },
      { value: 'student_id', pl: 'Legitymacja studencka', en: 'Student ID' },
      { value: 'bank_card', pl: 'Karta płatnicza', en: 'Bank card' },
      { value: 'insurance_card', pl: 'Karta ubezpieczenia', en: 'Insurance card' },
      { value: 'other_document', pl: 'Inny dokument', en: 'Other document' }
    ],
    fields: [
      {
        id: 'subcategory',
        type: 'select',
        label: { pl: 'Typ dokumentu', en: 'Document type' },
        required: true,
        options: 'subcategories'
      },
      {
        id: 'document_number',
        type: 'text',
        label: { pl: 'Numer dokumentu (jeśli widoczny)', en: 'Document number (if visible)' },
        required: false,
        placeholder: { pl: 'Ostatnie 4 cyfry dla bezpieczeństwa', en: 'Last 4 digits for security' }
      },
      {
        id: 'full_name',
        type: 'text',
        label: { pl: 'Imię i nazwisko (jeśli widoczne)', en: 'Full name (if visible)' },
        required: false,
        placeholder: { pl: 'Widoczne na dokumencie', en: 'Visible on document' }
      },
      {
        id: 'date_of_birth',
        type: 'date',
        label: { pl: 'Data urodzenia (jeśli widoczna)', en: 'Date of birth (if visible)' },
        required: false,
        conditional: { field: 'subcategory', values: ['id_card', 'passport', 'drivers_license'] }
      },
      {
        id: 'expiry_date',
        type: 'date',
        label: { pl: 'Data ważności', en: 'Expiry date' },
        required: false,
        conditional: { field: 'subcategory', values: ['id_card', 'passport', 'drivers_license', 'student_id'] }
      },
      {
        id: 'issuing_authority',
        type: 'text',
        label: { pl: 'Organ wydający', en: 'Issuing authority' },
        required: false,
        placeholder: { pl: 'np. Prezydent m.st. Warszawy', en: 'e.g. Mayor of Warsaw' }
      },
      {
        id: 'card_bank',
        type: 'text',
        label: { pl: 'Nazwa banku', en: 'Bank name' },
        required: false,
        conditional: { field: 'subcategory', values: ['bank_card'] }
      },
      {
        id: 'card_type',
        type: 'select',
        label: { pl: 'Typ karty', en: 'Card type' },
        required: false,
        options: [
          { value: 'visa', pl: 'Visa', en: 'Visa' },
          { value: 'mastercard', pl: 'Mastercard', en: 'Mastercard' },
          { value: 'maestro', pl: 'Maestro', en: 'Maestro' },
          { value: 'american_express', pl: 'American Express', en: 'American Express' },
          { value: 'other', pl: 'Inna', en: 'Other' }
        ],
        conditional: { field: 'subcategory', values: ['bank_card'] }
      },
      {
        id: 'document_condition',
        type: 'select',
        label: { pl: 'Stan dokumentu', en: 'Document condition' },
        required: true,
        options: [
          { value: 'excellent', pl: 'Bardzo dobry', en: 'Excellent' },
          { value: 'good', pl: 'Dobry', en: 'Good' },
          { value: 'worn', pl: 'Zużyty', en: 'Worn' },
          { value: 'damaged', pl: 'Uszkodzony', en: 'Damaged' }
        ]
      },
      {
        id: 'has_photo',
        type: 'radio',
        label: { pl: 'Zdjęcie na dokumencie', en: 'Photo on document' },
        required: false,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ],
        conditional: { field: 'subcategory', values: ['id_card', 'passport', 'drivers_license', 'student_id'] }
      }
    ]
  },

  // 🔑 KLUCZE (Mieszkaniowe, samochodowe, biurowe)
  keys: {
    name: { pl: 'Klucze', en: 'Keys' },
    icon: 'fa-key',
    subcategories: [
      { value: 'home_keys', pl: 'Klucze mieszkaniowe', en: 'Home keys' },
      { value: 'car_keys', pl: 'Klucze samochodowe', en: 'Car keys' },
      { value: 'office_keys', pl: 'Klucze biurowe', en: 'Office keys' },
      { value: 'padlock_key', pl: 'Klucz do kłódki', en: 'Padlock key' },
      { value: 'other_keys', pl: 'Inne klucze', en: 'Other keys' }
    ],
    fields: [
      {
        id: 'subcategory',
        type: 'select',
        label: { pl: 'Typ kluczy', en: 'Key type' },
        required: true,
        options: 'subcategories'
      },
      {
        id: 'number_of_keys',
        type: 'number',
        label: { pl: 'Liczba kluczy', en: 'Number of keys' },
        required: true,
        min: 1,
        max: 50
      },
      {
        id: 'keychain',
        type: 'radio',
        label: { pl: 'Brelok/kółko', en: 'Keychain/ring' },
        required: true,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ]
      },
      {
        id: 'keychain_description',
        type: 'textarea',
        label: { pl: 'Opis breloka', en: 'Keychain description' },
        required: false,
        placeholder: { pl: 'np. czerwony brelok z logo, metalowe kółko', en: 'e.g. red keychain with logo, metal ring' },
        conditional: { field: 'keychain', values: ['yes'] }
      },
      {
        id: 'car_brand',
        type: 'select',
        label: { pl: 'Marka samochodu', en: 'Car brand' },
        required: false,
        options: [
          'Audi', 'BMW', 'Citroën', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Kia',
          'Mazda', 'Mercedes-Benz', 'Nissan', 'Opel', 'Peugeot', 'Renault',
          'Seat', 'Škoda', 'Toyota', 'Volkswagen', 'Volvo', 'Inna'
        ],
        conditional: { field: 'subcategory', values: ['car_keys'] }
      },
      {
        id: 'remote_control',
        type: 'radio',
        label: { pl: 'Pilot zdalnego sterowania', en: 'Remote control' },
        required: false,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ],
        conditional: { field: 'subcategory', values: ['car_keys'] }
      },
      {
        id: 'tags_or_labels',
        type: 'textarea',
        label: { pl: 'Zawieszki lub oznaczenia', en: 'Tags or labels' },
        required: false,
        placeholder: { pl: 'np. numer mieszkania, nazwa firmy', en: 'e.g. apartment number, company name' }
      },
      {
        id: 'key_material',
        type: 'select',
        label: { pl: 'Materiał kluczy', en: 'Key material' },
        required: false,
        options: [
          { value: 'brass', pl: 'Mosiądz', en: 'Brass' },
          { value: 'steel', pl: 'Stal', en: 'Steel' },
          { value: 'aluminum', pl: 'Aluminium', en: 'Aluminum' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      }
    ]
  },

  // 👜 BAGAŻ (Torby, plecaki, walizki)
  luggage: {
    name: { pl: 'Bagaż', en: 'Luggage' },
    icon: 'fa-suitcase',
    subcategories: [
      { value: 'backpack', pl: 'Plecak', en: 'Backpack' },
      { value: 'handbag', pl: 'Torebka', en: 'Handbag' },
      { value: 'suitcase', pl: 'Walizka', en: 'Suitcase' },
      { value: 'sports_bag', pl: 'Torba sportowa', en: 'Sports bag' },
      { value: 'laptop_bag', pl: 'Torba na laptop', en: 'Laptop bag' },
      { value: 'other_bag', pl: 'Inna torba', en: 'Other bag' }
    ],
    fields: [
      {
        id: 'subcategory',
        type: 'select',
        label: { pl: 'Typ bagażu', en: 'Luggage type' },
        required: true,
        options: 'subcategories'
      },
      {
        id: 'color',
        type: 'select',
        label: { pl: 'Kolor', en: 'Color' },
        required: true,
        options: [
          { value: 'black', pl: 'Czarny', en: 'Black' },
          { value: 'brown', pl: 'Brązowy', en: 'Brown' },
          { value: 'gray', pl: 'Szary', en: 'Gray' },
          { value: 'blue', pl: 'Niebieski', en: 'Blue' },
          { value: 'red', pl: 'Czerwony', en: 'Red' },
          { value: 'green', pl: 'Zielony', en: 'Green' },
          { value: 'pink', pl: 'Różowy', en: 'Pink' },
          { value: 'multicolor', pl: 'Wielokolorowy', en: 'Multicolor' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      },
      {
        id: 'brand',
        type: 'text',
        label: { pl: 'Marka', en: 'Brand' },
        required: false,
        placeholder: { pl: 'jeśli widoczna', en: 'if visible' }
      },
      {
        id: 'material',
        type: 'select',
        label: { pl: 'Materiał', en: 'Material' },
        required: true,
        options: [
          { value: 'leather', pl: 'Skóra', en: 'Leather' },
          { value: 'synthetic', pl: 'Skóra syntetyczna', en: 'Synthetic leather' },
          { value: 'fabric', pl: 'Tkanina', en: 'Fabric' },
          { value: 'nylon', pl: 'Nylon', en: 'Nylon' },
          { value: 'plastic', pl: 'Plastik', en: 'Plastic' },
          { value: 'canvas', pl: 'Płótno', en: 'Canvas' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      },
      {
        id: 'size',
        type: 'select',
        label: { pl: 'Rozmiar', en: 'Size' },
        required: true,
        options: [
          { value: 'small', pl: 'Mały', en: 'Small' },
          { value: 'medium', pl: 'Średni', en: 'Medium' },
          { value: 'large', pl: 'Duży', en: 'Large' },
          { value: 'extra_large', pl: 'Bardzo duży', en: 'Extra large' }
        ]
      },
      {
        id: 'has_wheels',
        type: 'radio',
        label: { pl: 'Kółka', en: 'Wheels' },
        required: false,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ],
        conditional: { field: 'subcategory', values: ['suitcase'] }
      },
      {
        id: 'number_of_compartments',
        type: 'number',
        label: { pl: 'Liczba przegródek', en: 'Number of compartments' },
        required: false,
        min: 1,
        max: 20
      },
      {
        id: 'contents_description',
        type: 'textarea',
        label: { pl: 'Opis zawartości', en: 'Contents description' },
        required: false,
        placeholder: { pl: 'Główne przedmioty w środku (bez szczegółów osobowych)', en: 'Main items inside (without personal details)' }
      },
      {
        id: 'identifying_marks',
        type: 'textarea',
        label: { pl: 'Znaki identyfikacyjne', en: 'Identifying marks' },
        required: false,
        placeholder: { pl: 'np. naszywki, zawieszki, naklejki', en: 'e.g. patches, tags, stickers' }
      },
      {
        id: 'lock_present',
        type: 'radio',
        label: { pl: 'Zamek/kłódka', en: 'Lock/padlock' },
        required: false,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ]
      },
      {
        id: 'condition',
        type: 'select',
        label: { pl: 'Stan', en: 'Condition' },
        required: true,
        options: [
          { value: 'new', pl: 'Nowy', en: 'New' },
          { value: 'good', pl: 'Dobry', en: 'Good' },
          { value: 'worn', pl: 'Zużyty', en: 'Worn' },
          { value: 'damaged', pl: 'Uszkodzony', en: 'Damaged' }
        ]
      }
    ]
  },

  // 💍 WARTOŚCIOWE (Biżuteria, zegarki, portfele)
  valuables: {
    name: { pl: 'Przedmioty wartościowe', en: 'Valuables' },
    icon: 'fa-gem',
    subcategories: [
      { value: 'jewelry', pl: 'Biżuteria', en: 'Jewelry' },
      { value: 'watch', pl: 'Zegarek', en: 'Watch' },
      { value: 'wallet', pl: 'Portfel', en: 'Wallet' },
      { value: 'purse', pl: 'Portmonetka', en: 'Purse' },
      { value: 'glasses', pl: 'Okulary', en: 'Glasses' },
      { value: 'other_valuable', pl: 'Inny wartościowy przedmiot', en: 'Other valuable' }
    ],
    fields: [
      {
        id: 'subcategory',
        type: 'select',
        label: { pl: 'Typ przedmiotu', en: 'Item type' },
        required: true,
        options: 'subcategories'
      },
      {
        id: 'jewelry_type',
        type: 'select',
        label: { pl: 'Rodzaj biżuterii', en: 'Jewelry type' },
        required: false,
        options: [
          { value: 'ring', pl: 'Pierścionek', en: 'Ring' },
          { value: 'necklace', pl: 'Naszyjnik', en: 'Necklace' },
          { value: 'bracelet', pl: 'Bransoletka', en: 'Bracelet' },
          { value: 'earrings', pl: 'Kolczyki', en: 'Earrings' },
          { value: 'brooch', pl: 'Broszka', en: 'Brooch' },
          { value: 'other', pl: 'Inne', en: 'Other' }
        ],
        conditional: { field: 'subcategory', values: ['jewelry'] }
      },
      {
        id: 'material',
        type: 'select',
        label: { pl: 'Materiał', en: 'Material' },
        required: false,
        options: [
          { value: 'gold', pl: 'Złoto', en: 'Gold' },
          { value: 'silver', pl: 'Srebro', en: 'Silver' },
          { value: 'platinum', pl: 'Platyna', en: 'Platinum' },
          { value: 'steel', pl: 'Stal', en: 'Steel' },
          { value: 'leather', pl: 'Skóra', en: 'Leather' },
          { value: 'plastic', pl: 'Plastik', en: 'Plastic' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      },
      {
        id: 'watch_brand',
        type: 'text',
        label: { pl: 'Marka zegarka', en: 'Watch brand' },
        required: false,
        conditional: { field: 'subcategory', values: ['watch'] }
      },
      {
        id: 'watch_type',
        type: 'select',
        label: { pl: 'Typ zegarka', en: 'Watch type' },
        required: false,
        options: [
          { value: 'analog', pl: 'Analogowy', en: 'Analog' },
          { value: 'digital', pl: 'Cyfrowy', en: 'Digital' },
          { value: 'smart', pl: 'Smartwatch', en: 'Smartwatch' }
        ],
        conditional: { field: 'subcategory', values: ['watch'] }
      },
      {
        id: 'color',
        type: 'select',
        label: { pl: 'Kolor', en: 'Color' },
        required: true,
        options: [
          { value: 'black', pl: 'Czarny', en: 'Black' },
          { value: 'brown', pl: 'Brązowy', en: 'Brown' },
          { value: 'gold', pl: 'Złoty', en: 'Gold' },
          { value: 'silver', pl: 'Srebrny', en: 'Silver' },
          { value: 'blue', pl: 'Niebieski', en: 'Blue' },
          { value: 'red', pl: 'Czerwony', en: 'Red' },
          { value: 'multicolor', pl: 'Wielokolorowy', en: 'Multicolor' },
          { value: 'other', pl: 'Inny', en: 'Other' }
        ]
      },
      {
        id: 'wallet_contents',
        type: 'checkbox',
        label: { pl: 'Zawartość portfela', en: 'Wallet contents' },
        required: false,
        options: [
          { value: 'cash', pl: 'Gotówka', en: 'Cash' },
          { value: 'cards', pl: 'Karty płatnicze', en: 'Payment cards' },
          { value: 'id_documents', pl: 'Dokumenty tożsamości', en: 'ID documents' },
          { value: 'photos', pl: 'Zdjęcia', en: 'Photos' },
          { value: 'other', pl: 'Inne', en: 'Other' }
        ],
        conditional: { field: 'subcategory', values: ['wallet', 'purse'] }
      },
      {
        id: 'cash_amount',
        type: 'number',
        label: { pl: 'Przybliżona kwota gotówki (PLN)', en: 'Approximate cash amount (PLN)' },
        required: false,
        min: 0,
        conditional: { field: 'wallet_contents', contains: 'cash' }
      },
      {
        id: 'glasses_type',
        type: 'select',
        label: { pl: 'Typ okularów', en: 'Glasses type' },
        required: false,
        options: [
          { value: 'prescription', pl: 'Korekcyjne', en: 'Prescription' },
          { value: 'sunglasses', pl: 'Przeciwsłoneczne', en: 'Sunglasses' },
          { value: 'reading', pl: 'Do czytania', en: 'Reading' }
        ],
        conditional: { field: 'subcategory', values: ['glasses'] }
      },
      {
        id: 'has_case',
        type: 'radio',
        label: { pl: 'Etui', en: 'Case' },
        required: false,
        options: [
          { value: 'yes', pl: 'Tak', en: 'Yes' },
          { value: 'no', pl: 'Nie', en: 'No' }
        ],
        conditional: { field: 'subcategory', values: ['glasses', 'watch'] }
      },
      {
        id: 'engraving',
        type: 'textarea',
        label: { pl: 'Grawer lub napisy', en: 'Engraving or inscriptions' },
        required: false,
        placeholder: { pl: 'jeśli widoczne', en: 'if visible' }
      },
      {
        id: 'condition',
        type: 'select',
        label: { pl: 'Stan', en: 'Condition' },
        required: true,
        options: [
          { value: 'excellent', pl: 'Doskonały', en: 'Excellent' },
          { value: 'good', pl: 'Dobry', en: 'Good' },
          { value: 'worn', pl: 'Zużyty', en: 'Worn' },
          { value: 'damaged', pl: 'Uszkodzony', en: 'Damaged' }
        ]
      }
    ]
  }
};

// Export for use in both frontend and backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DYNAMIC_FORM_SCHEMAS };
}
