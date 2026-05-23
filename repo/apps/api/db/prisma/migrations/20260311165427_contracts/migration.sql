/*
  Warnings:

  - You are about to drop the `UserProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- DropTable
DROP TABLE "UserProject";

-- CreateTable
CREATE TABLE "UserProjects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_projectId_key" ON "Contracts"("projectId");

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
