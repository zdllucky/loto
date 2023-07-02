import Alpine from "alpinejs";

export default () => ({
  rooms: [],
  isLoading: false,
  _refreshInterval: undefined,
  async init() {
    await this.refresh();
    this._refreshInterval = setInterval(
      () => document.hidden || this.refresh(),
      5000
    );
  },
  destroy() {
    clearInterval(this._refreshInterval);
  },
  async refresh() {
    try {
      this.isLoading = true;
      this.rooms = (await Alpine.$repo.rooms.getRooms({ amount: 7 })).filter(
        ({ botsCount }) => botsCount < 5
      );
    } catch (e) {
      this.rooms = [];
      alert(e.message ?? "Something went wrong");
    } finally {
      this.isLoading = false;
    }
  },
});
