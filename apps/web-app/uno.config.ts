import {
  defineConfig,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  theme: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",

      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },

      brand: {
        DEFAULT: "hsl(var(--brand))",
        foreground: "hsl(var(--brand-foreground))",
      },

      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },

      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },

      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },

      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
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
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  rules: [
    [
      /^p(x|y)?-layout$/,
      ([, dir], { theme }) => {
        console.log(dir);

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
  ],
  shortcuts: {
    "sticky-header":
      "sticky top-0 backdrop-blur-lg bg-gradient-to-r from-background via-transparent to-background",
  },
});
