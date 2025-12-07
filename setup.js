#!/usr/bin/env node
/**
 * Automated Setup Script for Rzeczy Znalezione
 * Runs automatically on first npm install via postinstall hook
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const ENV_FILE = path.join(__dirname, '.env');
const ENV_EXAMPLE = path.join(__dirname, '.env.example');
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'rzeczy-znalezione.db');

console.log('\n🚀 Rzeczy Znalezione - Automated Setup\n');
console.log('═════════════════════════════════════════════════════════════\n');

/**
 * Step 1: Check if .env exists
 */
function setupEnvironment() {
    console.log('📝 Step 1: Environment Configuration');

    if (fs.existsSync(ENV_FILE)) {
        console.log('   ✓ .env file already exists - skipping\n');
        return false;
    }

    if (!fs.existsSync(ENV_EXAMPLE)) {
        console.error('   ✗ .env.example not found!\n');
        return false;
    }

    // Read .env.example
    let envContent = fs.readFileSync(ENV_EXAMPLE, 'utf8');

    // Generate secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    envContent = envContent.replace(
        'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production',
        `JWT_SECRET=${jwtSecret}`
    );

    // Write .env file
    fs.writeFileSync(ENV_FILE, envContent);
    console.log('   ✓ Created .env file with secure JWT secret\n');
    return true;
}

/**
 * Step 2: Create data directory
 */
function setupDataDirectory() {
    console.log('📁 Step 2: Data Directory Setup');

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('   ✓ Created data/ directory\n');
    } else {
        console.log('   ✓ data/ directory already exists\n');
    }
}

/**
 * Step 3: Initialize database
 */
function setupDatabase() {
    console.log('🗄️  Step 3: Database Initialization');

    if (fs.existsSync(DB_PATH)) {
        console.log('   ✓ Database already exists - skipping initialization\n');
        return false;
    }

    try {
        console.log('   ⏳ Initializing database with test data...');
        execSync('node server/init-db.js', {
            stdio: 'inherit',
            env: { ...process.env, FORCE_COLOR: '1' }
        });
        return true;
    } catch (error) {
        console.error('   ✗ Database initialization failed:', error.message);
        console.log('   ℹ️  You can run "npm run init-db" manually later\n');
        return false;
    }
}

/**
 * Step 4: Print setup summary
 */
function printSummary(envCreated, dbCreated) {
    console.log('\n═════════════════════════════════════════════════════════════');
    console.log('✅ Setup Complete!\n');

    if (envCreated || dbCreated) {
        console.log('📋 What was created:');
        if (envCreated) {
            console.log('   • .env file with secure configuration');
        }
        if (dbCreated) {
            console.log('   • SQLite database with test data');
            console.log('   • 3 test users (admin, official, user)');
            console.log('   • 16 sample items across Polish cities');
        }
    }

    console.log('\n🔑 Login Credentials:');
    console.log('   👑 Admin:    admin@example.com    / admin123');
    console.log('   👔 Official: official@example.com / official123');
    console.log('   👤 User:     user@example.com     / user123');

    console.log('\n🚀 Quick Start:');
    console.log('   1. npm run dev          - Start development server');
    console.log('   2. npm start            - Start production server');
    console.log('   3. npm run init-db      - Re-initialize database');

    console.log('\n📚 Documentation:');
    console.log('   • START_HERE.md         - Quick start guide');
    console.log('   • HACKNATION-README.md  - Full documentation');

    console.log('\n🌐 After starting the server:');
    console.log('   → http://localhost:3000         - Main application');
    console.log('   → http://localhost:3000/admin   - Admin panel');

    console.log('\n═════════════════════════════════════════════════════════════\n');
}

/**
 * Main setup flow
 */
function main() {
    try {
        const envCreated = setupEnvironment();
        setupDataDirectory();
        const dbCreated = setupDatabase();
        printSummary(envCreated, dbCreated);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.log('\nℹ️  Please check the error above and try manual setup:');
        console.log('   1. cp .env.example .env');
        console.log('   2. npm run init-db');
        console.log('   3. npm run dev\n');
        process.exit(1);
    }
}

// Run setup only if called directly (not during npm install in CI/CD)
const isCI = process.env.CI === 'true' || process.env.CONTINUOUS_INTEGRATION === 'true';
const isNpmInstall = process.env.npm_lifecycle_event === 'postinstall';

if (!isCI || !isNpmInstall) {
    main();
} else {
    console.log('ℹ️  CI/CD environment detected - skipping automated setup');
    console.log('   Run "npm run setup" manually to initialize the project\n');
}
