-- AlterTable
ALTER TABLE "racers" ALTER COLUMN "href" DROP NOT NULL,
ALTER COLUMN "avatarUrl" DROP NOT NULL,
ALTER COLUMN "teanId" SET DEFAULT 0;
