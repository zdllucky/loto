import Alpine from "alpinejs";
export const getGamePlayerProgress = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query GamePlayerProgress {
        gamePlayerProgress {
          id
          login
          progress
        }
      }`,
    }),
  });

  return (await res.json()).data.gamePlayerProgress;
};

export const getGameBalls = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query Query {
        gameBallSet {
          balls
          gameStatus
        }
      }`,
    }),
  });

  return (await res.json()).data.gameBallSet;
};

export const getGameParams = async ({ gameId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query Game($where: GameWhereUniqueInput!) {
        game(where: $where) {
          speed
        }
      }`,
      variables: {
        where: {
          id: gameId,
        },
      },
    }),
  });

  return (await res.json()).data.game;
};
