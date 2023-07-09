/*
  Warnings:

  - You are about to drop the column `season` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `round` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "season",
ADD COLUMN     "round" INTEGER NOT NULL,
ADD COLUMN     "seasonId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
