import Alpine from "alpinejs";

export default () => ({
  isLoading: false,
  async selectRoom(roomId) {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.selectRoom({ roomId });
      await Alpine.store("user").refresh();
      Alpine.$router.replace("/room/await");
    } catch (e) {
      alert(Alpine.store("loc").t(e.message));
    } finally {
      this.isLoading = false;
    }
  },
});
