import Alpine from "alpinejs";
import { getMe } from "./userRepo.js";

Alpine.store("user", {
  login: undefined,
  createdAt: undefined,
  roomId: undefined,
  _refresher: undefined,

  init() {
    window.addEventListener("authchange", () => this.refresh());
  },
  destroy() {
    window.removeEventListener("authchange", () => this.refresh());
  },
  async refresh() {
    try {
      const user = await getMe();

      this.login = user.login;
      this.roomId = user.room?.id;
      this.createdAt = user.createdAt;
    } catch (e) {
      const message = e.message ?? "Something went wrong";

      return message;
    }
  },
});
