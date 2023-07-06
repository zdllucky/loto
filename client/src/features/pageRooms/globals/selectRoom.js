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
      alert(e.message ?? "Something went wrong");
    } finally {
      this.isLoading = false;
    }
  },
});
