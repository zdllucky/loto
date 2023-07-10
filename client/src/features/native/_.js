import Alpine from "alpinejs";

Alpine.store("native", {
  runtime: "browser",
  runtimeMeta: undefined,
  init() {
    if (window.top) {
      window.addOnceEventListener("message", ({ data }) => {
        if (data.action === "getRuntime") {
          const { runtime, runtimeMeta } = data;

          this.runtime = runtime;
          this.runtimeMeta = runtimeMeta;

          if (runtime === "cordova") {
            this.setSafeAreaInsets();
          }
        }
      });

      window.top?.postMessage?.(
        { origin: "container", action: "getRuntime" },
        "*"
      );
    }
  },
  setSafeAreaInsets() {
    window.top.postMessage(
      { origin: "container", action: "getSafeAreaInsets" },
      "*"
    );

    window.addOnceEventListener("message", (event) => {
      const { action, origin, ...insets } = event.data;

      if (origin === "cordova" && action === "getSafeAreaInsets") {
        const { top, bottom } = insets;
        const style = document.body.style;

        // Set padding to the body

        style.paddingTop = `${top}px`;
        style.paddingBottom = `${bottom}px`;
      }
    });
  },
});
