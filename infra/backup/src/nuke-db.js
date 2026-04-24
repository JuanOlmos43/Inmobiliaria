/**
 * nuke-db.js
 * ⚠️  DANGER: Deletes ALL data from the database and storage bucket.
 * Used to test the restore process.
 *
 * Usage: node src/nuke-db.js
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const { config, validate } = require('./config');

// Tables in reverse dependency order (children first)
const TABLES_REVERSE = [
    'Notification',
    'RentalContract',
    'PropertyFeature',
    'PropertyImage',
    'Property',
    'RefreshToken',
    'User',
    'Calle',
    'Localidad',
    'Provincia',
];

async function nukeDb() {
    validate('all');

    console.log('');
    console.log('⚠️  ═══════════════════════════════════════════');
    console.log('⚠️   ELIMINACIÓN TOTAL — Sistema Inmobiliaria');
    console.log('⚠️  ═══════════════════════════════════════════');
    console.log('');
    console.log('   Esto eliminará:');
    console.log('   • Todos los datos de la base de datos');
    console.log('   • Todas las imágenes del bucket de Storage');
    console.log('');
    console.log('   Esperando 5 segundos antes de continuar...');
    console.log('   (Ctrl+C para cancelar)');
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // === Step 1: Nuke database ===
    console.log('━━━ Paso 1/2: Eliminando datos de la DB ━━━\n');

    const pool = new Pool({ connectionString: config.databaseUrl });
    const client = await pool.connect();

    try {
        for (const table of TABLES_REVERSE) {
            try {
                const result = await client.query(`DELETE FROM public."${table}"`);
                console.log(`   🗑️  ${table}: ${result.rowCount} rows deleted`);
            } catch (err) {
                console.log(`   ⚠️  ${table}: ${err.message}`);
            }
        }
        console.log('\n   ✅ Base de datos vaciada');
    } finally {
        client.release();
        await pool.end();
    }

    // === Step 2: Nuke storage ===
    console.log('\n━━━ Paso 2/2: Eliminando archivos del Storage ━━━\n');

    const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

    // List all files recursively
    async function listAll(folder = '') {
        const allFiles = [];
        const { data } = await supabase.storage.from(config.bucketName).list(folder, { limit: 1000 });
        for (const item of data || []) {
            const itemPath = folder ? `${folder}/${item.name}` : item.name;
            if (item.id === null) {
                allFiles.push(...await listAll(itemPath));
            } else {
                allFiles.push(itemPath);
            }
        }
        return allFiles;
    }

    const files = await listAll();

    if (files.length > 0) {
        const { error } = await supabase.storage.from(config.bucketName).remove(files);
        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   🗑️  ${files.length} archivos eliminados del bucket`);
        }
    } else {
        console.log('   ℹ️  Bucket ya estaba vacío');
    }

    console.log('\n═══════════════════════════════════════════');
    console.log('  💀 SISTEMA COMPLETAMENTE ELIMINADO');
    console.log('');
    console.log('  Para restaurar:');
    console.log('    npm run restore');
    console.log('═══════════════════════════════════════════\n');
}

nukeDb().catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
