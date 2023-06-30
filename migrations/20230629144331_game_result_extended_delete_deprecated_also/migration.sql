/*
  Warnings:

  - You are about to drop the column `result` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerBotLogin` on the `GameResult` table. All the data in the column will be lost.
  - You are about to drop the column `winnerUser` on the `GameResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_result_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_winnerUser_fkey";

-- DropIndex
DROP INDEX "Game_result_key";

-- DropIndex
DROP INDEX "GameResult_winnerUser_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "result";

-- AlterTable
ALTER TABLE "GameResult" DROP COLUMN "winnerBotLogin",
DROP COLUMN "winnerUser";

-- CreateTable
CREATE TABLE "_GameResult_players" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameResult_players_AB_unique" ON "_GameResult_players"("A", "B");

-- CreateIndex
CREATE INDEX "_GameResult_players_B_index" ON "_GameResult_players"("B");

-- AddForeignKey
ALTER TABLE "_GameResult_players" ADD CONSTRAINT "_GameResult_players_A_fkey" FOREIGN KEY ("A") REFERENCES "GameResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameResult_players" ADD CONSTRAINT "_GameResult_players_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
