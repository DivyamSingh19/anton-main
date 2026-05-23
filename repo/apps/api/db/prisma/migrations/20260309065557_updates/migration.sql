/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `Engineer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platformName` on the `UserPlatforms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Integrations" AS ENUM ('DISCORD', 'SLACK');

-- AlterTable
ALTER TABLE "Engineer" ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserPlatforms" DROP COLUMN "platformName",
ADD COLUMN     "platformName" "Integrations" NOT NULL;

-- CreateTable
CREATE TABLE "UserWallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineerWallet" (
    "id" TEXT NOT NULL,
    "engineerId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineerWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationWallet" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminWallet" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWallets_userId_key" ON "UserWallets"("userId");

-- CreateIndex
CREATE INDEX "UserWallets_id_idx" ON "UserWallets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EngineerWallet_engineerId_key" ON "EngineerWallet"("engineerId");

-- CreateIndex
CREATE INDEX "EngineerWallet_id_idx" ON "EngineerWallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationWallet_orgId_key" ON "OrganizationWallet"("orgId");

-- CreateIndex
CREATE INDEX "OrganizationWallet_id_idx" ON "OrganizationWallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminWallet_adminId_key" ON "AdminWallet"("adminId");

-- CreateIndex
CREATE INDEX "AdminWallet_id_idx" ON "AdminWallet"("id");

-- CreateIndex
CREATE INDEX "Engineer_id_idx" ON "Engineer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserWallets" ADD CONSTRAINT "UserWallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineerWallet" ADD CONSTRAINT "EngineerWallet_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "Engineer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationWallet" ADD CONSTRAINT "OrganizationWallet_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWallet" ADD CONSTRAINT "AdminWallet_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
