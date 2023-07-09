/*
  Warnings:

  - You are about to drop the column `teanId` on the `racers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "racers" DROP CONSTRAINT "racers_teanId_fkey";

-- AlterTable
ALTER TABLE "racers" DROP COLUMN "teanId",
ADD COLUMN     "teamId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "racers" ADD CONSTRAINT "racers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
