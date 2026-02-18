/**
 * backup-all.js
 * Orchestrates a full system backup: Database + Storage.
 * Also runs cleanup to enforce retention policy.
 *
 * Usage: node src/backup-all.js
 */
const { backupDb } = require('./backup-db');
const { backupStorage } = require('./backup-storage');
const { cleanup } = require('./cleanup');

async function backupAll() {
    console.log('═══════════════════════════════════════════');
    console.log('  BACKUP COMPLETO — Sistema Inmobiliaria');
    console.log('═══════════════════════════════════════════\n');

    const startTime = Date.now();

    // Step 1: Backup database
    console.log('━━━ Paso 1/3: Base de datos ━━━\n');
    const dbPath = await backupDb();

    console.log('');

    // Step 2: Backup storage
    console.log('━━━ Paso 2/3: Storage (imágenes) ━━━\n');
    const storagePath = await backupStorage();

    console.log('');

    // Step 3: Cleanup old backups
    console.log('━━━ Paso 3/3: Limpieza de backups antiguos ━━━\n');
    await cleanup();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ BACKUP COMPLETO EXITOSO');
    console.log(`  ⏱️  Tiempo: ${elapsed}s`);
    console.log(`  🗄️  DB:      ${dbPath}`);
    console.log(`  📦 Storage: ${storagePath}`);
    console.log('═══════════════════════════════════════════\n');
}

backupAll().catch((err) => {
    console.error('\n❌ BACKUP FAILED:', err.message);
    process.exit(1);
});
