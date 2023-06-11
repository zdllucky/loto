import Alpine from "alpinejs";

Alpine.store("modal", {
  _showContent: false,
  _modalContent: undefined,
  display(content, ctx) {
    this._modalContent = content;
    this._showContent = true;
    document.body.classList.add("stop-scrolling");
  },
  close() {
    document.body.classList.remove("stop-scrolling");
    this._showContent = false;
  },
});
