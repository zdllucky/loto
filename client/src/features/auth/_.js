import Alpine from "alpinejs";
import {
  authenticateUserWithPassword,
  registerUserWithLoginAndPassword,
} from "./authRepo.js";
import persist from "@alpinejs/persist";

if (!Alpine.$persist) Alpine.plugin(persist);

Alpine.store("auth", {
  token: Alpine.$persist(false).as("session_token"),
  async signIn(login, password) {
    try {
      this.token = await authenticateUserWithPassword(login, password);
      return { ok: true };
    } catch (e) {
      return e.message;
    } finally {
      this._alertAuthChange();
    }
  },
  async register(login, password) {
    try {
      this.token = await registerUserWithLoginAndPassword(login, password);
      return { ok: true };
    } catch (e) {
      return e.message;
    } finally {
      this._alertAuthChange();
    }
  },
  signOut() {
    this.token = false;
    this._alertAuthChange();
  },
  _alertAuthChange() {
    window.dispatchEvent(
      new CustomEvent("authchange", { detail: { hasAuth: !!this.token } })
    );
  },
});

Alpine.directive(
  "authredirect",
  async (el, { expression, value }, { Alpine, cleanup }) => {
    const authed = value === "authed";

    function redirectionHandler({ detail }) {
      if (authed === detail.hasAuth) Alpine.$router.push(expression);
    }

    redirectionHandler({ detail: { hasAuth: !!Alpine.store("auth").token } });

    window.addEventListener("authchange", redirectionHandler);

    cleanup(() => window.removeEventListener("authchange", redirectionHandler));
  }
);
