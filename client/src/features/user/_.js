import Alpine from "alpinejs";
import { getMe } from "./userRepo.js";

Alpine.store("user", {
  login: undefined,
  createdAt: undefined,
  roomId: undefined,
  gameId: undefined,
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
      const user = await getMe();

      this.gameId = user.game?.id;
      this.login = user.login;
      this.roomId = user.room?.id;
      this.createdAt = user.createdAt;
    } catch (e) {
      return e.message ?? "Something went wrong";
    }
  },
});
