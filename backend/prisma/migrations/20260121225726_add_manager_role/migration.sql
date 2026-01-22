-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'manager';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "rooms" INTEGER NOT NULL DEFAULT 0;
