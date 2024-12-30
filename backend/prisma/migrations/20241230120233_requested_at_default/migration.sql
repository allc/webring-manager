/*
  Warnings:

  - Made the column `requestedAt` on table `Website` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Website" ALTER COLUMN "addedAt" DROP NOT NULL,
ALTER COLUMN "addedAt" DROP DEFAULT,
ALTER COLUMN "requestedAt" SET NOT NULL,
ALTER COLUMN "requestedAt" SET DEFAULT CURRENT_TIMESTAMP;
