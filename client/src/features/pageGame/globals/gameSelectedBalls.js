import {
  getSelectedBallsOnCards,
  selectBall,
} from "../repositories/repoBalls.js";

export default ({ cardIds }) => ({
  selectedBalls: [],
  clickedBalls: [],
  async init() {
    this.selectedBalls = await getSelectedBallsOnCards({ cardIds });
  },
  async selectBall({ number, cardId }) {
    this.clickedBalls = [...this.clickedBalls, { number, cardId }];
    const { success, message } = await selectBall({ number, cardId });

    if (success) {
      this.selectedBalls = [
        this.selectedBalls.filter(({ cardId: cId }) => cId !== cardId),
        ...(await getSelectedBallsOnCards({ cardIds: [cardId] })),
      ];
    }

    this.clickedBalls = this.clickedBalls.filter(
      ({ number, cardId }) => !(number === number && cardId === cardId)
    );
  },
});
