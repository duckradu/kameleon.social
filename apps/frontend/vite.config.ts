import solid from "solid-start/vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    Icons({
      customCollections: {
        local: FileSystemIconLoader("./public/assets/icons"),
      },
      compiler: "solid",
    }),
    UnoCSS(),
    solid(),
  ],
});
