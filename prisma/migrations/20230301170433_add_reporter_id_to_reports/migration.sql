/*
  Warnings:

  - A unique constraint covering the columns `[survivorId,reporterId]` on the table `reports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reporterId` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reports_survivorId_idx";

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "reporterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reports_survivorId_reporterId_key" ON "reports"("survivorId", "reporterId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "survivors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
