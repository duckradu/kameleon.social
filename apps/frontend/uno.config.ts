import {
  defineConfig,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  theme: {},
  presets: [presetUno(), presetWebFonts()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
