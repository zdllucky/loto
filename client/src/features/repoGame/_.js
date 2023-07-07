import Alpine from "alpinejs";

const getGamePlayerProgress = async () => {
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

const getGameBalls = async ({ gameId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query GameBallSet($gameId: ID) {
        gameBallSet(gameId: $gameId) {
          balls
          gameStatus
        }
      }`,
      variables: { gameId },
    }),
  });

  return (await res.json()).data.gameBallSet;
};

const getGameParams = async ({ gameId }) => {
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

const exitGame = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `mutation Mutation {
        exitGame {
          success
          message
        }
      }`,
    }),
  });

  return (await res.json()).data.exitGame;
};

const startGame = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `mutation StartGame {
          startGame {
            success
            message
          }
        }`,
      variables: {},
    }),
  });

  return (await res.json()).data.startGame;
};

Alpine.$repo.games = {
  exitGame,
  getGameBalls,
  getGameParams,
  getGamePlayerProgress,
  startGame,
};
