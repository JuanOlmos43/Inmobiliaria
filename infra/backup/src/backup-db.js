/**
 * backup-db.js
 * Exports all tables from the PostgreSQL database as JSON files.
 * Each table is saved as a separate .json file inside a versioned directory.
 *
 * Usage: node src/backup-db.js
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { config, validate, timestamp } = require('./config');

// Tables in dependency order (children after parents)
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
    '_prisma_migrations',
];

async function backupDb() {
    validate('db');

    const ts = timestamp();
    const backupPath = path.join(config.backupDir, 'db', ts);
    fs.mkdirSync(backupPath, { recursive: true });

    const pool = new Pool({ connectionString: config.databaseUrl });

    try {
        console.log('🗄️  Starting database backup...');
        console.log(`   Target: ${backupPath}`);

        const client = await pool.connect();
        const metadata = { timestamp: ts, tables: {} };

        for (const table of TABLES) {
            try {
                const result = await client.query(`SELECT * FROM public."${table}"`);
                const filePath = path.join(backupPath, `${table}.json`);
                fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
                metadata.tables[table] = result.rows.length;
                console.log(`   ✅ ${table}: ${result.rows.length} rows`);
            } catch (err) {
                // Table might not exist yet (e.g., no migrations run)
                console.log(`   ⚠️  ${table}: skipped (${err.message})`);
                metadata.tables[table] = 0;
            }
        }

        // Export sequences (to restore auto-increment counters)
        try {
            const seqResult = await client.query(`
        SELECT schemaname, sequencename, last_value
        FROM pg_sequences
        WHERE schemaname = 'public'
      `);
            fs.writeFileSync(
                path.join(backupPath, '_sequences.json'),
                JSON.stringify(seqResult.rows, null, 2)
            );
            console.log(`   ✅ Sequences: ${seqResult.rows.length} exported`);
        } catch (err) {
            console.log(`   ⚠️  Sequences: skipped (${err.message})`);
        }

        // Save metadata
        fs.writeFileSync(
            path.join(backupPath, '_metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        client.release();
        console.log(`\n✅ Database backup completed: ${backupPath}`);
        return backupPath;
    } catch (err) {
        console.error('❌ Database backup failed:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    backupDb();
}

module.exports = { backupDb };
