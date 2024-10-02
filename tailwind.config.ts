import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      borderRadius: {
        xxl: "30px",
        xl: "20px",
        s: "8px",
        xs: "4px",
        xxs: "3px",
      },
      colors: {
        colors: {
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          tertiary: "var(--tertiary)",
          accent: "var(--accent)",
          dark: "var(--dark)",
          black: "var(--black)",
          dark_hard: "var(--dark-hard)",
          white: "var(--white)",
          "box-grid": "var(--box-grid)",
          background: "var(--background)",
          important: "var(--important)",
          lightgray: "var(--lightgray)",
          filter: "var(--filter)",
          skeleton: "var(--skeleton)",
          "chat-selected": "var(--chat-selected)",
          "light-gray-third": "var(--light-gray-third)",
          "fond-gray": "var(--fond-gray)",
          "fond-yellow": "var(--fond-yellow)",
          "fond-blue": "var(--fond-blue)",
          "lightgray-secondary": "var(--lightgray-secondary)",
          "accent-secondary": "var(--yellow-secondary)",
          "border-gray": "var(--border-gray)",
          primaryGradient: "linear-gradient(to bottom, var(--tertiary), var(--primary) 50%, var(--secondary)) !important ",
        },
      },
      fontSize: {
        xxs: "0.625rem", // 10px
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        md: "1rem", // 16px
        lg: "1.25rem", // 20px
        xl: "2rem", // 32px
      },
      spacing: {
        spaceLarge: "48px",
        spaceMedium: "32px",
        spaceContainer: "24px",
        spaceMediumContainer: "16px",
        spaceSmall: "12px",
        spaceXSmall: "8px",
        spaceXXSmall: "4px",
      },

      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        bold: "700",
        extra_bold: "900",
      },
      boxShadow: {
        container: "0 2px 4px 0 rgba(0, 0, 0, 0.25) inset",
        msg: "2px 2px 4px 0px rgba(0, 0, 0, 0.10)",
      },
      fontFamily: {
        khand: ["var(--font-khand)"],
        fira: ["var(--font-fira-sans)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
