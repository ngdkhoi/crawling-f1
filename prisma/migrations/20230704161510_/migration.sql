/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `Seasons` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RacerSchedules" ALTER COLUMN "pts" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seasons_year_key" ON "Seasons"("year");
