/*
  Warnings:

  - A unique constraint covering the columns `[txId]` on the table `UserWallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `txId` to the `UserWallets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserWallets_id_idx";

-- AlterTable
ALTER TABLE "UserWallets" ADD COLUMN     "txId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserWallets_txId_key" ON "UserWallets"("txId");

-- CreateIndex
CREATE INDEX "UserWallets_userId_idx" ON "UserWallets"("userId");
