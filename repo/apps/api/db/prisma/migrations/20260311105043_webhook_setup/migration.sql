/*
  Warnings:

  - You are about to drop the `UserPlatforms` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `EngineerWallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletAddress]` on the table `OrganizationWallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletAddress]` on the table `UserWallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EngineerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('INITIALIZED', 'COMPLETED', 'SKIPPED');

-- DropForeignKey
ALTER TABLE "UserPlatforms" DROP CONSTRAINT "UserPlatforms_userId_fkey";

-- AlterTable
ALTER TABLE "AdminProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EngineerProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileStatus" "ProfileStatus" NOT NULL DEFAULT 'SKIPPED';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "UserPlatforms";

-- DropEnum
DROP TYPE "Integrations";

-- CreateTable
CREATE TABLE "UserWebHooks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slackurl" TEXT,
    "discordUrl" TEXT,

    CONSTRAINT "UserWebHooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EngineerWallet_walletAddress_key" ON "EngineerWallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationWallet_walletAddress_key" ON "OrganizationWallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserWallets_walletAddress_key" ON "UserWallets"("walletAddress");

-- AddForeignKey
ALTER TABLE "UserWebHooks" ADD CONSTRAINT "UserWebHooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
