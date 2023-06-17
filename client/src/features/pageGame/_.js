import Alpine from "alpinejs";
import { getUserCards } from "./repoCards.js";
import {
  getGameBalls,
  getGameParams,
  getGamePlayerProgress,
} from "./repoGame.js";

Alpine.data("gameCards", () => ({
  cards: [],
  init() {
    const intervalId = setInterval(() => {
      if (Alpine.store("user")?.login) {
        clearInterval(intervalId);
        this.loadCards();
      }
    }, 10);
  },
  async loadCards() {
    try {
      this.cards = await getUserCards({ login: Alpine.store("user").login });
    } catch (e) {
      this.cards = [];
    }
  },
}));

Alpine.data("gamePlayerProgress", () => ({
  playersProgress: [],
  refreshIntervalId: undefined,
  init() {
    this.loadProgress();

    this.refreshIntervalId = setInterval(() => this.loadProgress(), 5000);
  },
  destroy() {
    clearInterval(this.refreshIntervalId);
  },
  async loadProgress() {
    try {
      this.playersProgress = chunkArray(await getGamePlayerProgress(), 2);
    } catch (e) {
      this.playersProgress = [];
    }
  },
}));

Alpine.data("gameBalls", () => ({
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
          2000 / this.speed
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
}));

function chunkArray(array, chunkSize) {
  let results = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }

  return results;
}
