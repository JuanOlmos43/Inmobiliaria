import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(StorageService.name);
  private readonly bucketName = 'propiedades';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found. StorageService disabled.',
      );
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async onModuleInit() {
    if (!this.supabase) return;

    this.logger.log(`Checking Supabase Storage bucket '${this.bucketName}'...`);
    try {
      const { data, error } = await this.supabase.storage.getBucket(
        this.bucketName,
      );

      if (error && error.message.includes('not found')) {
        this.logger.log(
          `Bucket '${this.bucketName}' not found. Creating it...`,
        );
        // Crear bucket público
        const { error: createError } = await this.supabase.storage.createBucket(
          this.bucketName,
          {
            public: true,
            fileSizeLimit: 5242880, // 5MB limit
          },
        );

        if (createError) {
          this.logger.error(`Failed to create bucket: ${createError.message}`);
        } else {
          this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
          // Aplicar políticas al crear
          await this.ensurePolicies();
        }
      } else if (error) {
        this.logger.error(`Error checking bucket: ${error.message}`);
      } else {
        this.logger.log(`Bucket '${this.bucketName}' exists.`);
        // Asegurar políticas incluso si ya existe
        await this.ensurePolicies();
      }
    } catch (err) {
      this.logger.error('Unexpected error initializing Storage:', err);
    }
  }

  /**
   * Aplica las políticas de seguridad RLS (Row Level Security) al bucket.
   * Esto asegura que sea público para lectura y restringido para escritura.
   */
  private async ensurePolicies() {
    this.logger.log(`Configuring storage policies for '${this.bucketName}'...`);
    try {
      // Habilitar RLS en storage.objects si no está habilitado (por defecto suele estarlo)
      // Nota: storage.objects es una tabla de sistema de Supabase/Postgres.

      // 1. Política de Lectura Pública (SELECT)
      // Verificamos si existe la política antes de crearla para evitar errores
      await this.prisma.$executeRawUnsafe(`
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_policies 
                        WHERE schemaname = 'storage' 
                        AND tablename = 'objects' 
                        AND policyname = 'Public Access ${this.bucketName}'
                    ) THEN
                        CREATE POLICY "Public Access ${this.bucketName}"
                        ON storage.objects FOR SELECT
                        USING ( bucket_id = '${this.bucketName}' );
                    END IF;
                END
                $$;
            `);

      // 2. Política de Escritura Autenticada (INSERT)
      // Permite subir solo a usuarios autenticados
      await this.prisma.$executeRawUnsafe(`
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_policies 
                        WHERE schemaname = 'storage' 
                        AND tablename = 'objects' 
                        AND policyname = 'Authenticated Upload ${this.bucketName}'
                    ) THEN
                        CREATE POLICY "Authenticated Upload ${this.bucketName}"
                        ON storage.objects FOR INSERT
                        TO authenticated
                        WITH CHECK ( bucket_id = '${this.bucketName}' );
                    END IF;
                END
                $$;
            `);

      // 3. ACTUALIZAR bucket a public = true (por si acaso se creó manual como privado)
      await this.prisma.$executeRawUnsafe(`
                UPDATE storage.buckets
                SET "public" = true
                WHERE id = '${this.bucketName}';
            `);

      this.logger.log(
        `Storage policies configured successfully for '${this.bucketName}'.`,
      );
    } catch (error) {
      this.logger.error(
        `Error configuring storage policies: ${error.message}`,
        error,
      );
      // No lanzamos error para no detener la app, pero logueamos
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
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    return data.publicUrl;
  }
  async deleteFolder(folderPath: string) {
    if (!this.supabase) throw new Error('Storage not configured');

    // 1. List files in the folder (prefix)
    const { data: files, error: listError } = await this.supabase.storage
      .from(this.bucketName)
      .list(folderPath);

    if (listError) {
      this.logger.error(
        `Error listing files in folder ${folderPath}: ${listError.message}`,
      );
      throw listError;
    }

    if (!files || files.length === 0) return;

    // 2. Extract file paths
    // The list method returns relative paths inside the folder, or sometimes the structure depends on how it's called.
    // Usually, .list('folder') returns items inside 'folder'.
    // To delete, we need full path: 'folder/filename'
    const filesToDelete = files.map((file) => `${folderPath}/${file.name}`);

    // 3. Delete files
    const { error: deleteError } = await this.supabase.storage
      .from(this.bucketName)
      .remove(filesToDelete);

    if (deleteError) {
      this.logger.error(
        `Error deleting files in folder ${folderPath}: ${deleteError.message}`,
      );
      throw deleteError;
    }
  }
  async deleteFiles(paths: string[]) {
    if (!this.supabase) throw new Error('Storage not configured');

    const { error: deleteError } = await this.supabase.storage
      .from(this.bucketName)
      .remove(paths);

    if (deleteError) {
      this.logger.error(
        `Error deleting files: ${deleteError.message}`,
      );
      throw deleteError;
    }
  }
}
