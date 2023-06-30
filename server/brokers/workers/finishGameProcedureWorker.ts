import { Worker } from "bullmq";
import { connection, Queues } from "../consts";
import { Context } from ".keystone/types";
const finishGameProcedureWorkerInit = ({ context }: { context: Context }) =>
  new Worker(
    Queues.finishGameProcedure.name,
    async ({ data }) => {
      const { gameId } = data;
      const sCtx = context.sudo();

      const game = await sCtx.prisma.game.findUnique({
        where: { id: gameId },
        select: {
          id: true,
          gameStatus: true,
          speed: true,
          users: {
            select: {
              id: true,
            },
          },
          from_Card_game: {
            select: {
              id: true,
              user: {
                select: {
                  login: true,
                },
              },
              bot: {
                select: {
                  login: true,
                },
              },
              _count: {
                select: {
                  from_PlayerBallBind_card: true,
                },
              },
            },
          },
        },
      });

      if (!game) return { success: false, message: "Game not found" };

      if (game.gameStatus !== "finished")
        return { success: false, message: "Game has not been finished" };

      const winnerCard = game.from_Card_game.find(
        (card) => card._count.from_PlayerBallBind_card === 15
      );

      const winnerPlayerLogin =
        winnerCard?.user?.login ?? winnerCard?.bot?.login;

      let res: any;

      const resultRef = await sCtx.prisma.gameResult.findFirst({
        where: { gameId },
        select: { id: true },
      });

      if (resultRef)
        res = await sCtx.prisma.gameResult.update({
          where: { id: resultRef.id },
          data: {
            winnerPlayerLogin,
            createdAt: new Date(),
            players: {
              connect: game.users,
            },
          },
        });
      else
        res = await sCtx.prisma.gameResult.create({
          data: {
            createdAt: new Date(),
            winnerPlayerLogin,
            gameId,
            gameDifficulty: game.speed,
            players: {
              connect: game.users,
            },
          },
        });

      await sCtx.prisma.card.deleteMany({
        where: { gameId },
      });

      await sCtx.prisma.playerBallBind.deleteMany({
        where: { gameId },
      });

      await sCtx.prisma.game.update({
        where: { id: gameId },
        data: {
          bots: { deleteMany: { gameId } },
        },
      });

      await sCtx.prisma.game.delete({ where: { id: gameId } });

      return { success: true, winner: res.winnerPlayerLogin };
    },
    {
      connection,
      removeOnComplete: {
        count: 1000,
      },
      removeOnFail: {
        count: 1000,
      },
    }
  );

export default finishGameProcedureWorkerInit;
