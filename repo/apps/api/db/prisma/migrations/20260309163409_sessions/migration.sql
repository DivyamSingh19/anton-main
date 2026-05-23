/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `UserSessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `UserSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `UserSessions` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `UserSessions` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `lastLogin` on the `UserSessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "Integrations" ADD VALUE 'TELEGRAM';

-- DropForeignKey
ALTER TABLE "UserSessions" DROP CONSTRAINT "UserSessions_userId_fkey";

-- AlterTable
ALTER TABLE "UserSessions" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
DROP COLUMN "lastLogin",
ADD COLUMN     "lastLogin" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSessions_sessionToken_key" ON "UserSessions"("sessionToken");

-- CreateIndex
CREATE INDEX "UserSessions_userId_idx" ON "UserSessions"("userId");

-- AddForeignKey
ALTER TABLE "UserSessions" ADD CONSTRAINT "UserSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
