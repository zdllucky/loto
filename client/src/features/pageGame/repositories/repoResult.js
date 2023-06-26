import Alpine from "alpinejs";

export const getGameResult = async ({ gameId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query Game($where: GameResultWhereInput!) {
          gameResults(where: $where) {
            winnerPlayerLogin
          }
        }`,
      variables: {
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        where: {
          gameId: {
            equals: gameId,
          },
        },
      },
    }),
  });

  const { data } = await res.json();

  if (!data.gameResults.length) {
    throw new Error("Game result not found");
  }

  return data.gameResults[0];
};
