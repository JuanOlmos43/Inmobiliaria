/**
 * restore-storage.js
 * Restores files to the Supabase Storage bucket from a local backup.
 *
 * Strategy:
 *   1. Ensure the bucket exists (create if needed)
 *   2. Upload all files from the backup directory
 *
 * Usage:
 *   node src/restore-storage.js                         # Uses most recent backup
 *   node src/restore-storage.js 2026-02-17_153000       # Uses specific backup
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { config, validate } = require('./config');

/**
 * Finds the most recent storage backup directory.
 */
function findLatestBackup() {
    const storageBackupDir = path.join(config.backupDir, 'storage');
    if (!fs.existsSync(storageBackupDir)) {
        console.error('❌ No storage backups found in', storageBackupDir);
        process.exit(1);
    }

    const dirs = fs.readdirSync(storageBackupDir)
        .filter((d) => fs.statSync(path.join(storageBackupDir, d)).isDirectory())
        .sort()
        .reverse();

    if (dirs.length === 0) {
        console.error('❌ No storage backups found in', storageBackupDir);
        process.exit(1);
    }

    return path.join(storageBackupDir, dirs[0]);
}

/**
 * Recursively collects all files in a directory.
 * Returns paths relative to the base directory.
 */
function collectFiles(dir, base = dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectFiles(fullPath, base));
        } else if (!entry.name.startsWith('_')) {
            // Skip metadata files (_metadata.json)
            const relativePath = path.relative(base, fullPath).replace(/\\/g, '/');
            files.push(relativePath);
        }
    }

    return files;
}

/**
 * Detects the MIME type from file extension.
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.mp4': 'video/mp4',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

async function restoreStorage(backupTimestamp) {
    validate('storage');

    // Determine backup path
    let backupPath;
    if (backupTimestamp) {
        backupPath = path.join(config.backupDir, 'storage', backupTimestamp);
        if (!fs.existsSync(backupPath)) {
            console.error(`❌ Backup not found: ${backupPath}`);
            process.exit(1);
        }
    } else {
        backupPath = findLatestBackup();
    }

    const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

    console.log('📦 Starting storage restore...');
    console.log(`   Source: ${backupPath}`);
    console.log(`   Bucket: ${config.bucketName}`);

    // Step 1: Ensure bucket exists
    console.log('\n   ━━━ Step 1: Ensuring bucket exists ━━━');
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(
        config.bucketName
    );

    if (bucketError && bucketError.message.includes('not found')) {
        console.log(`   Creating bucket '${config.bucketName}'...`);
        const { error: createError } = await supabase.storage.createBucket(
            config.bucketName,
            { public: true, fileSizeLimit: 5242880 }
        );
        if (createError) {
            console.error('   ❌ Failed to create bucket:', createError.message);
            process.exit(1);
        }
        console.log(`   ✅ Bucket '${config.bucketName}' created`);
    } else if (bucketError) {
        console.error('   ❌ Bucket check failed:', bucketError.message);
        process.exit(1);
    } else {
        console.log(`   ✅ Bucket '${config.bucketName}' exists`);
    }

    // Step 2: Collect files to upload
    const files = collectFiles(backupPath);

    if (files.length === 0) {
        console.log('\n   ℹ️  No files to restore (empty backup).');
        console.log('\n✅ Storage restore completed (nothing to upload)');
        return backupPath;
    }

    console.log(`\n   ━━━ Step 2: Uploading ${files.length} files ━━━`);

    let uploaded = 0;
    let failed = 0;

    for (const filePath of files) {
        try {
            const localPath = path.join(backupPath, filePath);
            const fileBuffer = fs.readFileSync(localPath);
            const contentType = getMimeType(filePath);

            const { error } = await supabase.storage
                .from(config.bucketName)
                .upload(filePath, fileBuffer, {
                    contentType,
                    upsert: true, // Overwrite if exists
                });

            if (error) {
                console.log(`   ❌ ${filePath}: ${error.message}`);
                failed++;
            } else {
                uploaded++;
                console.log(`   ✅ ${filePath} (${(fileBuffer.length / 1024).toFixed(1)} KB)`);
            }
        } catch (err) {
            console.log(`   ❌ ${filePath}: ${err.message}`);
            failed++;
        }
    }

    console.log(`\n✅ Storage restore completed: ${uploaded}/${files.length} files`);
    if (failed > 0) console.log(`   ⚠️  ${failed} files failed to upload`);
    return backupPath;
}

// Run if called directly
if (require.main === module) {
    const arg = process.argv[2]; // Optional: specific backup timestamp
    restoreStorage(arg).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { restoreStorage };
