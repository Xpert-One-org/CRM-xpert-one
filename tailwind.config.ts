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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        tertiary: "hsl(var(--tertiary))",
        accent: "hsl(var(--accent))",
        dark: "hsl(var(--dark))",
        black: "hsl(var(--black))",
        dark_hard: "hsl(var(--dark-hard))",
        white: "hsl(var(--white))",
        important: "hsl(var(--important))",
        lightgray: "hsl(var(--lightgray))",
        filter: "hsl(var(--filter))",
        skeleton: "hsl(var(--skeleton))",
        muted: "hsl(var(--muted))",
        "chat-selected": "hsl(var(--chat-selected))",
        "light-gray-third": "hsl(var(--light-gray-third))",
        "fond-gray": "hsl(var(--fond-gray))",
        "fond-yellow": "hsl(var(--fond-yellow))",
        "fond-blue": "hsl(var(--fond-blue))",
        "lightgray-secondary": "hsl(var(--lightgray-secondary))",
        "border-gray": "hsl(var(--border-gray))",
        primaryGradient: "linear-gradient(to bottom, hsl(var(--tertiary)), hsl(var(--primary)) 50%, hsl(var(--secondary))) !important ",
      },
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
        sans: ["var(--font-fira-sans)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
