import Alpine from "alpinejs";

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

// Append console.error to the body
//
// const consoleError = console.error;
//
// console.error = (...args) => {
//   consoleError(...args);
//
//   const error = args[0];
//
//   if (error instanceof Error) {
//     const errorElement = document.createElement("div");
//     errorElement.classList.add("error");
//     errorElement.innerText = error.message;
//
//     document.body.appendChild(errorElement);
//   }
// };
