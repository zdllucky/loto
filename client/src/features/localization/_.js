import * as data from "./assets/localization.json";
import Alpine from "alpinejs";

const getBrowserLang = () => {
  const lang = navigator.language || navigator.userLanguage;
  // Allow only ru and en languages, return null otherwise
  // for large russina-speaking countries like Ukraine, Belarus, Kazakhstan, etc. return ru

  if (lang === "ru" || lang === "en") {
    return lang;
  } else if (lang === "uz" || lang === "be" || lang === "kk") {
    return "ru";
  } else {
    return null;
  }
};

Alpine.store("loc", data[getBrowserLang() ?? "en"]);
