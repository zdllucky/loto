import Alpine from "alpinejs";
export const getUserCards = async ({ login }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query Cards($where: CardWhereInput!) {
          cards(where: $where) {
            board
            id
          }
        }`,
      variables: {
        where: { user: { login: { equals: login } } },
      },
    }),
  });

  const { data } = await res.json();

  return data?.cards;
};
