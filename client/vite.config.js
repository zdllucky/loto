import { defineConfig, loadEnv } from "vite";
import pugPlugin from "vite-plugin-pug";
import sassGlobImports from "vite-plugin-sass-glob-import";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgLoader from "vite-svg-loader";

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      pugPlugin({ pretty: process.env.NODE_ENV !== "production" }),
      svgLoader(),
      sassGlobImports(),
      viteSingleFile({ removeViteModuleLoader: true }),
    ],
    base: "./",
    build: {
      target: "es2017",
      emptyOutDir: true,
    },
  };
});
