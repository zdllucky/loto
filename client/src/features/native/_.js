import Alpine from "alpinejs";
import { getOS } from "./helpers.js";
import jwtDecode from "jwt-decode";

Alpine.store("native", {
  /** @type {string | undefined}*/ platform: undefined,
  isAppbarVisible: true,

  init() {
    this.platform = getOS();

    if (this.platform === "Android") {
      // noinspection BadExpressionStatementJS
      /** @type {{
     getAccessToken: function(): void;
     toggleAppbar: function(boolean): void;
     setTitle: function(string): void;
     refreshAccessToken: function(): void;
     navigate: function(string, {replace: boolean}): void;
    }}*/
      AndroidFunction;
    }

    this.setTitle(Alpine.store("loc").navTitle);
    this.toggleAppbar(true);

    // Prod debug
    this.getAccessToken()
      .then((t) => {
        if (
          t &&
          jwtDecode(t)?.userInfo?.userId === "402904b67d2aadfe017d56d2de894c45"
        )
          localStorage.clear();
      })
      .catch((e) => {});
  },

  /**
   * @param title {string}
   */
  setTitle(title) {
    this.platform === "iOS" &&
      webkit.messageHandlers.setTitle.postMessage({ title });
    this.platform === "Android" && AndroidFunction.setTitle(title);
  },

  toggleAppbar(checked = !this.isAppbarVisible) {
    this.platform === "iOS" &&
      webkit.messageHandlers.toggleAppbar.postMessage({ checked: !checked });
    this.platform === "Android" && AndroidFunction.toggleAppbar(checked);
  },

  /**
   * @returns {Promise<string>}
   */
  async getAccessToken({ isEmulated = false } = { isEmulated: false }) {
    const { detail } = await new Promise((resolve) => {
      const listener = (event) => {
        window.removeEventListener("getAccessToken", listener);
        resolve(event);
      };

      window.addEventListener("getAccessToken", listener);

      if (isEmulated) {
        window.dispatchEvent(
          new CustomEvent("getAccessToken", {
            detail: { token: "" },
          })
        );
      } else {
        this.platform === "iOS" &&
          webkit.messageHandlers.getAccessToken.postMessage({});
        this.platform === "Android" && AndroidFunction.getAccessToken();
      }
    });
    return detail.token;
  },

  /**
   * @returns {Promise<string>}
   */
  async refreshAccessToken() {
    this.platform === "iOS" &&
      webkit.messageHandlers.refreshAccessToken.postMessage({});
    this.platform === "Android" && AndroidFunction.refreshAccessToken();

    const { token } = await (async () =>
      new Promise(
        (resolve) => (window.refreshAccessToken = () => resolve().detail)
      ))();

    return token;
  },
  /**
   * @param deeplink {string}
   * @param replace {boolean}
   */
  navigate(deeplink, { replace = false }) {
    this.platform === "iOS" &&
      webkit.messageHandlers.navigate.postMessage({
        deeplink,
        replace,
      });
    this.platform === "Android" &&
      AndroidFunction.navigate(deeplink, { replace });
  },

  close() {
    this.platform === "iOS" && webkit.messageHandlers.close.postMessage({});
    this.platform === "Android" && AndroidFunction.close();
  },
});
