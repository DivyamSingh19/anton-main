-- CreateTable
CREATE TABLE "EngineerSessions" (
    "id" TEXT NOT NULL,
    "engineerId" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineerSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSessions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSessions" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractFingerPrint" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractFingerPrint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EngineerSessions_sessionToken_key" ON "EngineerSessions"("sessionToken");

-- CreateIndex
CREATE INDEX "EngineerSessions_engineerId_idx" ON "EngineerSessions"("engineerId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSessions_sessionToken_key" ON "OrganizationSessions"("sessionToken");

-- CreateIndex
CREATE INDEX "OrganizationSessions_organizationId_idx" ON "OrganizationSessions"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSessions_sessionToken_key" ON "AdminSessions"("sessionToken");

-- CreateIndex
CREATE INDEX "AdminSessions_adminId_idx" ON "AdminSessions"("adminId");

-- CreateIndex
CREATE INDEX "Admin_id_idx" ON "Admin"("id");

-- CreateIndex
CREATE INDEX "Organization_id_idx" ON "Organization"("id");

-- AddForeignKey
ALTER TABLE "EngineerSessions" ADD CONSTRAINT "EngineerSessions_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "Engineer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSessions" ADD CONSTRAINT "OrganizationSessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSessions" ADD CONSTRAINT "AdminSessions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
