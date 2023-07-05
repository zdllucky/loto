import { defineConfig, loadEnv } from "vite";
import pugPlugin from "vite-plugin-pug";
import sassGlobImports from "vite-plugin-sass-glob-import";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgLoader from "vite-svg-loader";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  /**
   * @type {import('vite').UserConfigExport}
   */
  return {
    plugins: [
      pugPlugin({ pretty: process.env.NODE_ENV !== "production" }),
      svgLoader(),
      sassGlobImports(),
      viteSingleFile({ removeViteModuleLoader: true }),
    ],
    base: "./",
    resolve: {
      alias: {
        "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
        "~bootstrap-icons": resolve(__dirname, "node_modules/bootstrap-icons"),
        "~bootswatch": resolve(__dirname, "node_modules/bootswatch"),
      },
    },
    publicDir: "./src/public",
    build: {
      target: "es2017",
      emptyOutDir: true,
    },
  };
});
