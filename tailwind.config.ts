import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        xl: "2rem"
      },
      screens: {
        sm: "100%",
        md: "768px",
        lg: "1024px",
        xl: "1440px"
      }
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px"
    },
    spacing: {
      px: "1px",
      0: "0",
      0.5: "0.125rem",
      1: "var(--space-1)",
      2: "var(--space-2)",
      3: "var(--space-3)",
      4: "var(--space-4)",
      5: "1.25rem",
      6: "var(--space-6)",
      8: "var(--space-8)",
      10: "2.5rem",
      12: "var(--space-12)",
      16: "var(--space-16)",
      20: "5rem",
      24: "var(--space-24)"
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-iran-yekan)", "Tahoma", "Arial", "sans-serif"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        porcelain: "hsl(var(--porcelain))",
        atlas: "hsl(var(--atlas))",
        oxygen: "hsl(var(--oxygen))",
        mesh: "hsl(var(--mesh))",
        signal: "hsl(var(--signal))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)"
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(14, 26, 36, 0.06)",
        lift: "0 4px 16px rgba(14, 26, 36, 0.08)"
      },
      zIndex: {
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40"
      }
    }
  },
  plugins: []
};

export default config;
