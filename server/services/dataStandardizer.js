/**
 * KILLER FEATURE #4: AUTOMATYCZNA STANDARYZACJA DANYCH
 * Data standardization service for consistent data quality
 * Handles: spelling, addresses, dates, brands, capitalization
 */

/**
 * Polish brand name mappings for electronics
 */
const BRAND_MAPPINGS = {
    // Phones
    'samsung': 'Samsung',
    'apple': 'Apple',
    'iphone': 'Apple',
    'xiaomi': 'Xiaomi',
    'redmi': 'Xiaomi',
    'huawei': 'Huawei',
    'honor': 'Honor',
    'oneplus': 'OnePlus',
    'google': 'Google',
    'pixel': 'Google',
    'motorola': 'Motorola',
    'moto': 'Motorola',
    'nokia': 'Nokia',
    'lg': 'LG',
    'sony': 'Sony',
    'oppo': 'Oppo',
    'realme': 'Realme',
    'vivo': 'Vivo',
    'asus': 'Asus',

    // Laptops
    'lenovo': 'Lenovo',
    'hp': 'HP',
    'dell': 'Dell',
    'acer': 'Acer',
    'msi': 'MSI',
    'macbook': 'Apple',

    // Cars
    'audi': 'Audi',
    'bmw': 'BMW',
    'citroen': 'Citroën',
    'fiat': 'Fiat',
    'ford': 'Ford',
    'honda': 'Honda',
    'hyundai': 'Hyundai',
    'kia': 'Kia',
    'mazda': 'Mazda',
    'mercedes': 'Mercedes-Benz',
    'nissan': 'Nissan',
    'opel': 'Opel',
    'peugeot': 'Peugeot',
    'renault': 'Renault',
    'seat': 'Seat',
    'skoda': 'Škoda',
    'toyota': 'Toyota',
    'volkswagen': 'Volkswagen',
    'vw': 'Volkswagen',
    'volvo': 'Volvo'
};

/**
 * Common Polish typos and their corrections
 */
const SPELLING_CORRECTIONS = {
    // Colors
    'czrny': 'czarny',
    'czarny': 'czarny',
    'bialy': 'biały',
    'biały': 'biały',
    'szary': 'szary',
    'szry': 'szary',
    'czerwony': 'czerwony',
    'cerwony': 'czerwony',
    'niebieski': 'niebieski',
    'nibieski': 'niebieski',
    'zielony': 'zielony',
    'zielny': 'zielony',

    // Common words
    'telefon': 'telefon',
    'tlefon': 'telefon',
    'komurka': 'komórka',
    'komórka': 'komórka',
    'portfel': 'portfel',
    'portfiel': 'portfel',
    'dokumenty': 'dokumenty',
    'dokumnty': 'dokumenty',
    'dowod': 'dowód',
    'dowód': 'dowód',

    // Places
    'dworzec': 'dworzec',
    'dworzeć': 'dworzec',
    'przystanek': 'przystanek',
    'przymstanek': 'przystanek',
    'sklep': 'sklep',
    'sklęp': 'sklep'
};

/**
 * Polish voivodeship names standardization
 */
const VOIVODESHIP_MAPPINGS = {
    'dolnoslaskie': 'dolnoslaskie',
    'dolnośląskie': 'dolnoslaskie',
    'dolnoslask': 'dolnoslaskie',
    'kujawsko-pomorskie': 'kujawsko-pomorskie',
    'kujawsko pomorskie': 'kujawsko-pomorskie',
    'lubelskie': 'lubelskie',
    'lubuskie': 'lubuskie',
    'lodzkie': 'lodzkie',
    'łódzkie': 'lodzkie',
    'malopolskie': 'malopolskie',
    'małopolskie': 'malopolskie',
    'mazowieckie': 'mazowieckie',
    'opolskie': 'opolskie',
    'podkarpackie': 'podkarpackie',
    'podlaskie': 'podlaskie',
    'pomorskie': 'pomorskie',
    'slaskie': 'slaskie',
    'śląskie': 'slaskie',
    'swietokrzyskie': 'swietokrzyskie',
    'świętokrzyskie': 'swietokrzyskie',
    'warminsko-mazurskie': 'warminsko-mazurskie',
    'warmińsko-mazurskie': 'warminsko-mazurskie',
    'wielkopolskie': 'wielkopolskie',
    'zachodniopomorskie': 'zachodniopomorskie',
    'zachodnio-pomorskie': 'zachodniopomorskie'
};

