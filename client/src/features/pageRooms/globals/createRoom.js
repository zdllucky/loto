import Alpine from "alpinejs";

export default () => ({
  password: "",
  type: false,
  speed: "2",
  isLoading: false,
  async createRoom() {
    try {
      this.isLoading = true;
      await Alpine.$repo.rooms.createRoom({
        password: this.password,
        type: this.type ? "private" : "public",
        speed: Number(this.speed),
      });
      await Alpine.store("user").refresh();
      Alpine.$router.push("/room/await");
    } catch (e) {
      alert(e.message ?? "Something went wrong");
    } finally {
      this.isLoading = false;
    }
  },
});
