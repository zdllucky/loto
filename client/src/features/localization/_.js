import * as data from "./assets/localization.json";
import Alpine from "alpinejs";

Alpine.store("loc", data[import.meta.env.VITE_LANG ?? "ru"]);
