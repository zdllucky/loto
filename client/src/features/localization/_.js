import * as data from "./assets/localization.json";
import Alpine from "alpinejs";

const getBrowserLang = () => {
  const lang = navigator.language || navigator.userLanguage;

  if (lang === "ru" || lang === "en") {
    return lang;
  } else if (lang === "uz" || lang === "be" || lang === "kk") {
    return "ru";
  } else {
    return null;
  }
};

Alpine.store("loc", {
  l: data[getBrowserLang() ?? "en"],
  lang: getBrowserLang() ?? "en",
  init() {
    const t = setInterval(() => {
      const lang = Alpine.store("user").lang;

      if (lang) {
        this.setLanguage(lang);
        clearInterval(t);
      }
    }, 50);
  },
  async setLanguage(lang, updateUser = false) {
    if (updateUser) {
      try {
        await Alpine.$repo.user.setLanguage({ language: lang });
      } catch (e) {
        alert(e.message);
      }
    }

    this.lang = lang;
    this.l = data[lang !== "unset" ? lang : getBrowserLang() ?? "en"];
  },
});
