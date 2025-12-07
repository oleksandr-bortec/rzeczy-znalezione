/**
 * Database Initialization Script
 * Run with: npm run init-db
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const { initDatabase } = require('./database');
const db = require('./database');

console.log('Initializing database...\n');

// Create admin user
async function createAdminUser() {
    const email = process.env.ADMIN_EMAIL || 'admin@rzeczy-znalezione.gov.pl';
    const password = process.env.ADMIN_PASSWORD || 'AdminHackNation2025!';

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existing) {
        console.log(`Admin user already exists: ${email}`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    db.prepare(`
        INSERT INTO users (email, password, name, role, organization, is_active)
        VALUES (?, ?, ?, 'admin', 'System Administrator', 1)
    `).run(email, hashedPassword, 'Administrator');

    console.log(`Admin user created: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n*** CHANGE THIS PASSWORD AFTER FIRST LOGIN! ***\n');
}

// Insert sample data
function insertSampleData() {
    const count = db.prepare('SELECT COUNT(*) as count FROM items').get().count;

    if (count > 0) {
        console.log(`Database already has ${count} items. Skipping sample data.`);
        return;
    }

    const sampleItems = [
        {
            public_id: 'RZ/2024/0001',
            item_name: 'Telefon Samsung Galaxy S23',
            category: 'phone',
            description: 'Telefon Samsung Galaxy S23, kolor czarny, pekniety ekran w lewym gornym rogu, etui silikonowe niebieskie',
            date_found: '2024-01-15',
            location_found: 'Autobus linii 144, przystanek Rynek Glowny',
            location_type: 'public_transport',
            coordinates_lat: 50.0614,
            coordinates_lon: 19.9366,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 2500,
            status: 'stored',
            collection_deadline: '2026-01-15',
            office_name: 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            office_address: 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            office_phone: '+48 12 345 67 89',
            office_email: 'rzeczy.znalezione@powiat.krakow.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'RZ/2024/0002',
            item_name: 'Portfel skorzany brazowy',
            category: 'wallet',
            description: 'Portfel skorzany brazowy marki Wittchen, zawiera dokumenty (dowod osobisty, prawo jazdy). Bez gotowki.',
            date_found: '2024-01-16',
            location_found: 'Park Miejski, przy fontannie glownej',
            location_type: 'park',
            coordinates_lat: 50.0647,
            coordinates_lon: 19.9450,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 150,
            status: 'stored',
            collection_deadline: '2026-01-16',
            office_name: 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            office_address: 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            office_phone: '+48 12 345 67 89',
            office_email: 'rzeczy.znalezione@powiat.krakow.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'RZ/2024/0003',
            item_name: 'Klucze z brelokiem',
            category: 'keys',
            description: 'Pek 5 kluczy na metalowym kolku, brelok w ksztalcie misia, jeden klucz samochodowy marki Toyota',
            date_found: '2024-01-20',
            location_found: 'Galeria Krakowska, poziom -1, przy windach',
            location_type: 'shop',
            coordinates_lat: 50.0672,
            coordinates_lon: 19.9450,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 50,
            status: 'stored',
            collection_deadline: '2026-01-20',
            office_name: 'Biuro Obslugi Klienta Galeria Krakowska',
            office_address: 'ul. Pawia 5, 31-154 Krakow',
            office_phone: '+48 12 428 99 00',
            office_email: 'info@galeriakrakowska.pl',
            office_hours: 'Codziennie: 10:00-21:00'
        },
        {
            public_id: 'RZ/2024/0004',
            item_name: 'Laptop Dell Latitude',
            category: 'electronics',
            description: 'Laptop Dell Latitude 5520, kolor srebrny, 15.6 cala, w czarnej torbie na laptopa. Nakleka z logo firmy IT.',
            date_found: '2024-02-01',
            location_found: 'Pociag IC 1234 Krakow-Warszawa, wagon 5',
            location_type: 'public_transport',
            coordinates_lat: 50.0674,
            coordinates_lon: 19.9477,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 3500,
            status: 'returned',
            collection_deadline: '2026-02-01',
            office_name: 'PKP Intercity - Biuro Rzeczy Znalezionych',
            office_address: 'Dworzec Glowny, ul. Bosacka 18, 31-505 Krakow',
            office_phone: '+48 703 200 200',
            office_email: 'rzeczy.znalezione@intercity.pl',
            office_hours: 'Codziennie: 6:00-22:00'
        },
        {
            public_id: 'WA/2024/0101',
            item_name: 'iPhone 15 Pro Max',
            category: 'phone',
            description: 'iPhone 15 Pro Max, kolor tytanowy naturalny, 256GB, etui skorzane brazowe Apple',
            date_found: '2024-02-20',
            location_found: 'Metro Centrum, przy kasach biletowych',
            location_type: 'public_transport',
            coordinates_lat: 52.2297,
            coordinates_lon: 21.0122,
            municipality: 'Warszawa',
            county: 'Warszawa',
            voivodeship: 'mazowieckie',
            estimated_value: 6500,
            status: 'stored',
            collection_deadline: '2026-02-20',
            office_name: 'Biuro Rzeczy Znalezionych m.st. Warszawy',
            office_address: 'ul. Ciolka 11a, 01-445 Warszawa',
            office_phone: '+48 22 443 10 00',
            office_email: 'rzeczy.znalezione@um.warszawa.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'WA/2024/0102',
            item_name: 'Torba podrozna Samsonite',
            category: 'other',
            description: 'Torba podrozna Samsonite, kolor granatowy, na kolkach, zawiera ubrania meskie i kosmetyczke',
            date_found: '2024-02-22',
            location_found: 'Lotnisko Chopina, Terminal A, przy stanowisku odprawy',
            location_type: 'public_transport',
            coordinates_lat: 52.1657,
            coordinates_lon: 20.9671,
            municipality: 'Warszawa',
            county: 'Warszawa',
            voivodeship: 'mazowieckie',
            estimated_value: 1200,
            status: 'stored',
            collection_deadline: '2026-02-22',
            office_name: 'Biuro Rzeczy Znalezionych Lotnisko Chopina',
            office_address: 'ul. Zwirki i Wigury 1, 00-906 Warszawa',
            office_phone: '+48 22 650 42 20',
            office_email: 'lost.found@lotnisko-chopina.pl',
            office_hours: 'Codziennie: 6:00-22:00'
        },
        {
            public_id: 'GD/2024/0050',
            item_name: 'Rower miejski Romet',
            category: 'bicycle',
            description: 'Rower miejski Romet Gazela, kolor czerwony, 28 cali, koszyk przedni, dzwonek srebrny',
            date_found: '2024-03-01',
            location_found: 'Ul. Dluga, przy Ratuszu Glownego Miasta',
            location_type: 'street',
            coordinates_lat: 54.3520,
            coordinates_lon: 18.6466,
            municipality: 'Gdansk',
            county: 'Gdansk',
            voivodeship: 'pomorskie',
            estimated_value: 900,
            status: 'stored',
            collection_deadline: '2026-03-01',
            office_name: 'Straz Miejska Gdansk - Biuro Rzeczy Znalezionych',
            office_address: 'ul. Lastadia 2, 80-880 Gdansk',
            office_phone: '+48 58 301 30 11',
            office_email: 'rzeczy@strazmiejska.gda.pl',
            office_hours: 'Pon-Pt: 8:00-15:00'
        },
        {
            public_id: 'PO/2024/0025',
            item_name: 'Zegarek Casio G-Shock',
            category: 'jewelry',
            description: 'Zegarek Casio G-Shock GA-2100, kolor czarny, pasek gumowy, sprawny',
            date_found: '2024-03-10',
            location_found: 'Stadion Miejski, sektor A, rzad 15',
            location_type: 'other',
            coordinates_lat: 52.4064,
            coordinates_lon: 16.8418,
            municipality: 'Poznan',
            county: 'Poznan',
            voivodeship: 'wielkopolskie',
            estimated_value: 400,
            status: 'stored',
            collection_deadline: '2026-03-10',
            office_name: 'Biuro Rzeczy Znalezionych UM Poznan',
            office_address: 'ul. Libelta 16/20, 61-706 Poznan',
            office_phone: '+48 61 878 56 78',
            office_email: 'brz@um.poznan.pl',
            office_hours: 'Pon-Pt: 7:30-15:30'
        }
    ];

    const insertStmt = db.prepare(`
        INSERT INTO items (
            public_id, item_name, category, description,
            date_found, location_found, location_type,
            coordinates_lat, coordinates_lon,
            municipality, county, voivodeship,
            estimated_value, status, collection_deadline,
            office_name, office_address, office_phone, office_email, office_hours
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of sampleItems) {
        insertStmt.run(
            item.public_id, item.item_name, item.category, item.description,
            item.date_found, item.location_found, item.location_type,
            item.coordinates_lat, item.coordinates_lon,
            item.municipality, item.county, item.voivodeship,
            item.estimated_value, item.status, item.collection_deadline,
            item.office_name, item.office_address, item.office_phone, item.office_email, item.office_hours
        );
    }

    console.log(`Inserted ${sampleItems.length} sample items.`);
}

// Main
async function main() {
    try {
        // Initialize database first
        await initDatabase();

        await createAdminUser();
        insertSampleData();

        console.log('\nDatabase initialization complete!');
        console.log('\nTo start the server, run: npm start');

        // Save and exit
        const { saveDatabase } = require('./database');
        saveDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}

main();
