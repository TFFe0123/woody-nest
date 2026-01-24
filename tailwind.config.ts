import type { Config } from "tailwindcss";

export default {
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
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        walnut: {
          DEFAULT: "hsl(var(--walnut))",
          light: "hsl(var(--walnut-light))",
        },
        beige: {
          DEFAULT: "hsl(var(--beige))",
          warm: "hsl(var(--beige-warm))",
        },
        gold: "hsl(var(--gold))",
        cream: "hsl(var(--cream))",
      },
      fontFamily: {
        serif: ["'Noto Serif KR'", "serif"],
        sans: ["'Pretendard'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      backgroundImage: {
        "gradient-walnut": "linear-gradient(135deg, hsl(12 29% 19%) 0%, hsl(30 35% 28%) 100%)",
        "gradient-gold": "linear-gradient(135deg, hsl(30 35% 28%) 0%, hsl(43 74% 49%) 100%)",
        "gradient-warm": "linear-gradient(180deg, hsl(40 40% 97%) 0%, hsl(35 30% 92%) 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -4px hsl(12 29% 19% / 0.15)",
        card: "0 8px 30px -8px hsl(12 29% 19% / 0.12)",
        elevated: "0 20px 50px -15px hsl(12 29% 19% / 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
