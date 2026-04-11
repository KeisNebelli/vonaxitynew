-- CreateTable
CREATE TABLE IF NOT EXISTS "VisitApplication" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VisitApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VisitApplication_visitId_nurseId_key" ON "VisitApplication"("visitId", "nurseId");

-- AddForeignKey
ALTER TABLE "VisitApplication" ADD CONSTRAINT "VisitApplication_visitId_fkey" 
    FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitApplication" ADD CONSTRAINT "VisitApplication_nurseId_fkey" 
    FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
