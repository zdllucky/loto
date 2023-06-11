import Alpine from "alpinejs";
import bg from "./assets/bg.svg?raw";
import svg64 from "svg64";

Alpine.store("img", {
  bg: svg64(bg),

  init() {
    document.body.style.backgroundImage = `url('${this.bg}')`;
  },

  /**
   * @param name {string}
   * @param path {string}
   */
  import(name, path) {
    this[name] = path;
  },
});
