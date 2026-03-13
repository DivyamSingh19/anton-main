/*
  Warnings:

  - You are about to drop the `Contracts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContractAttack" DROP CONSTRAINT "ContractAttack_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Contracts" DROP CONSTRAINT "Contracts_projectId_fkey";

-- DropTable
DROP TABLE "Contracts";

-- AddForeignKey
ALTER TABLE "ContractAttack" ADD CONSTRAINT "ContractAttack_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
