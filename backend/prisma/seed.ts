import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inmobiliaria.com' },
    update: {},
    create: {
      email: 'admin@inmobiliaria.com',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.Administrador,
      status: UserStatus.active,
    },
  });

  console.log('✅ Admin user created:', {
    email: admin.email,
    role: admin.role,
    password: 'admin123 (change this after first login!)',
  });

  // Create agent user
  const agent = await prisma.user.upsert({
    where: { email: 'agent@inmobiliaria.com' },
    update: {},
    create: {
      email: 'agent@inmobiliaria.com',
      password: hashedPassword,
      name: 'Agente Inmobiliario',
      role: UserRole.Agente,
      status: UserStatus.active,
    },
  });

  console.log('✅ Agent user created:', {
    email: agent.email,
    role: agent.role,
    password: 'admin123 (change this after first login!)',
  });

  // Create landlord user
  // NOTE: using real email for Resend free plan testing (only sends to your own email)
  const landlord = await prisma.user.upsert({
    where: { email: 'cuentadepruebasdevirgi@gmail.com' },
    update: {},
    create: {
      email: 'cuentadepruebasdevirgi@gmail.com',
      password: hashedPassword,
      name: 'Propietario de Inmueble',
      role: UserRole.Propietario,
      status: UserStatus.active,
    },
  });

  console.log('✅ Landlord user created:', {
    email: landlord.email,
    role: landlord.role,
    password: 'admin123 (change this after first login!)',
  });

  // Create tenant user
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@inmobiliaria.com' },
    update: {},
    create: {
      email: 'tenant@inmobiliaria.com',
      password: hashedPassword,
      name: 'Inquilino',
      role: UserRole.Inquilino,
      status: UserStatus.active,
    },
  });

  console.log('✅ Tenant user created:', {
    email: tenant.email,
    role: tenant.role,
    password: 'admin123 (change this after first login!)',
  });

  // Create manager user
  const manager = await prisma.user.upsert({
    where: { email: 'manager@inmobiliaria.com' },
    update: {},
    create: {
      email: 'manager@inmobiliaria.com',
      password: hashedPassword,
      name: 'Gerente General',
      role: UserRole.Gerencia,
      status: UserStatus.active,
    },
  });

  console.log('✅ Manager user created:', {
    email: manager.email,
    role: manager.role,
    password: 'admin123 (change this after first login!)',
  });

  // Seed Provinces
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

  console.log('\n📍 Seeding provinces...');
  for (const nombre of provincias) {
    await prisma.provincia.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log(`✅ ${provincias.length} provinces processed.`);

  // Seed test property + contract for notification testing
  console.log('\n🏠 Seeding test property and contract...');

  const buenosAires = await prisma.provincia.findUnique({
    where: { nombre: 'Buenos Aires' },
  });

  const testProperty = await prisma.property.upsert({
    where: { id: 'test-property-001' },
    update: {},
    create: {
      id: 'test-property-001',
      title: 'Departamento Test - Av. Corrientes 1234',
      description: 'Propiedad de prueba para testear notificaciones de contratos.',
      propertyType: 'departamento',
      listingType: 'alquiler',
      status: 'alquilada',
      price: 350000,
      bedrooms: 2,
      rooms: 3,
      bathrooms: 1,
      area: 65,
      ownerId: landlord.id,
      agentId: agent.id,
      provinciaId: buenosAires?.id,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Contract 1: expires in 30 days (triggers 30-day expiration alert)
  const endDate30 = new Date(today);
  endDate30.setDate(endDate30.getDate() + 30);

  const adjustmentDate = new Date(today);
  adjustmentDate.setDate(adjustmentDate.getDate() + 5);

  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  await prisma.rentalContract.upsert({
    where: { id: 'test-contract-001' },
    update: {
      endDate: endDate30,
      nextAdjustmentDate: adjustmentDate,
    },
    create: {
      id: 'test-contract-001',
      propertyId: testProperty.id,
      tenantId: tenant.id,
      landlordId: landlord.id,
      agentId: agent.id,
      monthlyRent: 350000,
      deposit: 700000,
      adjustmentFrequency: 3,
      startDate,
      endDate: endDate30,
      nextAdjustmentDate: adjustmentDate,
      status: 'active',
    },
  });

  console.log('✅ Test property created:', testProperty.title);
  console.log('✅ Test contract created:');
  console.log(`   - endDate: ${endDate30.toLocaleDateString('es-AR')} (30 days from now → triggers expiration alert)`);
  console.log(`   - nextAdjustmentDate: ${adjustmentDate.toLocaleDateString('es-AR')} (5 days from now → triggers adjustment alert)`);

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Summary:');
  console.log('  - Admin:    admin@inmobiliaria.com');
  console.log('  - Agent:    agent@inmobiliaria.com');
  console.log('  - Landlord: landlord@inmobiliaria.com');
  console.log('  - Tenant:   tenant@inmobiliaria.com');
  console.log('  - Manager:  manager@inmobiliaria.com');
  console.log('  - Password: admin123 (for all users)');
  console.log('\n📧 Notification test data:');
  console.log('  - Contract test-contract-001 will trigger BOTH alerts');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
