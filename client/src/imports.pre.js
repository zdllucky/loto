import Alpine from "alpinejs";
import * as bootstrap from "bootstrap";
import "@popperjs/core";

Object.defineProperty(window, "bootstrap", {
  writable: false,
  value: bootstrap,
});

Alpine.$repo = {};

Object.defineProperty(window, "onAlpineInit", {
  writable: false,
  value: (fn) => document.addEventListener("alpine:init", () => fn(Alpine)),
});

Object.defineProperty(window, "addOnceEventListener", {
  writable: false,
  value: (event, listener, options) => {
    function listenerFn(...data) {
      listener(...data);
      removeEventListener(event, listenerFn);
    }

    addEventListener(event, listenerFn, options);
  },
});
