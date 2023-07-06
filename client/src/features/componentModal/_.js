import Alpine from "alpinejs";

const modalDefaultConfig = () => ({
  id: Date.now(),
  title: "",
  body: "",
  closeable: true,
  buttons: [],
});

Alpine.data("modalContainer", () => ({
  modals: [],

  init() {
    window.addEventListener("open-modal", (...data) => this.modal(...data));
  },
  destroy() {
    window.removeEventListener("open-modal", (...data) => this.modal(...data));
  },
  modal({ detail }) {
    const mergedConfig = { ...modalDefaultConfig(), ...detail };

    this.modals.push(mergedConfig);

    return mergedConfig.id;
  },
  _clearModal() {
    this.modals = this.modals.filter(({ id }) => id !== this.modal.id);
    this.$dispatch(`modal-${this.modal.id}`, { action: "closed" });
  },
}));
