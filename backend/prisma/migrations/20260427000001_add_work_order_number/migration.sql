-- AlterTable
ALTER TABLE "Visit" ADD COLUMN "workOrderNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Visit_workOrderNumber_key" ON "Visit"("workOrderNumber");
