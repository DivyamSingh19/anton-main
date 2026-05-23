-- CreateTable
CREATE TABLE "ContractAttack" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "alertsGenerated" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractAttack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractAttack_contractId_idx" ON "ContractAttack"("contractId");

-- AddForeignKey
ALTER TABLE "ContractAttack" ADD CONSTRAINT "ContractAttack_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
