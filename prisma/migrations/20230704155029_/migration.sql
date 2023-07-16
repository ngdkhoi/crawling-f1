/*
  Warnings:

  - Added the required column `year` to the `Seasons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seasons" ADD COLUMN     "racerId" INTEGER[],
ADD COLUMN     "year" INTEGER NOT NULL;
