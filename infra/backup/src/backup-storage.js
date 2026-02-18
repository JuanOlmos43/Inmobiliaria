/**
 * backup-storage.js
 * Downloads all files from the Supabase Storage bucket to a local directory.
 * Preserves the folder structure from the bucket.
 *
 * Usage: node src/backup-storage.js
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { config, validate, timestamp } = require('./config');

/**
 * Recursively lists all files in a bucket folder.
 * Supabase .list() only returns direct children, so we recurse into folders.
 */
async function listAllFiles(storage, bucket, folder = '') {
    const allFiles = [];
    const { data, error } = await storage.from(bucket).list(folder, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
        console.error(`   ⚠️  Error listing ${folder || '/'}:`, error.message);
        return allFiles;
    }

    for (const item of data || []) {
        const itemPath = folder ? `${folder}/${item.name}` : item.name;

        if (item.id === null) {
            // It's a folder — recurse
            const subFiles = await listAllFiles(storage, bucket, itemPath);
            allFiles.push(...subFiles);
        } else {
            // It's a file
            allFiles.push(itemPath);
        }
    }

    return allFiles;
}

async function backupStorage() {
    validate('storage');

    const ts = timestamp();
    const backupPath = path.join(config.backupDir, 'storage', ts);
    fs.mkdirSync(backupPath, { recursive: true });

    const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

    try {
        console.log('📦 Starting storage backup...');
        console.log(`   Bucket: ${config.bucketName}`);
        console.log(`   Target: ${backupPath}`);

        // List all files recursively
        const files = await listAllFiles(supabase.storage, config.bucketName);

        if (files.length === 0) {
            console.log('   ℹ️  No files found in bucket.');
            fs.writeFileSync(
                path.join(backupPath, '_metadata.json'),
                JSON.stringify({ timestamp: ts, bucket: config.bucketName, files: 0 }, null, 2)
            );
            console.log(`\n✅ Storage backup completed (empty bucket): ${backupPath}`);
            return backupPath;
        }

        console.log(`   Found ${files.length} files to backup.\n`);

        let downloaded = 0;
        let failed = 0;

        for (const filePath of files) {
            try {
                const { data, error } = await supabase.storage
                    .from(config.bucketName)
                    .download(filePath);

                if (error) {
                    console.log(`   ❌ ${filePath}: ${error.message}`);
                    failed++;
                    continue;
                }

                // Save file locally preserving folder structure
                const localPath = path.join(backupPath, filePath);
                fs.mkdirSync(path.dirname(localPath), { recursive: true });

                const buffer = Buffer.from(await data.arrayBuffer());
                fs.writeFileSync(localPath, buffer);

                downloaded++;
                console.log(`   ✅ ${filePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
            } catch (err) {
                console.log(`   ❌ ${filePath}: ${err.message}`);
                failed++;
            }
        }

        // Save metadata
        fs.writeFileSync(
            path.join(backupPath, '_metadata.json'),
            JSON.stringify({
                timestamp: ts,
                bucket: config.bucketName,
                totalFiles: files.length,
                downloaded,
                failed,
                fileList: files,
            }, null, 2)
        );

        console.log(`\n✅ Storage backup completed: ${downloaded}/${files.length} files`);
        if (failed > 0) console.log(`   ⚠️  ${failed} files failed to download`);
        console.log(`   Path: ${backupPath}`);
        return backupPath;
    } catch (err) {
        console.error('❌ Storage backup failed:', err.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    backupStorage();
}

module.exports = { backupStorage };
