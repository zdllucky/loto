import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";

const exitGameMutation: Extension = () => {
  const ExitGameResult = graphql.object<{
    success: boolean;
    message: string | undefined;
  }>()({
    name: "ExitGameResult",
    fields: {
      success: graphql.field({ type: graphql.nonNull(graphql.Boolean) }),
      message: graphql.field({ type: graphql.String }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(ExitGameResult),
    resolve: async (rootVal, args, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "server.unauthorized" };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          game: {
            select: {
              id: true,
              _count: {
                select: {
                  users: true,
                },
              },
              gameStatus: true,
              speed: true,
            },
          },
        },
      });

      if (!user) return { success: false, message: "server.userNotFound" };

      if (!user.game)
        return { success: false, message: "server.game.notPlayer" };

      if (user.game.gameStatus === "finished")
        return { success: true, message: "server.game.finishedAlready" };

      await sCtx.prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: userId },
          data: {
            game: {
              disconnect: true,
            },
          },
        });

        await prisma.gameResult.create({
          data: {
            gameId: user.game?.id,
            gameDifficulty: user.game?.speed,
            createdAt: new Date(),
            players: {
              connect: {
                id: userId,
              },
            },
          },
        });
      });

      await sCtx.prisma.user.update({
        where: { id: userId },
        data: {
          game: {
            disconnect: true,
          },
        },
      });

      if (user.game._count.users <= 1) {
        await sCtx.prisma.game.update({
          where: { id: user.game.id },
          data: {
            gameStatus: "finished",
          },
        });

        return { success: true, message: "server.game.exitAndFinish" };
      }

      return { success: true, message: "server.game.exit" };
    },
  });
};

export default exitGameMutation;
