-- AlterTable
ALTER TABLE "Nurse" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "diplomaUrl" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "issuingAuthority" TEXT,
ADD COLUMN     "languages" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "licenseUrl" TEXT,
ADD COLUMN     "profilePhotoUrl" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "services" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "specialties" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ALTER COLUMN "city" SET DEFAULT '';
