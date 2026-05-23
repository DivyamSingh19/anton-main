/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `ContractFingerPrint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `ContractFingerPrint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MONITORINGSTATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "ContractFingerPrint" ADD COLUMN     "adminFunctions" TEXT[],
ADD COLUMN     "allEvents" TEXT[],
ADD COLUMN     "allFunctions" TEXT[],
ADD COLUMN     "flowEvents" TEXT[],
ADD COLUMN     "governanceEvents" TEXT[],
ADD COLUMN     "governanceFunctions" TEXT[],
ADD COLUMN     "hasAdminChange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasEmergencyWithdraw" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFlashLoan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGovernance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highRiskEvents" TEXT[],
ADD COLUMN     "isPayable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payableFunctions" TEXT[],
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "valueFunctions" TEXT[];

-- AlterTable
ALTER TABLE "UserProjects" ADD COLUMN     "monitoringStatus" "MONITORINGSTATUS";

-- CreateTable
CREATE TABLE "UserMonitoringList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMonitoringList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMonitoringList_userId_projectId_key" ON "UserMonitoringList"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractFingerPrint_projectId_key" ON "ContractFingerPrint"("projectId");

-- AddForeignKey
ALTER TABLE "ContractFingerPrint" ADD CONSTRAINT "ContractFingerPrint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMonitoringList" ADD CONSTRAINT "UserMonitoringList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMonitoringList" ADD CONSTRAINT "UserMonitoringList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
