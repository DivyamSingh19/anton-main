/*
  Warnings:

  - A unique constraint covering the columns `[slackurl]` on the table `UserWebHooks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordUrl]` on the table `UserWebHooks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserWebHooks_slackurl_key" ON "UserWebHooks"("slackurl");

-- CreateIndex
CREATE UNIQUE INDEX "UserWebHooks_discordUrl_key" ON "UserWebHooks"("discordUrl");
