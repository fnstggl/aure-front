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
      fontFamily: {
        // Display / headline + body: Helvetica Now Display (Regular). Until the
        // licensed Helvetica Now Display woff2 is added to /public/fonts (see the
        // commented @font-face in index.css), this degrades to the Neue Haas /
        // Helvetica Neue stack — never to a Google substitute.
        sans: ['"Helvetica Now Display"', '"Neue Haas Grotesk Display"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        display: ['"Helvetica Now Display"', '"Neue Haas Grotesk Display"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        // Labels / nav / metrics / captions: self-hosted IBM Plex Mono (real font).
        mono: ['"IBM Plex Mono"', '"Geist Mono"', '"SF Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          alt: "hsl(var(--background-alt))",
        },
        foreground: "hsl(var(--foreground))",
        signal: {
          DEFAULT: "hsl(var(--signal))",
          strong: "hsl(var(--signal-strong))",
          muted: "hsl(var(--signal-muted))",
        },
        steel: "hsl(var(--steel))",
        gold: "hsl(var(--gold))",
        data: {
          DEFAULT: "hsl(var(--data-blue))",
          pale: "hsl(var(--data-pale))",
          violet: "hsl(var(--data-violet))",
          deep: "hsl(var(--data-deep))",
        },
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
          elevated: "hsl(var(--card-elevated))",
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
        divider: "hsl(var(--divider))",
        glass: {
          DEFAULT: "hsl(var(--surface-glass))",
          border: "hsl(var(--surface-glass-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
      },
      maxWidth: {
        content: "1200px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.01em",
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
        "accordion-down": "accordion-down 0.15s ease-out",
        "accordion-up": "accordion-up 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;