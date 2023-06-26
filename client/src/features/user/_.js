import Alpine from "alpinejs";

Alpine.store("user", {
  login: undefined,
  createdAt: undefined,
  roomId: undefined,
  gameId: undefined,
  lang: undefined,
  _refresher: undefined,

  init() {
    if (Alpine.store("auth").token) {
      this.refresh();
    }
    window.addEventListener("authchange", () => this.refresh());
  },
  destroy() {
    window.removeEventListener("authchange", () => this.refresh());
  },
  async refresh() {
    try {
      if (!Alpine.store("auth").token) throw Error("Not authenticated");
      const user = await Alpine.$repo.user.getMe();

      this.lang = user.language;
      this.gameId = user.game?.id;
      this.login = user.login;
      this.roomId = user.room?.id;
      this.createdAt = user.createdAt;
    } catch (e) {
      Alpine.store("auth").signOut();

      this.lang = undefined;
      this.gameId = undefined;
      this.login = undefined;
      this.roomId = undefined;
      this.createdAt = undefined;

      return e.message ?? "Something went wrong";
    }
  },
});
