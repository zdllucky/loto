import Alpine from "alpinejs";

const getGameResult = async ({ gameId }) => {
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

const getPersonalStatsRating = async ({ offset = 60 * 60 * 24 * 30 }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query PersonalStatsRating($offset: Int!) {
          personalStatsRating(offset: $offset) {
            gamesPlayed
            offset
            skillRating
            winRating
          }
        }`,
      variables: {
        offset: offset,
      },
    }),
  });

  const { data } = await res.json();

  return data.personalStatsRating;
};

const getTotalStatsRating = async ({ offset, page } = {}) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query TotalStatsRating($offset: Int!, $page: Int!) {
          totalStatsRating(offset: $offset, page: $page) {
            leaders {
              login
              skillRating
              winRating
            }
            selfRating {
              winRating
              skillRating
            }
            offset
            page
          }
        }`,
      variables: {
        offset: offset ?? 60 * 60 * 24 * 30,
        page: page ?? 1,
      },
    }),
  });

  const { data } = await res.json();

  return data.totalStatsRating;
};

Alpine.$repo.results = {
  getGameResult,
  getPersonalStatsRating,
  getTotalStatsRating,
};
