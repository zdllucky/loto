import { Worker } from "bullmq";
import { Queues } from "../consts";
import { Context } from ".keystone/types";
import {
  generateLottoCards,
  generateRandomUniqueNumbersArray,
} from "./_misc/helpers";

const createGameProcedureWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.createGameProcedure.name, async ({ data }) => {
    const sCtx = context.sudo();

    const { roomId } = data;

    const res = await sCtx.prisma.$transaction(async (prisma) => {
      // Validate that the room create event is still valid to create a game
      // 1. The game was not already created (room exists)
      // 2. The room has at least 5 users
      // 3. The room has at least 1 user that is not a bot

      const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: {
          _count: { select: { bots: true, users: true } },
          bots: { select: { id: true } },
          users: { select: { id: true } },
        },
      });

      if (!room) return { message: "Room does not exist" };

      if (room._count.bots + room._count.users < 5)
        return { message: "Room does not have enough users" };

      if (room._count.users === 0)
        return { message: "Room does not have any users" };

      // Create the game
      // 1. Create the game
      // 2. Create the game cards

      const game = await prisma.game.create({
        data: {
          speed: room.speed || 2,
          createdAt: new Date(),
          users: { connect: room.users.map((user) => ({ id: user.id })) },
          bots: { connect: room.bots.map((bot) => ({ id: bot.id })) },
          balls: { create: generateRandomUniqueNumbersArray(90) },
          step: 0,
        },
      });

      const cardsAmountToCreate = 15;

      const cards = generateLottoCards({ amount: cardsAmountToCreate });

      const cardsCreateData = [
        ...room.users
          .map((user, index) =>
            Array(3)
              .fill(undefined)
              .map((_, i) => {
                return {
                  userId: user.id,
                  gameId: game.id,
                  numbers: cards[index * i].flat(2).filter((n) => n !== 0),

                  board: cards[index * i],
                };
              })
          )
          .flat(),

        ...room.bots
          .map((bot, index) =>
            Array(3)
              .fill(undefined)
              .map((_, i) => {
                return {
                  botId: bot.id,
                  gameId: game.id,
                  numbers: cards[room._count.users * 3 + index * i]
                    .flat(2)
                    .filter((n) => n !== 0),

                  board: cards[room._count.users * 3 + index * i],
                };
              })
          )
          .flat(),
      ];

      const gameCards = await prisma.card.createMany({
        data: cardsCreateData,
      });

      await prisma.room.deleteMany({ where: { id: roomId } });

      return { game, gameCards };
    });

    return { res };
  });

export default createGameProcedureWorkerInit;
