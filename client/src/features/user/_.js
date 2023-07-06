import Alpine from "alpinejs";

Alpine.store("user", {
  login: undefined,
  createdAt: undefined,
  roomId: undefined,
  gameId: undefined,
  lang: undefined,
  theme: Alpine.$persist(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  ).as("user_theme"),
  _refresher: undefined,

  init() {
    if (Alpine.store("auth").token) {
      this.refresh();
    }
    window.addEventListener("authchange", async ({ detail: { hasAuth } }) => {
      await this.refresh(!hasAuth);
    });
  },
  destroy() {
    window.removeEventListener(
      "authchange",
      async ({ detail: { hasAuth } }) => {
        await this.refresh(!hasAuth);
      }
    );
  },
  async refresh(doCleanup = false) {
    try {
      if (doCleanup || !Alpine.store("auth").token) throw Error("unauthed");
      const user = await Alpine.$repo.user.getMe();

      this.lang = user.language;
      this.gameId = user.game?.id;
      this.login = user.login;
      this.roomId = user.room?.id;
      this.createdAt = user.createdAt;
    } catch (e) {
      e.message === "unauthed" || Alpine.store("auth").signOut();

      this.lang = undefined;
      this.gameId = undefined;
      this.login = undefined;
      this.roomId = undefined;
      this.createdAt = undefined;

      return e.message ?? "Something went wrong";
    }
  },
});
