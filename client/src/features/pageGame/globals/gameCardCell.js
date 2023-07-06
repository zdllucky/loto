export default () => ({
  "x-text"() {
    return this.cell || " ";
  },
  ":tabindex"() {
    return this.cell ? 0 : -1;
  },
  ":class"() {
    const selected = this.selectedBalls
      .find(({ cardId }) => cardId === this.card.id)
      ?.balls?.includes?.(this.cell);
    return {
      "bg-danger-subtle": selected,
      "border-color-danger": selected,
      "text-danger": selected,
      hoverable: !!this.cell || !selected,
      "bg-success-subtle": this.clickedBalls.find(
        ({ number, cardId }) => number === this.cell && cardId === this.card.id
      ),
    };
  },
  "@click"() {
    const selected = this.selectedBalls
      .find(({ cardId }) => cardId === this.card.id)
      ?.balls?.includes?.(this.cell);

    if (
      !this.clickedBalls.some(({ cardId }) => cardId === this.card.id) &&
      !selected &&
      !!this.cell
    )
      this.selectBall({ number: this.cell, cardId: this.card.id });
  },
});
