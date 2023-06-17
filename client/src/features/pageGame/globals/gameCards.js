import Alpine from "alpinejs";
import { getUserCards } from "../repositories/repoCards.js";

export default () => ({
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
});
