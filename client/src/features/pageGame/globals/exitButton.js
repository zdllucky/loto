import Alpine from "alpinejs";

export default () => ({
  async "@click"() {
    if (confirm(Alpine.store("loc").l.pageGame.actions.ensureLeave)) {
      try {
        const { message, success } = await Alpine.$repo.games.exitGame();

        if (!success) {
          throw new Error(message);
        }
      } catch (e) {
        alert(Alpine.store("loc").t(e.message));
      } finally {
        Alpine.$router.replace("/");
      }
    }
  },
});
