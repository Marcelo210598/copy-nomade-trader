/*
  Warnings:

  - You are about to drop the column `investidorId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `investidorId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Investidor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_investidorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_investidorId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "investidorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "investidorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Investidor";

-- CreateTable
CREATE TABLE "investidores" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "capitalInicial" DOUBLE PRECISION,
    "dataInicio" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investidores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investidores_email_key" ON "investidores"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "investidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
