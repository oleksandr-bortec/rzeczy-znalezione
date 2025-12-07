/**
 * Database Configuration - sql.js (pure JavaScript SQLite)
 * Works on any Node.js version without native compilation
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'rzeczy-znalezione.db');

let db = null;
let SQL = null;
let isInitialized = false;

/**
 * Initialize database
 */
async function initDatabase() {
    if (isInitialized) return;

    SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('Loaded existing database from:', dbPath);
    } else {
        db = new SQL.Database();
        console.log('Created new database');
    }

    // Create tables
    createTables();

    isInitialized = true;

    // Auto-save periodically
    setInterval(saveDatabase, 30000);

    // Save on exit
    process.on('exit', saveDatabase);
    process.on('SIGINT', () => { saveDatabase(); process.exit(); });
    process.on('SIGTERM', () => { saveDatabase(); process.exit(); });

    console.log('Database initialized at:', dbPath);
}

/**
 * Save database to file
 */
function saveDatabase() {
    if (db) {
        try {
            const data = db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(dbPath, buffer);
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }
}

/**
 * Create database tables
 */
function createTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            organization TEXT,
            phone TEXT,
            is_active INTEGER DEFAULT 1,
            language TEXT DEFAULT 'pl',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Items table
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            public_id TEXT UNIQUE NOT NULL,
            item_name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            date_found TEXT NOT NULL,
            location_found TEXT NOT NULL,
            location_type TEXT,
            coordinates_lat REAL,
            coordinates_lon REAL,
            municipality TEXT NOT NULL,
            county TEXT NOT NULL,
            voivodeship TEXT NOT NULL,
            estimated_value REAL,
            status TEXT DEFAULT 'stored',
            collection_deadline TEXT,
            office_name TEXT NOT NULL,
            office_address TEXT NOT NULL,
            office_phone TEXT NOT NULL,
            office_email TEXT,
            office_hours TEXT,
            photo_url TEXT,
            notes TEXT,
            custom_fields TEXT,
            created_by INTEGER,
            entry_date TEXT DEFAULT CURRENT_DATE,
            update_date TEXT DEFAULT CURRENT_DATE,
            synced_to_dane_gov INTEGER DEFAULT 0,
            dane_gov_dataset_id TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);

    // KILLER FEATURE #2: Migration - Add custom_fields column if it doesn't exist
    db.run(`
        SELECT sql FROM sqlite_master WHERE type='table' AND name='items'
    `, (err, row) => {
        if (!err && row && row.sql && !row.sql.includes('custom_fields')) {
            db.run(`ALTER TABLE items ADD COLUMN custom_fields TEXT`, (alterErr) => {
                if (!alterErr) {
                    console.log('✓ Added custom_fields column to items table');
                }
            });
        }
    });

    // Audit log
    db.run(`
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT,
            old_value TEXT,
            new_value TEXT,
            ip_address TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Sessions table
    db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Stats cache
    db.run(`
        CREATE TABLE IF NOT EXISTS stats_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_items_status ON items(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_items_voivodeship ON items(voivodeship)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_items_date_found ON items(date_found)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_items_public_id ON items(public_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
}

/**
 * Database wrapper with better-sqlite3-like API
 */
class DatabaseWrapper {
    prepare(sql) {
        const self = this;
        return {
            run(...params) {
                try {
                    db.run(sql, params);
                    saveDatabase();
                    const lastId = db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] || 0;
                    return { changes: db.getRowsModified(), lastInsertRowid: lastId };
                } catch (error) {
                    console.error('SQL Error:', error);
                    throw error;
                }
            },
            get(...params) {
                try {
                    const stmt = db.prepare(sql);
                    stmt.bind(params);
                    if (stmt.step()) {
                        const row = stmt.getAsObject();
                        stmt.free();
                        return row;
                    }
                    stmt.free();
                    return undefined;
                } catch (error) {
                    console.error('SQL Error:', error);
                    throw error;
                }
            },
            all(...params) {
                try {
                    const results = [];
                    const stmt = db.prepare(sql);
                    stmt.bind(params);
                    while (stmt.step()) {
                        results.push(stmt.getAsObject());
                    }
                    stmt.free();
                    return results;
                } catch (error) {
                    console.error('SQL Error:', error);
                    throw error;
                }
            }
        };
    }

    exec(sql) {
        db.run(sql);
        saveDatabase();
    }

    pragma(value) {
        // sql.js doesn't support pragma in the same way
        console.log('Pragma:', value);
    }

    close() {
        saveDatabase();
        if (db) db.close();
    }
}

// Create wrapper instance
const dbWrapper = new DatabaseWrapper();

// Export wrapper and init function
module.exports = dbWrapper;
module.exports.initDatabase = initDatabase;
module.exports.saveDatabase = saveDatabase;
