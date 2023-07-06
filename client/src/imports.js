import persist from "@alpinejs/persist";
import Alpine from "alpinejs";
import router from "@shaun/alpinejs-router";
import formData from "alpinejs-form-data";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "./imports.sass";
import autoAnimate from "@formkit/auto-animate";

Object.defineProperty(window, "Alpine", {
  writable: false,
  value: Alpine,
});
Alpine.directive("autoanimate", (el, { expression }, { evaluate }) => {
  autoAnimate(el, (expression && evaluate(expression)) || undefined);
});

onAlpineInit(({ plugin }) => {
  plugin(router);
  plugin(formData);
  plugin(persist);

  import.meta.glob("./features/**/_.js", { eager: true });
});

setTimeout(Alpine.start, 10);
