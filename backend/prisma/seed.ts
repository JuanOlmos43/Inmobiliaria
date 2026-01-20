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
      role: UserRole.admin,
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
      role: UserRole.agent,
      status: UserStatus.active,
    },
  });

  console.log('✅ Agent user created:', {
    email: agent.email,
    role: agent.role,
    password: 'admin123 (change this after first login!)',
  });

  // Create landlord user
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@inmobiliaria.com' },
    update: {},
    create: {
      email: 'landlord@inmobiliaria.com',
      password: hashedPassword,
      name: 'Propietario de Inmueble',
      role: UserRole.landlord,
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
      role: UserRole.tenant,
      status: UserStatus.active,
    },
  });

  console.log('✅ Tenant user created:', {
    email: tenant.email,
    role: tenant.role,
    password: 'admin123 (change this after first login!)',
  });

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Summary:');
  console.log('  - Admin:    admin@inmobiliaria.com');
  console.log('  - Agent:    agent@inmobiliaria.com');
  console.log('  - Landlord: landlord@inmobiliaria.com');
  console.log('  - Tenant:   tenant@inmobiliaria.com');
  console.log('  - Password: admin123 (for all users)');
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
