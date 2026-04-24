import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BUCKET = 'propiedades';
const SEED_IMAGES_DIR = path.join(__dirname, 'seed-images');
const VALID_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('⚠️  SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados. Se omite la subida de imágenes.');
    return null;
  }
  return createClient(url, key);
}


// IDs de propiedades (Generados dinámicamente pero fijos durante la ejecución)
const ID_PROP_001 = randomUUID();
const ID_PROP_002 = randomUUID();
const ID_PROP_003 = randomUUID();
const ID_PROP_004 = randomUUID();
const ID_PROP_005 = randomUUID();
const ID_PROP_006 = randomUUID();
const ID_PROP_007 = randomUUID();
const ID_PROP_008 = randomUUID();

// IDs de contratos (Generados dinámicamente pero fijos durante la ejecución)
const ID_CONT_001 = randomUUID();
const ID_CONT_002 = randomUUID();
const ID_CONT_003 = randomUUID();
const ID_CONT_004 = randomUUID();

async function uploadImagesForProperty(
  supabase: SupabaseClient,
  propertyId: string,
  folderNumber: number,
): Promise<{ mainImageUrl: string | null; count: number }> {
  const folderPath = path.join(SEED_IMAGES_DIR, `propiedad-${folderNumber}`);

  if (!fs.existsSync(folderPath)) {
    console.log(`   ℹ️  Sin imágenes para propiedad-${folderNumber} (carpeta no existe)`);
    return { mainImageUrl: null, count: 0 };
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => VALID_EXTENSIONS.test(f))
    .sort();

  if (files.length === 0) {
    console.log(`   ℹ️  Sin imágenes para propiedad-${folderNumber} (carpeta vacía)`);
    return { mainImageUrl: null, count: 0 };
  }

  await prisma.propertyImage.deleteMany({ where: { propertyId } });

  const publicUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = path.extname(file).slice(1).toLowerCase();
    const storagePath = `${propertyId}/${randomUUID()}.${ext}`;
    const buffer = fs.readFileSync(path.join(folderPath, file));
    const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType, upsert: false });

    if (error) {
      console.warn(`   ⚠️  Error subiendo ${file}: ${error.message}`);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    publicUrls.push(data.publicUrl);

    await prisma.propertyImage.create({
      data: { url: data.publicUrl, order: i + 1, propertyId },
    });
  }

  const mainImageUrl = publicUrls[0] ?? null;

  if (mainImageUrl) {
    await prisma.property.update({
      where: { id: propertyId },
      data: { mainImage: mainImageUrl },
    });
  }

  return { mainImageUrl, count: publicUrls.length };
}

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ─── USUARIOS ────────────────────────────────────────────────────────────
  console.log('👤 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@inmobiliaria.com' },
    update: {},
    create: {
      email: 'admin@inmobiliaria.com',
      password: hashedPassword,
      name: 'Admin Sistema',
      role: UserRole.Administrador,
      status: UserStatus.active,
    },
  });

  const gerente = await prisma.user.upsert({
    where: { email: 'gerente@inmobiliaria.com' },
    update: {},
    create: {
      email: 'gerente@inmobiliaria.com',
      password: hashedPassword,
      name: 'Carlos Méndez',
      role: UserRole.Gerencia,
      status: UserStatus.active,
    },
  });

  const agente = await prisma.user.upsert({
    where: { email: 'agente@inmobiliaria.com' },
    update: {},
    create: {
      email: 'agente@inmobiliaria.com',
      password: hashedPassword,
      name: 'Laura Fernández',
      role: UserRole.Agente,
      status: UserStatus.active,
    },
  });

  // Propietario 1: email real para testing con Resend
  const propietario1 = await prisma.user.upsert({
    where: { email: 'cuentadepruebasdevirgi@gmail.com' },
    update: {},
    create: {
      email: 'cuentadepruebasdevirgi@gmail.com',
      password: hashedPassword,
      name: 'Virgilio Müller',
      role: UserRole.Propietario,
      status: UserStatus.active,
    },
  });

  const propietario2 = await prisma.user.upsert({
    where: { email: 'propietario2@inmobiliaria.com' },
    update: {},
    create: {
      email: 'propietario2@inmobiliaria.com',
      password: hashedPassword,
      name: 'Roberto Salinas',
      role: UserRole.Propietario,
      status: UserStatus.active,
    },
  });

  const inquilino1 = await prisma.user.upsert({
    where: { email: 'inquilino1@inmobiliaria.com' },
    update: {},
    create: {
      email: 'inquilino1@inmobiliaria.com',
      password: hashedPassword,
      name: 'Marcela Gómez',
      role: UserRole.Inquilino,
      status: UserStatus.active,
    },
  });

  const inquilino2 = await prisma.user.upsert({
    where: { email: 'inquilino2@inmobiliaria.com' },
    update: {},
    create: {
      email: 'inquilino2@inmobiliaria.com',
      password: hashedPassword,
      name: 'Sebastián Torres',
      role: UserRole.Inquilino,
      status: UserStatus.active,
    },
  });

  console.log(`✅ 7 usuarios creados`);
  // Suppress unused variable warnings
  void admin;
  void gerente;

  // ─── PROVINCIAS ──────────────────────────────────────────────────────────
  console.log('\n📍 Creando provincias...');
  const provincias = [
    'Ciudad Autónoma de Buenos Aires',
    'Neuquén',
    'San Luis',
    'Santa Fe',
    'La Rioja',
    'Catamarca',
    'Tucumán',
    'Chaco',
    'Formosa',
    'Santa Cruz',
    'Chubut',
    'Mendoza',
    'Entre Ríos',
    'San Juan',
    'Jujuy',
    'Santiago del Estero',
    'Río Negro',
    'Corrientes',
    'Misiones',
    'Salta',
    'Córdoba',
    'Buenos Aires',
    'La Pampa',
    'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
  ];

  for (const nombre of provincias) {
    await prisma.provincia.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log(`✅ ${provincias.length} provincias procesadas`);

  // ─── LOCALIDADES Y CALLES ─────────────────────────────────────────────────
  console.log('\n🗺️  Creando localidades y calles...');

  const provBA = await prisma.provincia.findUniqueOrThrow({ where: { nombre: 'Buenos Aires' } });
  const provCABA = await prisma.provincia.findUniqueOrThrow({ where: { nombre: 'Ciudad Autónoma de Buenos Aires' } });
  const provCBA = await prisma.provincia.findUniqueOrThrow({ where: { nombre: 'Córdoba' } });
  const provMDZ = await prisma.provincia.findUniqueOrThrow({ where: { nombre: 'Mendoza' } });
  const provNQN = await prisma.provincia.findUniqueOrThrow({ where: { nombre: 'Neuquén' } });

  const locMdP = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Mar del Plata', provinciaId: provBA.id } },
    update: {},
    create: { nombre: 'Mar del Plata', provinciaId: provBA.id },
  });

  const locLaPlata = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'La Plata', provinciaId: provBA.id } },
    update: {},
    create: { nombre: 'La Plata', provinciaId: provBA.id },
  });

  const locPalermo = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Palermo', provinciaId: provCABA.id } },
    update: {},
    create: { nombre: 'Palermo', provinciaId: provCABA.id },
  });

  const locRecoleta = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Recoleta', provinciaId: provCABA.id } },
    update: {},
    create: { nombre: 'Recoleta', provinciaId: provCABA.id },
  });

  const locCBA = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Córdoba Capital', provinciaId: provCBA.id } },
    update: {},
    create: { nombre: 'Córdoba Capital', provinciaId: provCBA.id },
  });

  const locMDZ = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Mendoza Capital', provinciaId: provMDZ.id } },
    update: {},
    create: { nombre: 'Mendoza Capital', provinciaId: provMDZ.id },
  });

  const locNQN = await prisma.localidad.upsert({
    where: { nombre_provinciaId: { nombre: 'Neuquén Capital', provinciaId: provNQN.id } },
    update: {},
    create: { nombre: 'Neuquén Capital', provinciaId: provNQN.id },
  });

  const calleColon = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Av. Colón', localidadId: locMdP.id } },
    update: {},
    create: { nombre: 'Av. Colón', localidadId: locMdP.id },
  });

  const calleRivadavia = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Calle Rivadavia', localidadId: locMdP.id } },
    update: {},
    create: { nombre: 'Calle Rivadavia', localidadId: locMdP.id },
  });

  const calleCalle7 = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Calle 7', localidadId: locLaPlata.id } },
    update: {},
    create: { nombre: 'Calle 7', localidadId: locLaPlata.id },
  });

  const calleSantaFe = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Av. Santa Fe', localidadId: locPalermo.id } },
    update: {},
    create: { nombre: 'Av. Santa Fe', localidadId: locPalermo.id },
  });

  const calleCallao = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Av. Callao', localidadId: locRecoleta.id } },
    update: {},
    create: { nombre: 'Av. Callao', localidadId: locRecoleta.id },
  });

  const calleBvSanJuan = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Bv. San Juan', localidadId: locCBA.id } },
    update: {},
    create: { nombre: 'Bv. San Juan', localidadId: locCBA.id },
  });

  const calleSanMartin = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Av. San Martín', localidadId: locMDZ.id } },
    update: {},
    create: { nombre: 'Av. San Martín', localidadId: locMDZ.id },
  });

  const calleArgentina = await prisma.calle.upsert({
    where: { nombre_localidadId: { nombre: 'Av. Argentina', localidadId: locNQN.id } },
    update: {},
    create: { nombre: 'Av. Argentina', localidadId: locNQN.id },
  });

  console.log('✅ Localidades y calles creadas');

  // ─── PROPIEDADES ─────────────────────────────────────────────────────────
  console.log('\n🏠 Creando propiedades...');

  // prop-001: Departamento moderno en alquiler, actualmente ocupado
  await prisma.property.upsert({
    where: { id: ID_PROP_001 },
    update: {},
    create: {
      id: ID_PROP_001,
      title: 'Departamento 2 amb. en alquiler — Av. Colón 272, Mar del Plata',
      description:
        'Moderno departamento de 2 ambientes con living-comedor integrado y cocina completa con mesada de granito y muebles oscuros. Piso flotante, excelente luminosidad.',
      propertyType: 'departamento',
      listingType: 'alquiler',
      status: 'alquilada',
      price: 450000,
      bedrooms: 1,
      rooms: 2,
      bathrooms: 1,
      area: 48,
      yearBuilt: 2017,
      streetNumber: '272',
      apartment: '4A',
      location: 'Av. Colón 272 4A, Mar del Plata, Buenos Aires',
      ownerId: propietario1.id,
      agentId: agente.id,
      localidadId: locMdP.id,
      provinciaId: provBA.id,
      calleId: calleColon.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_001 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Cocina equipada con granito', propertyId: ID_PROP_001 },
      { name: 'Piso flotante', propertyId: ID_PROP_001 },
      { name: 'Living-comedor integrado', propertyId: ID_PROP_001 },
      { name: 'AC split', propertyId: ID_PROP_001 },
    ],
  });

  // prop-002: Departamento en alquiler, disponible
  await prisma.property.upsert({
    where: { id: ID_PROP_002 },
    update: {},
    create: {
      id: ID_PROP_002,
      title: 'Departamento 2 amb. en Palermo — Av. Santa Fe 3420',
      description:
        'Luminoso departamento en piso 8 con balcón y vista despejada. Edificio con amenities: SUM, laundry y seguridad 24hs.',
      propertyType: 'departamento',
      listingType: 'alquiler',
      status: 'activa',
      price: 320000,
      bedrooms: 1,
      rooms: 2,
      bathrooms: 1,
      area: 48,
      yearBuilt: 2018,
      streetNumber: '3420',
      apartment: '8B',
      location: 'Av. Santa Fe 3420 8B, Palermo, CABA',
      ownerId: propietario1.id,
      agentId: agente.id,
      localidadId: locPalermo.id,
      provinciaId: provCABA.id,
      calleId: calleSantaFe.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_002 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Balcón', propertyId: ID_PROP_002 },
      { name: 'Seguridad 24hs', propertyId: ID_PROP_002 },
      { name: 'SUM', propertyId: ID_PROP_002 },
      { name: 'Laundry en planta baja', propertyId: ID_PROP_002 },
    ],
  });

  // prop-003: Departamento luminoso con balcón en alquiler
  await prisma.property.upsert({
    where: { id: ID_PROP_003 },
    update: {},
    create: {
      id: ID_PROP_003,
      title: 'Departamento luminoso con balcón — Rivadavia 1850, Mar del Plata',
      description:
        'Departamento muy luminoso con piso de madera y amplio balcón con vista despejada. Paredes blancas, espacios bien distribuidos. Ideal para profesional o pareja.',
      propertyType: 'departamento',
      listingType: 'alquiler',
      status: 'activa',
      price: 310000,
      bedrooms: 1,
      rooms: 2,
      bathrooms: 1,
      area: 42,
      yearBuilt: 2010,
      streetNumber: '1850',
      apartment: '6C',
      location: 'Calle Rivadavia 1850 6C, Mar del Plata, Buenos Aires',
      ownerId: propietario2.id,
      agentId: agente.id,
      localidadId: locMdP.id,
      provinciaId: provBA.id,
      calleId: calleRivadavia.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_003 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Balcón amplio', propertyId: ID_PROP_003 },
      { name: 'Piso de madera', propertyId: ID_PROP_003 },
      { name: 'Mucha luz natural', propertyId: ID_PROP_003 },
      { name: 'Vista despejada', propertyId: ID_PROP_003 },
    ],
  });

  // prop-004: Departamento en alquiler, ocupado (contrato vencido)
  await prisma.property.upsert({
    where: { id: ID_PROP_004 },
    update: {},
    create: {
      id: ID_PROP_004,
      title: 'Departamento en Recoleta — Av. Callao 890, 3° A',
      description:
        'Clásico departamento en Recoleta con pisos de madera, techos altos y gran luminosidad. Edificio histórico.',
      propertyType: 'departamento',
      listingType: 'alquiler',
      status: 'alquilada',
      price: 280000,
      bedrooms: 2,
      rooms: 3,
      bathrooms: 1,
      area: 72,
      yearBuilt: 1965,
      streetNumber: '890',
      apartment: '3A',
      location: 'Av. Callao 890 3A, Recoleta, CABA',
      ownerId: propietario2.id,
      agentId: agente.id,
      localidadId: locRecoleta.id,
      provinciaId: provCABA.id,
      calleId: calleCallao.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_004 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Pisos de madera', propertyId: ID_PROP_004 },
      { name: 'Techos altos', propertyId: ID_PROP_004 },
      { name: 'Portero 24hs', propertyId: ID_PROP_004 },
      { name: 'Baulera', propertyId: ID_PROP_004 },
    ],
  });

  // prop-005: Departamento moderno en venta
  await prisma.property.upsert({
    where: { id: ID_PROP_005 },
    update: {},
    create: {
      id: ID_PROP_005,
      title: 'Departamento moderno en venta — Bv. San Juan 540, Córdoba',
      description:
        'Estreno. Departamento de diseño con living amplio, sofá en L y cocina americana con barra. Iluminación ambiental LED, terminaciones de primera calidad. Piso de porcelanato claro.',
      propertyType: 'departamento',
      listingType: 'venta',
      status: 'activa',
      price: 89000,
      bedrooms: 2,
      rooms: 3,
      bathrooms: 1,
      area: 68,
      yearBuilt: 2023,
      streetNumber: '540',
      apartment: '2B',
      location: 'Bv. San Juan 540 2B, Córdoba Capital, Córdoba',
      ownerId: propietario1.id,
      agentId: agente.id,
      localidadId: locCBA.id,
      provinciaId: provCBA.id,
      calleId: calleBvSanJuan.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_005 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Cocina americana con barra', propertyId: ID_PROP_005 },
      { name: 'Iluminación LED ambiental', propertyId: ID_PROP_005 },
      { name: 'Porcelanato 60x60', propertyId: ID_PROP_005 },
      { name: 'Terminaciones de lujo', propertyId: ID_PROP_005 },
    ],
  });

  // prop-006: Casa antigua en venta
  await prisma.property.upsert({
    where: { id: ID_PROP_006 },
    update: {},
    create: {
      id: ID_PROP_006,
      title: 'Casa en venta — Av. San Martín 1100, Mendoza',
      description:
        'Clásica casa de estilo con comedor formal, araña de techo, ventanas amplias y chimenea. Construcción sólida de los años 60. Gran potencial para refuncionalizar o habitar tal cual.',
      propertyType: 'casa',
      listingType: 'venta',
      status: 'activa',
      price: 95000,
      bedrooms: 3,
      rooms: 5,
      bathrooms: 2,
      area: 160,
      yearBuilt: 1962,
      streetNumber: '1100',
      location: 'Av. San Martín 1100, Mendoza Capital, Mendoza',
      ownerId: propietario2.id,
      agentId: agente.id,
      localidadId: locMDZ.id,
      provinciaId: provMDZ.id,
      calleId: calleSanMartin.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_006 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Comedor formal', propertyId: ID_PROP_006 },
      { name: 'Araña de techo original', propertyId: ID_PROP_006 },
      { name: 'Chimenea', propertyId: ID_PROP_006 },
      { name: 'Ventanas amplias', propertyId: ID_PROP_006 },
      { name: 'Construcción sólida', propertyId: ID_PROP_006 },
    ],
  });

  // prop-007: Casa con interiores originales en alquiler
  await prisma.property.upsert({
    where: { id: ID_PROP_007 },
    update: {},
    create: {
      id: ID_PROP_007,
      title: 'Casa en alquiler — Av. Argentina 2300, Neuquén',
      description:
        'Casa con carácter. Living amplio con piso de madera, biblioteca empotrada y excelente ventilación natural. Comedor separado con pisos de mosaico original y bloques de vidrio. Espacios únicos y bien conservados.',
      propertyType: 'casa',
      listingType: 'alquiler',
      status: 'activa',
      price: 380000,
      bedrooms: 2,
      rooms: 4,
      bathrooms: 1,
      area: 110,
      yearBuilt: 1975,
      streetNumber: '2300',
      location: 'Av. Argentina 2300, Neuquén Capital, Neuquén',
      ownerId: propietario1.id,
      agentId: agente.id,
      localidadId: locNQN.id,
      provinciaId: provNQN.id,
      calleId: calleArgentina.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_007 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Piso de madera original', propertyId: ID_PROP_007 },
      { name: 'Biblioteca empotrada', propertyId: ID_PROP_007 },
      { name: 'Pisos de mosaico', propertyId: ID_PROP_007 },
      { name: 'Bloques de vidrio', propertyId: ID_PROP_007 },
      { name: 'Comedor separado', propertyId: ID_PROP_007 },
    ],
  });

  // prop-008: Local comercial con frente vidriado en alquiler
  await prisma.property.upsert({
    where: { id: ID_PROP_008 },
    update: {},
    create: {
      id: ID_PROP_008,
      title: 'Local comercial — Calle 7 Nro. 450, La Plata',
      description:
        'Local premium con frente totalmente vidriado, piso de mármol y puerta de madera de roble. Excelente visibilidad. Apto para showroom, boutique, consultorio u oficina comercial.',
      propertyType: 'local_comercial',
      listingType: 'alquiler',
      status: 'activa',
      price: 750000,
      bedrooms: 0,
      rooms: 1,
      bathrooms: 1,
      area: 85,
      yearBuilt: 2005,
      streetNumber: '450',
      location: 'Calle 7 Nro. 450, La Plata, Buenos Aires',
      ownerId: propietario2.id,
      agentId: agente.id,
      localidadId: locLaPlata.id,
      provinciaId: provBA.id,
      calleId: calleCalle7.id,
    },
  });
  await prisma.propertyFeature.deleteMany({ where: { propertyId: ID_PROP_008 } });
  await prisma.propertyFeature.createMany({
    data: [
      { name: 'Frente totalmente vidriado', propertyId: ID_PROP_008 },
      { name: 'Piso de mármol', propertyId: ID_PROP_008 },
      { name: 'Puerta de madera de roble', propertyId: ID_PROP_008 },
      { name: 'Apto showroom o boutique', propertyId: ID_PROP_008 },
    ],
  });

  console.log('✅ 8 propiedades creadas');

  // ─── IMÁGENES ────────────────────────────────────────────────────────────
  console.log('\n🖼️  Procesando imágenes...');
  const supabase = createSupabaseClient();

  const imageResults: { id: string; count: number }[] = [];

  if (supabase) {
    const propertyImageMap: Array<{ id: string; folder: number }> = [
      { id: ID_PROP_001, folder: 1 },
      { id: ID_PROP_002, folder: 2 },
      { id: ID_PROP_003, folder: 3 },
      { id: ID_PROP_004, folder: 4 },
      { id: ID_PROP_005, folder: 5 },
      { id: ID_PROP_006, folder: 6 },
      { id: ID_PROP_007, folder: 7 },
      { id: ID_PROP_008, folder: 8 },
    ];

    for (const { id, folder } of propertyImageMap) {
      const { count } = await uploadImagesForProperty(supabase, id, folder);
      imageResults.push({ id, count });
    }
  }

  // ─── CONTRATOS ───────────────────────────────────────────────────────────
  console.log('\n📄 Creando contratos...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // contrato-001: Activo, vence en 30 días, ajuste en 5 días (test notificaciones)
  await prisma.rentalContract.upsert({
    where: { id: ID_CONT_001 },
    update: {
      endDate: addDays(today, 30),
      nextAdjustmentDate: addDays(today, 5),
    },
    create: {
      id: ID_CONT_001,
      propertyId: ID_PROP_001,
      tenantId: inquilino1.id,
      landlordId: propietario1.id,
      agentId: agente.id,
      monthlyRent: 450000,
      deposit: 900000,
      adjustmentFrequency: 3,
      startDate: addMonths(today, -12),
      endDate: addDays(today, 30),
      nextAdjustmentDate: addDays(today, 5),
      status: 'active',
    },
  });

  // contrato-002: Vencido hace 60 días
  await prisma.rentalContract.upsert({
    where: { id: ID_CONT_002 },
    update: {},
    create: {
      id: ID_CONT_002,
      propertyId: ID_PROP_004,
      tenantId: inquilino2.id,
      landlordId: propietario2.id,
      agentId: agente.id,
      monthlyRent: 280000,
      deposit: 560000,
      adjustmentFrequency: 6,
      startDate: addMonths(today, -24),
      endDate: addDays(today, -60),
      actualEndDate: addDays(today, -60),
      status: 'expired',
    },
  });

  // contrato-003: Terminado anticipadamente (histórico sobre prop-001)
  await prisma.rentalContract.upsert({
    where: { id: ID_CONT_003 },
    update: {},
    create: {
      id: ID_CONT_003,
      propertyId: ID_PROP_001,
      tenantId: inquilino2.id,
      landlordId: propietario1.id,
      agentId: agente.id,
      monthlyRent: 380000,
      deposit: 760000,
      adjustmentFrequency: 3,
      startDate: addMonths(today, -28),
      endDate: addMonths(today, -15),
      actualEndDate: addMonths(today, -16),
      status: 'terminated',
    },
  });

  // contrato-004: Activo, vence en 8 meses (local comercial)
  await prisma.rentalContract.upsert({
    where: { id: ID_CONT_004 },
    update: {},
    create: {
      id: ID_CONT_004,
      propertyId: ID_PROP_008,
      tenantId: inquilino1.id,
      landlordId: propietario2.id,
      agentId: agente.id,
      monthlyRent: 750000,
      deposit: 1500000,
      adjustmentFrequency: 6,
      startDate: addMonths(today, -4),
      endDate: addMonths(today, 8),
      nextAdjustmentDate: addMonths(today, 2),
      status: 'active',
    },
  });

  console.log('✅ 4 contratos creados');

  // ─── RESUMEN ─────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('  SEED COMPLETADO');
  console.log('═'.repeat(50));
  console.log('\n  Usuarios (password: admin123):');
  console.log('    admin@inmobiliaria.com             → Administrador');
  console.log('    gerente@inmobiliaria.com           → Gerencia');
  console.log('    agente@inmobiliaria.com            → Agente');
  console.log('    cuentadepruebasdevirgi@gmail.com   → Propietario');
  console.log('    propietario2@inmobiliaria.com      → Propietario');
  console.log('    inquilino1@inmobiliaria.com        → Inquilino');
  console.log('    inquilino2@inmobiliaria.com        → Inquilino');
  console.log('\n  Propiedades: 8 creadas');
  console.log('  Contratos:   4 creados');
  console.log('    contrato-001: ACTIVO — vence en 30d, ajuste en 5d ⚠️');
  console.log('    contrato-002: VENCIDO — expiró hace 60 días');
  console.log('    contrato-003: TERMINADO anticipadamente');
  console.log('    contrato-004: ACTIVO — vence en 8 meses');

  if (supabase) {
    const totalImages = imageResults.reduce((sum, r) => sum + r.count, 0);
    console.log(`\n  Imágenes:    ${totalImages} subidas a Supabase`);
    for (const r of imageResults) {
      if (r.count > 0) console.log(`    ${r.id}: ${r.count} imagen(es)`);
    }
    if (totalImages === 0) {
      console.log('    (ninguna — podés agregar fotos en backend/prisma/seed-images/)');
    }
  }

  console.log('\n' + '═'.repeat(50) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
