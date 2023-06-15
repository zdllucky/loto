import Alpine from "alpinejs";
import { getUserCards } from "./repoCards.js";

Alpine.data("gameCards", () => ({
  cards: undefined,
  init() {
    this.loadCards();
  },
  async loadCards() {
    try {
      this.cards = await getUserCards({ userId: Alpine.store("user").id });
    } catch (e) {
      this.cards = undefined;
    }
  },
}));
