-- CreateEnum
CREATE TYPE "UserLanguageType" AS ENUM ('unset', 'en', 'ru');

-- AlterTable
ALTER TABLE "GameResult" ADD COLUMN     "gameDifficulty" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "gameId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "winnerPlayerLogin" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" "UserLanguageType" NOT NULL DEFAULT 'unset';

-- CreateIndex
CREATE INDEX "GameResult_gameId_idx" ON "GameResult"("gameId");
