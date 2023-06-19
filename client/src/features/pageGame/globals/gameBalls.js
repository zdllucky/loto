import Alpine from "alpinejs";
import { getGameBalls, getGameParams } from "../repositories/repoGame.js";
import { getGameResult } from "../repositories/repoResult.js";

export default () => ({
  balls: [],
  gameStatus: "waiting",
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
      const { balls, gameStatus } = await getGameBalls();

      this.balls = balls;
      this.gameStatus = gameStatus;

      if (this.gameStatus === "finished" || this.gameStatus === "undefined") {
        clearInterval(this.refreshIntervalId);
        setTimeout(async () => {
          const result = await getGameResult({
            gameId: Alpine.store("user").gameId,
          });

          const shouldExit = confirm(
            `Game finished! Winner: ${
              result.winnerBotLogin ?? result.winnerUser.login
            }!`
          );
          shouldExit && Alpine.$router.push("/");
        }, 2000);
      }
    } catch (e) {
      this.balls = [];
    }
  },
});
