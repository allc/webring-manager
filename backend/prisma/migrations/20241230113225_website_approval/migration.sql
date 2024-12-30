/*
  Warnings:

  - A unique constraint covering the columns `[ordering]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Website_ordering_key" ON "Website"("ordering");
