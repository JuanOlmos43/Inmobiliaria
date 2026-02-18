/**
 * cleanup.js
 * Enforces the backup retention policy.
 * Keeps only the N most recent backups (configurable via RETENTION_COUNT).
 *
 * Usage: node src/cleanup.js
 */
const fs = require('fs');
const path = require('path');
const { config, validate } = require('./config');

/**
 * Removes old backups from a subdirectory, keeping only the N most recent.
 */
function cleanupDir(subDir) {
    const targetDir = path.join(config.backupDir, subDir);

    if (!fs.existsSync(targetDir)) {
        console.log(`   ℹ️  ${subDir}/: no backups found`);
        return 0;
    }

    const entries = fs.readdirSync(targetDir)
        .filter((d) => {
            const fullPath = path.join(targetDir, d);
            return fs.statSync(fullPath).isDirectory() || d.endsWith('.dump');
        })
        .sort()
        .reverse(); // Most recent first

    if (entries.length <= config.retentionCount) {
        console.log(`   ✅ ${subDir}/: ${entries.length} backups (within limit of ${config.retentionCount})`);
        return 0;
    }

    const toDelete = entries.slice(config.retentionCount);
    let deleted = 0;

    for (const entry of toDelete) {
        const fullPath = path.join(targetDir, entry);
        try {
            if (fs.statSync(fullPath).isDirectory()) {
                fs.rmSync(fullPath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(fullPath);
            }
            deleted++;
            console.log(`   🗑️  Deleted: ${subDir}/${entry}`);
        } catch (err) {
            console.log(`   ⚠️  Failed to delete ${subDir}/${entry}: ${err.message}`);
        }
    }

    console.log(`   ✅ ${subDir}/: kept ${config.retentionCount}, deleted ${deleted}`);
    return deleted;
}

async function cleanup() {
    console.log(`🧹 Cleanup: keeping last ${config.retentionCount} backups\n`);

    const dbDeleted = cleanupDir('db');
    const storageDeleted = cleanupDir('storage');

    const total = dbDeleted + storageDeleted;
    if (total > 0) {
        console.log(`\n✅ Cleanup completed: ${total} old backups removed`);
    } else {
        console.log('\n✅ Cleanup completed: nothing to remove');
    }
}

// Run if called directly
if (require.main === module) {
    cleanup();
}

module.exports = { cleanup };
