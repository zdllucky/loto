import persist from "@alpinejs/persist";
import Alpine from "alpinejs";
import router from "@shaun/alpinejs-router";
import formData from "alpinejs-form-data";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "bootstrap/scss/bootstrap.scss";
import "./imports.sass";

Object.defineProperty(window, "Alpine", {
  writable: false,
  value: Alpine,
});

onAlpineInit(({ plugin }) => {
  plugin(router);
  plugin(formData);
  plugin(persist);

  import.meta.glob("./features/**/_.js", { eager: true });
});

setTimeout(Alpine.start, 10);
