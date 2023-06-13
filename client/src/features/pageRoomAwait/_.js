import Alpine from "alpinejs";

Alpine.data("waitRoom", () => ({
  room: undefined,
  remaining: 5,
  _refreshInterval: undefined,

  async init() {
    await this.refresh();
    this._refreshInterval = setInterval(() => this.refresh(), 1000);
  },
  destroy() {
    clearInterval(this._refreshInterval);
  },
  async refresh() {
    const roomId = Alpine.store("user").roomId;

    if (!roomId) {
      return Alpine.$router.push("/");
    }

    try {
      this.room = await Alpine.$repo.rooms.getRoom({
        roomId: Alpine.store("user").roomId,
      });

      this.remaining = 5 - this.room.users.length;
    } catch (e) {
      alert(e.message ?? "Something went wrong");
    }
  },
  exitRoom() {
    Alpine.$router.push("/room/all");
  },
}));
