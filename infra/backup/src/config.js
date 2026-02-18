/**
 * Shared configuration for backup/restore scripts.
 * Loads environment variables from .env.backup
 */
const path = require('path');
const dotenv = require('dotenv');

// Load .env.backup from infra/backup/
dotenv.config({ path: path.join(__dirname, '..', '.env.backup') });

const config = {
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucketName: process.env.BUCKET_NAME || 'propiedades',
    backupDir: path.resolve(process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups')),
    retentionCount: parseInt(process.env.RETENTION_COUNT || '7', 10),
};

/**
 * Validates that all required environment variables are set.
 * @param {'db' | 'storage' | 'all'} scope
 */
function validate(scope = 'all') {
    const missing = [];

    if (scope === 'db' || scope === 'all') {
        if (!config.databaseUrl) missing.push('DATABASE_URL');
    }

    if (scope === 'storage' || scope === 'all') {
        if (!config.supabaseUrl) missing.push('SUPABASE_URL');
        if (!config.supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    }

    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing.join(', '));
        console.error('   Copy .env.backup.example to .env.backup and fill in your values.');
        process.exit(1);
    }
}

/**
 * Generates a timestamp string for versioning backups.
 * Format: YYYY-MM-DD_HHmmss
 */
function timestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

module.exports = { config, validate, timestamp };
