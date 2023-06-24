import Alpine from "alpinejs";
import { exitGame } from "../repositories/repoGame.js";
export default () => ({
  async "@click"() {
    if (confirm("Are you sure you want to exit?")) {
      try {
        const { message, success } = await exitGame();

        if (!success) {
          throw new Error(message);
        }
      } catch (e) {
        alert(e.message);
      } finally {
        Alpine.$router.push("/");
      }
    }
  },
});
