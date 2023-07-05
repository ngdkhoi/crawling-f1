/*
  Warnings:

  - A unique constraint covering the columns `[racerId]` on the table `RacerSchedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId]` on the table `RacerSchedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `RacerSchedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `completeTime` on the `RacerSchedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RacerSchedules" ADD COLUMN     "scheduleId" INTEGER NOT NULL,
DROP COLUMN "completeTime",
ADD COLUMN     "completeTime" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "place" TEXT,
ADD COLUMN     "season" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "RacerSchedules_racerId_key" ON "RacerSchedules"("racerId");

-- CreateIndex
CREATE UNIQUE INDEX "RacerSchedules_scheduleId_key" ON "RacerSchedules"("scheduleId");

-- AddForeignKey
ALTER TABLE "RacerSchedules" ADD CONSTRAINT "RacerSchedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
