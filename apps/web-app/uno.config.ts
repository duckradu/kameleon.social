import {
  defineConfig,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
  toEscapedSelector as e,
} from "unocss";
import presetAnimations from "unocss-preset-animations";

export default defineConfig({
  theme: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",

      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },

      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },

      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },

      brand: {
        DEFAULT: "hsl(var(--brand))",
        foreground: "hsl(var(--brand-foreground))",
      },

      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },

      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },

      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
    },
    borderRadius: {
      sm: "calc(var(--radius) - 4px)",
      md: "calc(var(--radius) - 2px)",
      lg: "var(--radius)",
      xl: "calc(var(--radius) + 2px)",
      "2xl": "calc(var(--radius) + 4px)",
    },
  },
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        sans: {
          name: "Noto Sans",
          weights: ["400", "500", "600", "700", "800", "900"],
        },
        logo: "Lakki Reddy",
        // logo: "Aladin",
        // logo: "Dokdo",
        // logo: "East Sea Dokdo",
      },
    }),
    presetAnimations(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  rules: [
    [
      /^p(x|y)?-layout$/,
      ([, dir], { theme }) => {
        if (dir === "x") {
          return {
            "padding-left": theme.spacing.xs,
            "padding-right": theme.spacing.xs,
          };
        }
        if (dir === "y") {
          return {
            "padding-top": theme.spacing.xs,
            "padding-bottom": theme.spacing.xs,
          };
        }

        return { padding: theme.spacing.xs };
      },
    ],
    [
      /^space-(x|y)-layout/,
      ([, dir], { rawSelector, theme }) => {
        const selector = e(rawSelector);

        if (dir === "x") {
          return `
            ${selector} > :not([hidden], .no-space-layout) ~ :not([hidden], .no-space-layout) {
              --un-space-x-reverse: 0;

              margin-left: calc(${theme.spacing.xs} * calc(1 - var(--un-space-x-reverse)));
              margin-right: calc(${theme.spacing.xs} * var(--un-space-x-reverse));
            }
          `;
        }

        if (dir === "y") {
          return `
            ${selector} > :not([hidden], .no-space-layout) ~ :not([hidden], .no-space-layout) {
              --un-space-y-reverse: 0;

              margin-top: calc(${theme.spacing.xs} * calc(1 - var(--un-space-y-reverse)));
              margin-bottom: calc(${theme.spacing.xs} * var(--un-space-y-reverse));
            }
          `;
        }

        return "";
      },
    ],
    [
      /^gap(-[xy])?-layout$/,
      ([, dir], { theme }) => {
        if (dir === "-x") {
          return { "column-gap": theme.spacing.xs };
        }
        if (dir === "-y") {
          return { "row-gap": theme.spacing.xs };
        }

        return { gap: theme.spacing.xs };
      },
    ],
  ],
  shortcuts: {
    "sticky-header":
      "sticky top-0 backdrop-blur-lg bg-gradient-to-r from-background via-transparent to-background",
  },
});
