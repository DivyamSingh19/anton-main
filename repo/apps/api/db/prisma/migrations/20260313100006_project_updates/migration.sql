/*
  Warnings:

  - Added the required column `abi` to the `UserProjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractAddress` to the `UserProjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProjects" ADD COLUMN     "abi" JSONB NOT NULL,
ADD COLUMN     "contractAddress" TEXT NOT NULL;
