/*
  Warnings:

  - You are about to drop the `UserKillSwitches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTimeLocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserKillSwitches" DROP CONSTRAINT "UserKillSwitches_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTimeLocks" DROP CONSTRAINT "UserTimeLocks_userId_fkey";

-- DropTable
DROP TABLE "UserKillSwitches";

-- DropTable
DROP TABLE "UserTimeLocks";

-- CreateTable
CREATE TABLE "ProjectTimeLocks" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTimeLocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectKillSwitches" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectKillSwitches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectTimeLocks" ADD CONSTRAINT "ProjectTimeLocks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectKillSwitches" ADD CONSTRAINT "ProjectKillSwitches_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
