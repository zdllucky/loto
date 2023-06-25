/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RoomTypeType" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "owner" TEXT,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" "RoomTypeType" DEFAULT 'public',
ALTER COLUMN "speed" SET DEFAULT 3;

-- CreateIndex
CREATE UNIQUE INDEX "Room_owner_key" ON "Room"("owner");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
