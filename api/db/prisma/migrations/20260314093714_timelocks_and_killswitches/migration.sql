-- CreateTable
CREATE TABLE "UserTimeLocks" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTimeLocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserKillSwitches" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserKillSwitches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTimeLocks" ADD CONSTRAINT "UserTimeLocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKillSwitches" ADD CONSTRAINT "UserKillSwitches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
