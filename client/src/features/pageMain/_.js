import ru from "./assets/header_ru.png?inline";
import en from "./assets/header_en.png?inline";
import kk from "./assets/header_kk.png?inline";
import dog_bottom from "./assets/dog_bottom.png?inline";
import present from "./assets/present.png?inline";
import presentBox from "./assets/present_box.png?inline";
import envelope from "./assets/envelope.svg?raw";
import Alpine from "alpinejs";
import svg64 from "svg64";

onAlpineInit(({ store }) => {
  const imgStore = store("img");

  imgStore.import("header", { ru, kk, en }[import.meta.env.VITE_LANG ?? "ru"]);
  imgStore.import("dogBottom", dog_bottom);
  imgStore.import("present", present);
  imgStore.import("present_box", presentBox);
  imgStore.import("envelope", svg64(envelope));
});

Alpine.data("content", () => ({
  sentForm: Alpine.$persist(false).as("sentForm"),
}));
