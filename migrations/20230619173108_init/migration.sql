-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "GameGameStatusType" AS ENUM ('waiting', 'playing', 'finished');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL DEFAULT '',
    "role" "UserRoleType" NOT NULL DEFAULT 'user',
    "room" TEXT,
    "game" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "speed" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL DEFAULT '',
    "room" TEXT,
    "accuracy" INTEGER DEFAULT 9999,
    "game" TEXT,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "speed" INTEGER NOT NULL DEFAULT 2,
    "result" TEXT,
    "gameStatus" "GameGameStatusType" DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "step" INTEGER NOT NULL DEFAULT 0,
    "balls" JSONB DEFAULT '[]',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBallBind" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "bot" TEXT,
    "number" INTEGER NOT NULL,
    "card" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "game" TEXT,

    CONSTRAINT "PlayerBallBind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "game" TEXT,
    "user" TEXT,
    "bot" TEXT,
    "numbers" JSONB,
    "board" JSONB,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameResult" (
    "id" TEXT NOT NULL,
    "winnerBotLogin" TEXT NOT NULL DEFAULT '',
    "winnerUser" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_room_idx" ON "User"("room");

-- CreateIndex
CREATE INDEX "User_game_idx" ON "User"("game");

-- CreateIndex
CREATE UNIQUE INDEX "Bot_login_key" ON "Bot"("login");

-- CreateIndex
CREATE INDEX "Bot_room_idx" ON "Bot"("room");

-- CreateIndex
CREATE INDEX "Bot_game_idx" ON "Bot"("game");

-- CreateIndex
CREATE UNIQUE INDEX "Game_result_key" ON "Game"("result");

-- CreateIndex
CREATE INDEX "PlayerBallBind_user_idx" ON "PlayerBallBind"("user");

-- CreateIndex
CREATE INDEX "PlayerBallBind_bot_idx" ON "PlayerBallBind"("bot");

-- CreateIndex
CREATE INDEX "PlayerBallBind_number_idx" ON "PlayerBallBind"("number");

-- CreateIndex
CREATE INDEX "PlayerBallBind_card_idx" ON "PlayerBallBind"("card");

-- CreateIndex
CREATE INDEX "PlayerBallBind_game_idx" ON "PlayerBallBind"("game");

-- CreateIndex
CREATE INDEX "Card_game_idx" ON "Card"("game");

-- CreateIndex
CREATE INDEX "Card_user_idx" ON "Card"("user");

-- CreateIndex
CREATE INDEX "Card_bot_idx" ON "Card"("bot");

-- CreateIndex
CREATE INDEX "GameResult_winnerUser_idx" ON "GameResult"("winnerUser");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_room_fkey" FOREIGN KEY ("room") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_game_fkey" FOREIGN KEY ("game") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_room_fkey" FOREIGN KEY ("room") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_game_fkey" FOREIGN KEY ("game") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_result_fkey" FOREIGN KEY ("result") REFERENCES "GameResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBallBind" ADD CONSTRAINT "PlayerBallBind_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBallBind" ADD CONSTRAINT "PlayerBallBind_bot_fkey" FOREIGN KEY ("bot") REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBallBind" ADD CONSTRAINT "PlayerBallBind_card_fkey" FOREIGN KEY ("card") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBallBind" ADD CONSTRAINT "PlayerBallBind_game_fkey" FOREIGN KEY ("game") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_game_fkey" FOREIGN KEY ("game") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_bot_fkey" FOREIGN KEY ("bot") REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_winnerUser_fkey" FOREIGN KEY ("winnerUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
