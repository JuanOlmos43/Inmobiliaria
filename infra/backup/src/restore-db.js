/**
 * restore-db.js
 * Restores the PostgreSQL database from a JSON backup.
 *
 * Strategy:
 *   1. Run Prisma migrate deploy to recreate the schema
 *   2. Clear existing data (in reverse dependency order)
 *   3. Insert data from JSON files (in dependency order)
 *   4. Reset sequences
 *
 * Usage:
 *   node src/restore-db.js                         # Uses most recent backup
 *   node src/restore-db.js 2026-02-17_153000       # Uses specific backup
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { execSync } = require('child_process');
const { config, validate } = require('./config');

// Tables in dependency order (parents first)
const TABLES = [
    'Provincia',
    'Localidad',
    'Calle',
    'User',
    'RefreshToken',
    'Property',
    'PropertyImage',
    'PropertyFeature',
    'RentalContract',
];

// Reverse order for deletion (children first)
const TABLES_REVERSE = [...TABLES].reverse();

/**
 * Finds the most recent backup directory.
 */
function findLatestBackup() {
    const dbBackupDir = path.join(config.backupDir, 'db');
    if (!fs.existsSync(dbBackupDir)) {
        console.error('❌ No database backups found in', dbBackupDir);
        process.exit(1);
    }

    const dirs = fs.readdirSync(dbBackupDir)
        .filter((d) => fs.statSync(path.join(dbBackupDir, d)).isDirectory())
        .sort()
        .reverse();

    if (dirs.length === 0) {
        console.error('❌ No database backups found in', dbBackupDir);
        process.exit(1);
    }

    return path.join(dbBackupDir, dirs[0]);
}

/**
 * Runs Prisma migrate deploy to ensure schema is up to date.
 */
function runPrismaMigrate() {
    console.log('   Running prisma migrate deploy...');
    try {
        const backendDir = path.resolve(__dirname, '..', '..', '..', 'backend');
        execSync('npx prisma migrate deploy', {
            cwd: backendDir,
            stdio: 'pipe',
            env: { ...process.env, DATABASE_URL: config.databaseUrl },
        });
        console.log('   ✅ Schema migrations applied successfully');
    } catch (err) {
        console.error('   ❌ Prisma migrate failed:', err.stderr?.toString() || err.message);
        throw new Error('Schema migration failed');
    }
}

/**
 * Escapes a value for a PostgreSQL literal.
 */
function escapeValue(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'number') return String(val);
    if (val instanceof Date || (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val))) {
        return `'${String(val).replace(/'/g, "''")}'`;
    }
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
}

async function restoreDb(backupTimestamp) {
    validate('db');

    // Determine backup path
    let backupPath;
    if (backupTimestamp) {
        backupPath = path.join(config.backupDir, 'db', backupTimestamp);
        if (!fs.existsSync(backupPath)) {
            console.error(`❌ Backup not found: ${backupPath}`);
            process.exit(1);
        }
    } else {
        backupPath = findLatestBackup();
    }

    console.log('🗄️  Starting database restore...');
    console.log(`   Source: ${backupPath}`);

    // Step 1: Run Prisma migrations
    console.log('\n   ━━━ Step 1: Schema migrations ━━━');
    runPrismaMigrate();

    // Step 2: Connect and clear data
    const pool = new Pool({ connectionString: config.databaseUrl });
    const client = await pool.connect();

    try {
        // Step 2: Clear existing data (reverse order)
        console.log('\n   ━━━ Step 2: Clearing existing data ━━━');
        for (const table of TABLES_REVERSE) {
            try {
                await client.query(`DELETE FROM public."${table}"`);
                console.log(`   🗑️  ${table}: cleared`);
            } catch (err) {
                console.log(`   ⚠️  ${table}: skip clear (${err.message})`);
            }
        }

        // Step 3: Insert data (dependency order)
        console.log('\n   ━━━ Step 3: Restoring data ━━━');
        for (const table of TABLES) {
            const filePath = path.join(backupPath, `${table}.json`);
            if (!fs.existsSync(filePath)) {
                console.log(`   ⚠️  ${table}: no backup file found, skipping`);
                continue;
            }

            const rows = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (rows.length === 0) {
                console.log(`   ℹ️  ${table}: 0 rows (empty)`);
                continue;
            }

            const columns = Object.keys(rows[0]);
            const columnList = columns.map((c) => `"${c}"`).join(', ');

            // Insert in batches to avoid overly long queries
            const batchSize = 100;
            let inserted = 0;

            for (let i = 0; i < rows.length; i += batchSize) {
                const batch = rows.slice(i, i + batchSize);
                const valuesList = batch.map((row) => {
                    const values = columns.map((col) => escapeValue(row[col]));
                    return `(${values.join(', ')})`;
                });

                const sql = `INSERT INTO public."${table}" (${columnList}) VALUES ${valuesList.join(', ')} ON CONFLICT DO NOTHING`;
                await client.query(sql);
                inserted += batch.length;
            }

            console.log(`   ✅ ${table}: ${inserted} rows restored`);
        }

        // Step 4: Reset sequences
        console.log('\n   ━━━ Step 4: Resetting sequences ━━━');
        const seqFile = path.join(backupPath, '_sequences.json');
        if (fs.existsSync(seqFile)) {
            const sequences = JSON.parse(fs.readFileSync(seqFile, 'utf-8'));
            for (const seq of sequences) {
                if (seq.last_value) {
                    try {
                        await client.query(
                            `SELECT setval('"public"."${seq.sequencename}"', ${seq.last_value})`
                        );
                        console.log(`   ✅ ${seq.sequencename}: reset to ${seq.last_value}`);
                    } catch {
                        console.log(`   ⚠️  ${seq.sequencename}: skipped`);
                    }
                }
            }
        } else {
            console.log('   ℹ️  No sequence backup found, skipping');
        }

        console.log(`\n✅ Database restore completed from: ${backupPath}`);
        return backupPath;
    } catch (err) {
        console.error('❌ Database restore failed:', err.message);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    const arg = process.argv[2]; // Optional: specific backup timestamp
    restoreDb(arg).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { restoreDb };
