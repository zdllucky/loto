import Alpine from "alpinejs";

Alpine.data("waitRoom", () => ({
  room: undefined,
  remaining: 5,
  _refreshInterval: undefined,
  hideStartButton: false,

  async init() {
    await this.refresh();
    this._refreshInterval = setInterval(
      () => document.hidden || this.refresh(),
      1000
    );
  },
  destroy() {
    clearInterval(this._refreshInterval);
  },
  async refresh() {
    const roomId = Alpine.store("user").roomId;

    try {
      if (!roomId) throw new Error("No room provided");

      this.room = await Alpine.$repo.rooms.getRoom({
        roomId: roomId,
      });

      if (!this.room) throw new Error("No room provided");

      this.remaining = 5 - this.room.users.length;
    } catch (e) {
      await Alpine.store("user").refresh();

      if (Alpine.store("user").gameId) return Alpine.$router.replace("/game");

      if (!Alpine.store("user").login) Alpine.$router.replace("/");
    }
  },
  async startGame() {
    try {
      await Alpine.$repo.games.startGame();
      this.hideStartButton = true;
    } catch (e) {
      alert(Alpine.store("loc").t(e.message));

      Alpine.$router.replace("/");
    }
  },
  async exitRoom() {
    try {
      await Alpine.$repo.rooms.exitRoom();
      Alpine.$router.replace("/room/all");
      await Alpine.store("user").refresh();
    } catch (e) {
      alert(Alpine.store("loc").t(e.message));

      Alpine.$router.replace("/");
    }
  },
}));
