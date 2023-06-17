import Alpine from "alpinejs";
export const getSelectedBallsOnCards = async ({ cardIds }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query SelectedBalls($cardIds: [ID!]!) {
        selectedBalls(cardIds: $cardIds) {
          balls
          cardId
        }
      }`,
      variables: { cardIds },
    }),
  });

  const { data } = await res.json();

  return data?.selectedBalls;
};

export const selectBall = async ({ number, cardId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `mutation SelectBall($number: Int!, $cardId: ID!) {
        selectBall(number: $number, cardId: $cardId) {
          message
          success
        }
      }`,
      variables: {
        number,
        cardId,
      },
    }),
  });

  const { data } = await res.json();

  return data?.selectBall;
};
