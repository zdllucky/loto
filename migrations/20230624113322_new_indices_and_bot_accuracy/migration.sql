-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "accuracy" SET DEFAULT 9800;

-- CreateIndex
CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");

-- CreateIndex
CREATE INDEX "GameResult_createdAt_idx" ON "GameResult"("createdAt");

-- CreateIndex
CREATE INDEX "PlayerBallBind_createdAt_idx" ON "PlayerBallBind"("createdAt");

-- CreateIndex
CREATE INDEX "Room_createdAt_idx" ON "Room"("createdAt");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
