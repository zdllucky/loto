import Alpine from "alpinejs";
import { getRooms } from "./roomsRepo.js";
Alpine.data("roomsList", () => ({
  rooms: [],
  isLoading: false,
  _refreshInterval: undefined,
  async init() {
    await this.refresh();
    this._refreshInterval = setInterval(() => this.refresh(), 5000);
  },
  destroy() {
    clearInterval(this._refreshInterval);
  },
  async refresh() {
    try {
      this.isLoading = true;
      this.rooms = (await getRooms({ amount: 7 })).filter(
        ({ botsCount }) => botsCount < 5
      );
    } catch (e) {
      this.rooms = [];
      alert(e.message ?? "Something went wrong");
    } finally {
      this.isLoading = false;
    }
  },
}));
