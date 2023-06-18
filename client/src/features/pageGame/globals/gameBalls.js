import Alpine from "alpinejs";
import { getGameBalls, getGameParams } from "../repositories/repoGame.js";

export default () => ({
  balls: [],
  refreshIntervalId: undefined,
  speed: undefined,
  async init() {
    const intervalId = setInterval(async () => {
      if (Alpine.store("user")?.gameId) {
        clearInterval(intervalId);

        const { speed } = await getGameParams({
          gameId: Alpine.store("user").gameId,
        });

        this.speed = speed;

        await this.loadBalls();

        this.refreshIntervalId = setInterval(
          () => this.loadBalls(),
          16000 / this.speed
        );
      }
    }, 10);
  },
  destroy() {
    clearInterval(this.refreshIntervalId);
  },
  async loadBalls() {
    try {
      this.balls = await getGameBalls();
    } catch (e) {
      this.balls = [];
    }
  },
});
