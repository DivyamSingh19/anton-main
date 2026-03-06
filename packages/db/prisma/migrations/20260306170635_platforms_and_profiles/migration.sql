/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Engineer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "Engineer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineerProfile" (
    "id" TEXT NOT NULL,
    "engineerId" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "EngineerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlatforms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "platformUserId" TEXT NOT NULL,

    CONSTRAINT "UserPlatforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Engineer_email_key" ON "Engineer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_adminId_key" ON "AdminProfile"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "EngineerProfile_engineerId_key" ON "EngineerProfile"("engineerId");

-- AddForeignKey
ALTER TABLE "Engineer" ADD CONSTRAINT "Engineer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineerProfile" ADD CONSTRAINT "EngineerProfile_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "Engineer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlatforms" ADD CONSTRAINT "UserPlatforms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
