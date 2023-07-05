import Alpine from "alpinejs";

Alpine.store("img", {
  /**
   * @param name {string}
   * @param path {string}
   */
  import(name, path) {
    this[name] = path;
  },
});
