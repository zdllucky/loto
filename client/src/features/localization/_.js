import * as data from "./assets/localization.json";
import Alpine from "alpinejs";

const getBrowserLang = () => {
  const lang = navigator.language || navigator.userLanguage;

  if (lang === "ru" || lang === "en" || lang === "kk") {
    return lang;
  } else if (lang === "uz" || lang === "be") {
    return "ru";
  } else {
    return null;
  }
};

Alpine.store("loc", {
  l: data[getBrowserLang() ?? "en"],
  lang: getBrowserLang() ?? "en",
  init() {
    const t = setInterval(async () => {
      const lang = Alpine.store("user").lang;

      if (lang) {
        await this.setLanguage(lang);
        clearInterval(t);
      }
    }, 50);
  },
  t(...args) {
    if (args.length === 0) return "";

    if (args.length === 1) return getNestedValue(this.l, args[0]) ?? args[0];

    const lString = args.length === 1 ? args[0].toString() : parse(...args);

    return !lString.startsWith("server.")
      ? lString
      : getNestedValue(this.l, lString) ?? lString;
  },
  async setLanguage(lang, updateUser = false) {
    if (updateUser) {
      try {
        await Alpine.$repo.user.setLanguage({ language: lang });
        await Alpine.store("user").refresh();
      } catch (e) {
        alert(e.message);
      }
    }

    this.lang = lang !== "unset" ? lang : getBrowserLang() ?? "en";
    this.l = data[lang !== "unset" ? lang : getBrowserLang() ?? "en"];
  },
});

function parse(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += String(values[i]);
    }
  }
  return result;
}

function getNestedValue(obj, path) {
  const formattedPath = path.replace(/\[(\w+)]/g, ".$1"); // convert indices to properties
  const pathArray = formattedPath.split("."); // split by dot
  return pathArray.reduce((prev, curr) => {
    return prev ? prev[curr] : "";
  }, obj);
}
