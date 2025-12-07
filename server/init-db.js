/**
 * Database Initialization Script
 * Run with: npm run init-db
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const { initDatabase } = require('./database');
const db = require('./database');

console.log('Initializing database...\n');

// Create test users for HackNation demo
async function createTestUsers() {
    const testUsers = [
        {
            email: 'admin@example.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            organization: 'System Administrator'
        },
        {
            email: 'official@example.com',
            password: 'official123',
            name: 'Official User',
            role: 'official',
            organization: 'Urząd Miasta Krakowa'
        },
        {
            email: 'user@example.com',
            password: 'user123',
            name: 'Regular User',
            role: 'user',
            organization: null
        }
    ];

    console.log('Creating test users...\n');

    for (const user of testUsers) {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);

        if (existing) {
            console.log(`✓ User already exists: ${user.email}`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 12);

        db.prepare(`
            INSERT INTO users (email, password, name, role, organization, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `).run(user.email, hashedPassword, user.name, user.role, user.organization);

        console.log(`✓ Created ${user.role}: ${user.email} / ${user.password}`);
    }

    console.log('\n✅ All test users created!\n');
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
        },
        {
            public_id: 'WR/2024/0030',
            item_name: 'Plecak szkolny Nike',
            category: 'other',
            description: 'Plecak szkolny Nike, kolor czarno-zielony, zawiera zeszyty, piórnik i kalkulator',
            date_found: '2024-03-15',
            location_found: 'Tramwaj linia 10, przystanek Plac Grunwaldzki',
            location_type: 'public_transport',
            coordinates_lat: 51.1079,
            coordinates_lon: 17.0385,
            municipality: 'Wroclaw',
            county: 'Wroclaw',
            voivodeship: 'dolnoslaskie',
            estimated_value: 250,
            status: 'stored',
            collection_deadline: '2026-03-15',
            office_name: 'MPK Wroclaw - Biuro Rzeczy Znalezionych',
            office_address: 'ul. Grabiszynska 105, 53-503 Wroclaw',
            office_phone: '+48 71 700 44 44',
            office_email: 'rzeczy.znalezione@mpk.wroc.pl',
            office_hours: 'Pon-Pt: 7:00-15:00'
        },
        {
            public_id: 'KA/2024/0015',
            item_name: 'Parasol automatyczny',
            category: 'other',
            description: 'Parasol automatyczny, kolor bordowy, marki Doppler, drewniana raczka',
            date_found: '2024-03-20',
            location_found: 'Park Zadole, przy glownej alei',
            location_type: 'park',
            coordinates_lat: 50.2649,
            coordinates_lon: 19.0238,
            municipality: 'Katowice',
            county: 'Katowice',
            voivodeship: 'slaskie',
            estimated_value: 80,
            status: 'stored',
            collection_deadline: '2026-03-20',
            office_name: 'Biuro Rzeczy Znalezionych UM Katowice',
            office_address: 'ul. Młynska 4, 40-098 Katowice',
            office_phone: '+48 32 259 39 39',
            office_email: 'brz@katowice.eu',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'LU/2024/0008',
            item_name: 'Okulary sloneczne Ray-Ban',
            category: 'other',
            description: 'Okulary sloneczne Ray-Ban Aviator, zlote oprawki, szkla ciemnobrązowe, w czarnym etui',
            date_found: '2024-04-01',
            location_found: 'Cafe Literacka, przy stoliku przy oknie',
            location_type: 'cafe',
            coordinates_lat: 51.2465,
            coordinates_lon: 22.5684,
            municipality: 'Lublin',
            county: 'Lublin',
            voivodeship: 'lubelskie',
            estimated_value: 600,
            status: 'stored',
            collection_deadline: '2026-04-01',
            office_name: 'Biuro Rzeczy Znalezionych Lublin',
            office_address: 'ul. Wieniawska 14, 20-071 Lublin',
            office_phone: '+48 81 466 36 36',
            office_email: 'rzeczy@lublin.eu',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'SZ/2024/0012',
            item_name: 'Tablet Samsung Galaxy Tab',
            category: 'electronics',
            description: 'Tablet Samsung Galaxy Tab S8, kolor granatowy, 11 cali, z klawiatura bezprzewodowa w komplecie',
            date_found: '2024-04-05',
            location_found: 'Biblioteka Uniwersytecka, czytelnia glowna, stanowisko nr 23',
            location_type: 'other',
            coordinates_lat: 53.4285,
            coordinates_lon: 14.5528,
            municipality: 'Szczecin',
            county: 'Szczecin',
            voivodeship: 'zachodniopomorskie',
            estimated_value: 2200,
            status: 'stored',
            collection_deadline: '2026-04-05',
            office_name: 'Straz Miejska Szczecin',
            office_address: 'ul. Potulicka 23, 70-329 Szczecin',
            office_phone: '+48 91 424 55 55',
            office_email: 'strazmiejska@um.szczecin.pl',
            office_hours: 'Pon-Pt: 7:00-15:00'
        },
        {
            public_id: 'BI/2024/0020',
            item_name: 'Naszyjnik zloty z zawieszka',
            category: 'jewelry',
            description: 'Naszyjnik zloty, prob 585, zawieszka w ksztalcie serca z inicjalami "A&M", delikatny lancuszek',
            date_found: '2024-04-10',
            location_found: 'Basen Aqua Park, szatnia damska nr 45',
            location_type: 'other',
            coordinates_lat: 53.1235,
            coordinates_lon: 23.1688,
            municipality: 'Bialystok',
            county: 'Bialystok',
            voivodeship: 'podlaskie',
            estimated_value: 1500,
            status: 'stored',
            collection_deadline: '2026-04-10',
            office_name: 'Biuro Rzeczy Znalezionych Bialystok',
            office_address: 'ul. Slowackiego 3A, 15-950 Bialystok',
            office_phone: '+48 85 869 61 00',
            office_email: 'brz@um.bialystok.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'RZ/2024/0005',
            item_name: 'Dokumenty - Dowod Osobisty',
            category: 'documents',
            description: 'Dowod osobisty na nazwisko Kowalski Jan, seria ABC123456',
            date_found: '2024-04-12',
            location_found: 'Urząd Miasta, hol glowny przy recepcji',
            location_type: 'office',
            coordinates_lat: 50.0413,
            coordinates_lon: 19.9381,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 0,
            status: 'stored',
            collection_deadline: '2026-04-12',
            office_name: 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            office_address: 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            office_phone: '+48 12 345 67 89',
            office_email: 'rzeczy.znalezione@powiat.krakow.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
        },
        {
            public_id: 'RZ/2024/0006',
            item_name: 'Kurtka damska zimowa',
            category: 'clothing',
            description: 'Kurtka damska zimowa marki Columbia, kolor czarny, rozmiar M, kaptur z futerkiem',
            date_found: '2024-04-15',
            location_found: 'Restauracja Pod Wawelem, przy stoliku nr 8',
            location_type: 'restaurant',
            coordinates_lat: 50.0543,
            coordinates_lon: 19.9350,
            municipality: 'Krakow',
            county: 'Krakow',
            voivodeship: 'malopolskie',
            estimated_value: 450,
            status: 'liquidated',
            collection_deadline: '2026-04-15',
            office_name: 'Biuro Rzeczy Znalezionych Starostwa Powiatowego',
            office_address: 'ul. Glowna 1, pok. 101, 31-000 Krakow',
            office_phone: '+48 12 345 67 89',
            office_email: 'rzeczy.znalezione@powiat.krakow.pl',
            office_hours: 'Pon-Pt: 8:00-16:00'
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

    let insertedCount = 0;
    for (const item of sampleItems) {
        try {
            insertStmt.run(
                item.public_id, item.item_name, item.category, item.description,
                item.date_found, item.location_found, item.location_type,
                item.coordinates_lat, item.coordinates_lon,
                item.municipality, item.county, item.voivodeship,
                item.estimated_value, item.status, item.collection_deadline,
                item.office_name, item.office_address, item.office_phone, item.office_email, item.office_hours
            );
            insertedCount++;
            console.log(`✓ Inserted: ${item.public_id} - ${item.item_name}`);
        } catch (error) {
            console.error(`✗ Failed to insert ${item.public_id}:`, error.message);
        }
    }

    console.log(`\nInserted ${insertedCount} of ${sampleItems.length} sample items.`);
}

// Main
async function main() {
    try {
        // Initialize database first
        await initDatabase();

        await createTestUsers();
        insertSampleData();

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('✅ Database initialization complete!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('\n🔑 Login Credentials:');
        console.log('   👑 Admin:    admin@example.com    / admin123');
        console.log('   👔 Official: official@example.com / official123');
        console.log('   👤 User:     user@example.com     / user123');
        console.log('\n🚀 To start the server, run: npm run dev');
        console.log('═══════════════════════════════════════════════════════\n');

        // Save and exit
        const { saveDatabase } = require('./database');
        saveDatabase();
        process.exit(0);
    } catch (error) {
        console.error('❌ Initialization error:', error);
        process.exit(1);
    }
}

main();
