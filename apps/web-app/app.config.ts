import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import devtools from "solid-devtools/vite";

export default defineConfig({
  vite: {
    plugins: [
      devtools({
        autoname: true,
        locator: {
          targetIDE: "vscode",
          key: "Alt",
          jsxLocation: true,
          componentLocation: true,
        },
      }),
      Icons({
        customCollections: {
          local: FileSystemIconLoader("./public/icons"),
        },
        compiler: "solid",
      }),
      UnoCSS(),
    ],
  },
});
