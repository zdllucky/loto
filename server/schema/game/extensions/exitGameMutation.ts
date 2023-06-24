import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";
import { Context } from ".keystone/types";

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
    resolve: async (rootVal, args, context: Context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "Unauthorized" };

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
            },
          },
        },
      });

      if (!user) return { success: false, message: "User not found" };

      if (!user.game) return { success: false, message: "User not in game" };

      if (user.game.gameStatus === "finished")
        return { success: true, message: "Game already finished." };

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

        return { success: true, message: "Exited. Game finished." };
      }

      return { success: true, message: "Exited." };
    },
  });
};

export default exitGameMutation;
