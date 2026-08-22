-- CreateEnum
CREATE TYPE "LadoOperacao" AS ENUM ('COMPRA', 'VENDA');

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "ativo" TEXT NOT NULL,
    "lado" "LadoOperacao" NOT NULL,
    "precoEntrada" DOUBLE PRECISION NOT NULL,
    "precoSaida" DOUBLE PRECISION NOT NULL,
    "contratos" INTEGER NOT NULL,
    "resultadoPontos" DOUBLE PRECISION NOT NULL,
    "resultadoDolar" DOUBLE PRECISION NOT NULL,
    "retornoPercentual" DOUBLE PRECISION NOT NULL,
    "observacao" TEXT,
    "printUrl" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3),

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeEdicao" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "campoAlterado" TEXT NOT NULL,
    "valorAnterior" JSONB NOT NULL,
    "valorNovo" JSONB NOT NULL,
    "motivo" TEXT NOT NULL,
    "editadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeEdicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigAtivo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valorPorPonto" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigAtivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigGeral" (
    "id" TEXT NOT NULL DEFAULT 'config',
    "capitalReferencia" DOUBLE PRECISION NOT NULL,
    "metaMensalPercentual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "thresholdsSaude" JSONB NOT NULL DEFAULT '{}',
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigGeral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investidor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "capitalInicial" DOUBLE PRECISION,
    "dataInicio" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "investidorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "investidorId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Trade_data_idx" ON "Trade"("data");

-- CreateIndex
CREATE INDEX "Trade_publicado_idx" ON "Trade"("publicado");

-- CreateIndex
CREATE INDEX "TradeEdicao_tradeId_idx" ON "TradeEdicao"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigAtivo_nome_key" ON "ConfigAtivo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Investidor_email_key" ON "Investidor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "TradeEdicao" ADD CONSTRAINT "TradeEdicao_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_investidorId_fkey" FOREIGN KEY ("investidorId") REFERENCES "Investidor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_investidorId_fkey" FOREIGN KEY ("investidorId") REFERENCES "Investidor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
