/**
 * restore-all.js
 * Orchestrates a full system restore: Database + Storage.
 *
 * Order matters:
 *   1. DB first (because images reference DB records)
 *   2. Storage second
 *
 * Usage:
 *   node src/restore-all.js                         # Uses most recent backup
 *   node src/restore-all.js 2026-02-17_153000       # Uses specific backup
 */
const { restoreDb } = require('./restore-db');
const { restoreStorage } = require('./restore-storage');

async function restoreAll() {
    const backupTimestamp = process.argv[2] || null;

    console.log('═══════════════════════════════════════════');
    console.log('  RESTORE COMPLETO — Sistema Inmobiliaria');
    console.log('═══════════════════════════════════════════');

    if (backupTimestamp) {
        console.log(`  📅 Backup seleccionado: ${backupTimestamp}`);
    } else {
        console.log('  📅 Usando backup más reciente');
    }
    console.log('');

    const startTime = Date.now();

    // Step 1: Restore database (FIRST — images reference DB records)
    console.log('━━━ Paso 1/2: Base de datos ━━━\n');
    await restoreDb(backupTimestamp);

    console.log('');

    // Step 2: Restore storage
    console.log('━━━ Paso 2/2: Storage (imágenes) ━━━\n');
    await restoreStorage(backupTimestamp);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n═══════════════════════════════════════════');
    console.log('  ✅ RESTORE COMPLETO EXITOSO');
    console.log(`  ⏱️  Tiempo: ${elapsed}s`);
    console.log('');
    console.log('  Verificación recomendada:');
    console.log('    1. Iniciar el backend: cd backend && npm run start:dev');
    console.log('    2. Iniciar el frontend: cd frontend && npm run dev');
    console.log('    3. Verificar: login, propiedades visibles, imágenes cargan');
    console.log('═══════════════════════════════════════════\n');
}

restoreAll().catch((err) => {
    console.error('\n❌ RESTORE FAILED:', err.message);
    process.exit(1);
});
