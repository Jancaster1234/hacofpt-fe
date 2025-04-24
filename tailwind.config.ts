import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#ffffff",
        black: "#101828",
        dark: "#1D2430",

        // Brand colors from admin project
        brand: {
          25: "#f2f7ff",
          50: "#ecf3ff",
          100: "#dde9ff",
          200: "#c2d6ff",
          300: "#9cb9ff",
          400: "#7592ff",
          500: "#465fff",
          600: "#3641f5",
          700: "#2a31d8",
          800: "#252dae",
          900: "#262e89",
          950: "#161950",
        },

        // Gray colors from admin project
        gray: {
          25: "#fcfcfd",
          50: "#f9fafb",
          100: "#f2f4f7",
          200: "#e4e7ec",
          300: "#d0d5dd",
          400: "#98a2b3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1d2939",
          900: "#101828",
          950: "#0c111d",
          dark: "#1a2231",
        },

        // Success colors from admin project
        success: {
          25: "#f6fef9",
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#12b76a",
          600: "#039855",
          700: "#027a48",
          800: "#05603a",
          900: "#054f31",
          950: "#053321",
        },

        // Error colors from admin project
        error: {
          25: "#fffbfa",
          50: "#fef3f2",
          100: "#fee4e2",
          200: "#fecdca",
          300: "#fda29b",
          400: "#f97066",
          500: "#f04438",
          600: "#d92d20",
          700: "#b42318",
          800: "#912018",
          900: "#7a271a",
          950: "#55160c",
        },

        // Warning colors from admin project
        warning: {
          25: "#fffcf5",
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fedf89",
          300: "#fec84b",
          400: "#fdb022",
          500: "#f79009",
          600: "#dc6803",
          700: "#b54708",
          800: "#93370d",
          900: "#7a2e0e",
          950: "#4e1d09",
        },

        // Orange colors from admin project
        orange: {
          25: "#fffaf5",
          50: "#fff6ed",
          100: "#ffead5",
          200: "#fddcab",
          300: "#feb273",
          400: "#fd853a",
          500: "#fb6514",
          600: "#ec4a0a",
          700: "#c4320a",
          800: "#9c2a10",
          900: "#7e2410",
          950: "#511c10",
        },

        // Blue Light colors
        "blue-light": {
          25: "#f5fbff",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#b9e6fe",
          300: "#7cd4fd",
          400: "#36bffa",
          500: "#0ba5ec",
          600: "#0086c9",
          700: "#026aa2",
          800: "#065986",
          900: "#0b4a6f",
          950: "#062c41",
        },

        // Theme specific colors
        "theme-pink": {
          500: "#ee46bc",
        },
        "theme-purple": {
          500: "#7a5af8",
        },

        // Body color
        "body-color": {
          DEFAULT: "#788293",
          dark: "#959CB1",
        },

        // Stroke color
        stroke: {
          stroke: "#E3E8EF",
          dark: "#353943",
        },

        // Primary with fallbacks to existing setup
        primary: {
          DEFAULT: "var(--color-primary, #465fff)",
          foreground: "var(--color-primary-foreground, #ffffff)",
        },

        // Background and other system colors
        background: "var(--color-background, #f9fafb)",
        foreground: "var(--color-foreground, #101828)",
        card: {
          DEFAULT: "var(--color-card, #ffffff)",
          foreground: "var(--color-card-foreground, #101828)",
        },
        popover: {
          DEFAULT: "var(--color-popover, #ffffff)",
          foreground: "var(--color-popover-foreground, #101828)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary, #f2f4f7)",
          foreground: "var(--color-secondary-foreground, #101828)",
        },
        muted: {
          DEFAULT: "var(--color-muted, #f2f4f7)",
          foreground: "var(--color-muted-foreground, #667085)",
        },
        accent: {
          DEFAULT: "var(--color-accent, #f2f4f7)",
          foreground: "var(--color-accent-foreground, #101828)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive, #f04438)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "var(--color-border, #e4e7ec)",
        input: "var(--color-input, #e4e7ec)",
        ring: "var(--color-ring, #667085)",
        chart: {
          "1": "var(--color-chart-1, #465fff)",
          "2": "var(--color-chart-2, #0ba5ec)",
          "3": "var(--color-chart-3, #026aa2)",
          "4": "var(--color-chart-4, #fb6514)",
          "5": "var(--color-chart-5, #f79009)",
        },
      },

      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
        "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
        submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
        "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
        btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
        "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
        "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",

        // Shadows from admin project
        "theme-md":
          "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
        "theme-lg":
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        "theme-sm":
          "0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        "theme-xs": "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        "theme-xl":
          "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
        "focus-ring": "0px 0px 0px 4px rgba(70, 95, 255, 0.12)",
        "slider-navigation":
          "0px 1px 2px 0px rgba(16, 24, 40, 0.1), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)",
        tooltip:
          "0px 4px 6px -2px rgba(16, 24, 40, 0.05), -8px 0px 20px 8px rgba(16, 24, 40, 0.05)",
      },

      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        "4xl":
          "0 35px 35px rgba(0, 0, 0, 0.25), 0 45px 65px rgba(0, 0, 0, 0.15)",
      },

      borderRadius: {
        lg: "var(--radius, 0.625rem)",
        md: "calc(var(--radius, 0.625rem) - 2px)",
        sm: "calc(var(--radius, 0.625rem) - 4px)",
        xl: "calc(var(--radius, 0.625rem) + 4px)",
      },

      zIndex: {
        1: "1",
        9: "9",
        99: "99",
        999: "999",
        9999: "9999",
        99999: "99999",
        999999: "999999",
      },

      fontSize: {
        "title-2xl": ["72px", { lineHeight: "90px" }],
        "title-xl": ["60px", { lineHeight: "72px" }],
        "title-lg": ["48px", { lineHeight: "60px" }],
        "title-md": ["36px", { lineHeight: "44px" }],
        "title-sm": ["30px", { lineHeight: "38px" }],
        "theme-xl": ["20px", { lineHeight: "30px" }],
        "theme-sm": ["14px", { lineHeight: "20px" }],
        "theme-xs": ["12px", { lineHeight: "18px" }],
      },

      spacing: {
        "6.5": "1.625rem",
      },

      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
