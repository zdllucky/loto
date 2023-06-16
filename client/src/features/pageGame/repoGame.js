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
