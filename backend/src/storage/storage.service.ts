
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService implements OnModuleInit {
    private supabase: SupabaseClient;
    private readonly logger = new Logger(StorageService.name);
    private readonly bucketName = 'propiedades';

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            this.logger.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found. StorageService disabled.');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async onModuleInit() {
        if (!this.supabase) return;

        this.logger.log(`Checking Supabase Storage bucket '${this.bucketName}'...`);
        try {
            const { data, error } = await this.supabase.storage.getBucket(this.bucketName);

            if (error && error.message.includes('not found')) {
                this.logger.log(`Bucket '${this.bucketName}' not found. Creating it...`);
                const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
                    public: true,
                    fileSizeLimit: 5242880, // 5MB limit example
                });

                if (createError) {
                    this.logger.error(`Failed to create bucket: ${createError.message}`);
                } else {
                    this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
                }
            } else if (error) {
                this.logger.error(`Error checking bucket: ${error.message}`);
            } else {
                this.logger.log(`Bucket '${this.bucketName}' exists.`);
            }
        } catch (err) {
            this.logger.error('Unexpected error initializing Storage:', err);
        }
    }

    async getSignedUploadUrl(path: string) {
        if (!this.supabase) throw new Error('Storage not configured');

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .createSignedUploadUrl(path);

        if (error) throw error;
        return data;
    }

    getPublicUrl(path: string) {
        if (!this.supabase) throw new Error('Storage not configured');
        const { data } = this.supabase.storage.from(this.bucketName).getPublicUrl(path);
        return data.publicUrl;
    }
}
