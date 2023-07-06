import Alpine from "alpinejs";

export default () => ({
  password: "",
  isLoading: false,
  roomId: "",
  async join() {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.joinPrivateRoom({
        roomId: this.roomId,
        password: this.password,
      });
      await Alpine.store("user").refresh();
      Alpine.$router.replace("/room/await");
    } catch (e) {
      alert(e.message ?? "Something went wrong");
    } finally {
      this.isLoading = false;
    }
  },
});