/**
 * Standardize text by fixing spelling errors
 */
function standardizeSpelling(text) {
    if (!text) return text;

    let standardized = text.toLowerCase();

    // Apply spelling corrections
    for (const [typo, correct] of Object.entries(SPELLING_CORRECTIONS)) {
        const regex = new RegExp('\\b' + typo + '\\b', 'gi');
        standardized = standardized.replace(regex, correct);
    }

    return standardized;
}

/**
 * Standardize brand names
 */
function standardizeBrand(brandInput) {
    if (!brandInput) return brandInput;

    const normalized = brandInput.toLowerCase().trim();

    // Check exact match
    if (BRAND_MAPPINGS[normalized]) {
        return BRAND_MAPPINGS[normalized];
    }

    // Check if brand name is contained in input
    for (const [key, value] of Object.entries(BRAND_MAPPINGS)) {
        if (normalized.includes(key)) {
            return value;
        }
    }

    // Return capitalized input if no match
    return brandInput.charAt(0).toUpperCase() + brandInput.slice(1);
}

/**
 * Standardize capitalization (Polish title case)
 */
function standardizeCapitalization(text) {
    if (!text) return text;

    // List of Polish words that should remain lowercase in titles
    const lowercaseWords = ['i', 'w', 'z', 'na', 'do', 'od', 'po', 'dla', 'o', 'u', 'we', 'ze'];

    const words = text.toLowerCase().split(' ');
    const capitalized = words.map((word, index) => {
        // Always capitalize first word
        if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        // Keep lowercase words lowercase
        if (lowercaseWords.includes(word)) {
            return word;
        }

        // Capitalize other words
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalized.join(' ');
}

/**
 * Standardize voivodeship name
 */
function standardizeVoivodeship(voivodeship) {
    if (!voivodeship) return voivodeship;

    const normalized = voivodeship.toLowerCase().trim();

    // Try local mapping first
    let standardized = VOIVODESHIP_MAPPINGS[normalized];
    if (standardized) return standardized;

    // Try TERYT integration if available
    try {
        const terytService = require('./terytService');
        standardized = terytService.standardizeWojewodztwo(voivodeship);
        if (standardized) return standardized;
    } catch (e) {
        // TERYT service not available, continue
    }

    return voivodeship;
}

/**
 * Parse and standardize date
 */
function standardizeDate(dateInput) {
    if (!dateInput) return null;

    // If already ISO format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
    }

    // Handle Polish relative dates
    const relativeMap = {
        'dzis': 0,
        'dziś': 0,
        'wczoraj': 1,
        'przedwczoraj': 2
    };

    const normalized = dateInput.toLowerCase().trim();
    if (relativeMap[normalized] !== undefined) {
        const date = new Date();
        date.setDate(date.getDate() - relativeMap[normalized]);
        return date.toISOString().split('T')[0];
    }

    // Try to parse various formats
    try {
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    } catch (e) {
        // Invalid date
    }

    return dateInput; // Return original if can't parse
}

/**
 * Standardize location/address
 * Basic standardization before TERYT lookup
 */
function standardizeLocation(location) {
    if (!location) return location;

    let standardized = location.trim();

    // Standardize street prefixes
    const streetPrefixes = {
        'ul.': 'ul.',
        'ul ': 'ul. ',
        'ulica': 'ul.',
        'aleja': 'al.',
        'al.': 'al.',
        'al ': 'al. ',
        'plac': 'pl.',
        'pl.': 'pl.',
        'pl ': 'pl. '
    };

    for (const [variant, standard] of Object.entries(streetPrefixes)) {
        const regex = new RegExp('^' + variant.replace('.', '\\.'), 'i');
        standardized = standardized.replace(regex, standard);
    }

    // Capitalize properly
    standardized = standardizeCapitalization(standardized);

    return standardized;
}

/**
 * Standardize color names
 */
function standardizeColor(color) {
    if (!color) return color;

    const colorMap = {
        'czarny': 'Czarny',
        'czrny': 'Czarny',
        'black': 'Czarny',
        'biały': 'Biały',
        'bialy': 'Biały',
        'white': 'Biały',
        'szary': 'Szary',
        'szry': 'Szary',
        'gray': 'Szary',
        'grey': 'Szary',
        'niebieski': 'Niebieski',
        'nibieski': 'Niebieski',
        'blue': 'Niebieski',
        'czerwony': 'Czerwony',
        'cerwony': 'Czerwony',
        'red': 'Czerwony',
        'zielony': 'Zielony',
        'zielny': 'Zielony',
        'green': 'Zielony',
        'żółty': 'Żółty',
        'zolty': 'Żółty',
        'yellow': 'Żółty',
        'różowy': 'Różowy',
        'rozowy': 'Różowy',
        'pink': 'Różowy',
        'fioletowy': 'Fioletowy',
        'purple': 'Fioletowy',
        'brązowy': 'Brązowy',
        'brazowy': 'Brązowy',
        'brown': 'Brązowy',
        'srebrny': 'Srebrny',
        'silver': 'Srebrny',
        'złoty': 'Złoty',
        'zloty': 'Złoty',
        'gold': 'Złoty'
    };

    const normalized = color.toLowerCase().trim();
    return colorMap[normalized] || standardizeCapitalization(color);
}

/**
 * Main standardization function for item data
 */
function standardizeItemData(data) {
    const standardized = { ...data };

    // Standardize text fields
    if (standardized.item_name) {
        standardized.item_name = standardizeCapitalization(
            standardizeSpelling(standardized.item_name)
        );
    }

    if (standardized.description) {
        // Apply spelling corrections to description
        standardized.description = standardizeSpelling(standardized.description);
    }

    // Standardize location
    if (standardized.location_found) {
        standardized.location_found = standardizeLocation(standardized.location_found);
    }

    // TERYT Integration: Standardize territorial divisions
    try {
        const terytService = require('./terytService');

        if (standardized.voivodeship) {
            standardized.voivodeship = terytService.standardizeWojewodztwo(standardized.voivodeship);
        }

        if (standardized.county && standardized.voivodeship) {
            const standardizedPowiat = terytService.standardizePowiat(standardized.county, standardized.voivodeship);
            if (standardizedPowiat) {
                standardized.county = standardizedPowiat;
            } else {
                standardized.county = standardizeCapitalization(standardized.county);
            }
        }

        if (standardized.municipality && standardized.county && standardized.voivodeship) {
            const standardizedGmina = terytService.standardizeGmina(
                standardized.municipality,
                standardized.county,
                standardized.voivodeship
            );
            if (standardizedGmina) {
                standardized.municipality = standardizedGmina;
            } else {
                standardized.municipality = standardizeCapitalization(standardized.municipality);
            }
        }
    } catch (e) {
        // Fallback to basic capitalization if TERYT not available
        if (standardized.municipality) {
            standardized.municipality = standardizeCapitalization(standardized.municipality);
        }
        if (standardized.county) {
            standardized.county = standardizeCapitalization(standardized.county);
        }
        if (standardized.voivodeship) {
            standardized.voivodeship = standardizeVoivodeship(standardized.voivodeship);
        }
    }

    // Standardize dates
    if (standardized.date_found) {
        standardized.date_found = standardizeDate(standardized.date_found);
    }

    // Standardize custom fields
    if (standardized.custom_fields) {
        const customFields = typeof standardized.custom_fields === 'string'
            ? JSON.parse(standardized.custom_fields)
            : standardized.custom_fields;

        // Standardize brand
        if (customFields.brand) {
            customFields.brand = standardizeBrand(customFields.brand);
        }

        // Standardize color
        if (customFields.color) {
            customFields.color = standardizeColor(customFields.color);
        }

        // Standardize watch brand
        if (customFields.watch_brand) {
            customFields.watch_brand = standardizeBrand(customFields.watch_brand);
        }

        // Standardize car brand
        if (customFields.car_brand) {
            customFields.car_brand = standardizeBrand(customFields.car_brand);
        }

        standardized.custom_fields = customFields;
    }

    return standardized;
}

module.exports = {
    standardizeItemData,
    standardizeSpelling,
    standardizeBrand,
    standardizeCapitalization,
    standardizeVoivodeship,
    standardizeDate,
    standardizeLocation,
    standardizeColor
};
