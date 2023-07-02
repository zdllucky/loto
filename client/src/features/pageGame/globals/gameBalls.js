import Alpine from "alpinejs";

export default () => ({
  balls: [],
  gameStatus: "waiting",
  refreshIntervalId: undefined,
  speed: undefined,
  async init() {
    const intervalId = setInterval(async () => {
      if (Alpine.store("user")?.gameId) {
        clearInterval(intervalId);

        const { speed } = await Alpine.$repo.games.getGameParams({
          gameId: Alpine.store("user").gameId,
        });

        this.speed = speed;

        await this.loadBalls();

        this.refreshIntervalId = setInterval(
          () => document.hidden || this.loadBalls(),
          Math.floor(12000 / this.speed) + 2
        );
      }
    }, 10);
  },
  destroy() {
    clearInterval(this.refreshIntervalId);
  },
  async loadBalls() {
    try {
      const { balls, gameStatus } = await Alpine.$repo.games.getGameBalls();

      this.balls = balls;
      this.gameStatus = gameStatus;

      if (this.gameStatus === "finished" || this.gameStatus === "undefined") {
        clearInterval(this.refreshIntervalId);
        setTimeout(async () => {
          const result = await Alpine.$repo.results.getGameResult({
            gameId: Alpine.store("user").gameId,
          });

          alert(
            `${Alpine.store("loc").l.pageGame.winnerMessage}${
              result.winnerPlayerLogin
            }!`
          );
          Alpine.$router.push("/");
        }, 2000);
      }
    } catch (e) {
      this.balls = [];
    }
  },
});
