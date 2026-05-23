/*
  Warnings:

  - Added the required column `updatedAt` to the `UserWebHooks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserWebHooks" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "UserWebHooks_userId_slackurl_idx" ON "UserWebHooks"("userId", "slackurl");

-- CreateIndex
CREATE INDEX "UserWebHooks_userId_discordUrl_idx" ON "UserWebHooks"("userId", "discordUrl");
