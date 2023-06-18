import { Worker } from "bullmq";
import { Queues } from "../consts";
import { Context } from ".keystone/types";
const finishGameProcedureWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.finishGameProcedure.name, async ({ data }) => {
    const { gameId } = data;
    const sCtx = context.sudo();

    const game = await sCtx.prisma.game.findUnique({
      where: { id: gameId },
      select: {
        id: true,
        gameStatus: true,
        resultId: true,
        from_Card_game: {
          select: {
            id: true,
            userId: true,
            botId: true,
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

    if (game.resultId)
      return { success: false, message: "Game already has result" };

    const winnerCard = game.from_Card_game.find(
      (card) => card._count.from_PlayerBallBind_card === 15
    );

    const res = await sCtx.prisma.gameResult.create({
      data: {
        game: { connect: { id: gameId } },
        createdAt: new Date(),
        winnerBotId: winnerCard?.botId,
        winnerUserId: winnerCard?.userId,
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
        users: { set: [] },
      },
    });

    return { success: true, winner: res.winnerBotId ?? res.winnerUserId };
  });

export default finishGameProcedureWorkerInit;
