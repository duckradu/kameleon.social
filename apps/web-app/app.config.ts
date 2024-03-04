import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig({
  vite: {
    plugins: [
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