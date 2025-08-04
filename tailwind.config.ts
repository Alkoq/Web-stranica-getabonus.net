import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        turquoise: {
          DEFAULT: "var(--turquoise)",
          foreground: "var(--turquoise-foreground)",
          50: "hsl(173, 58%, 95%)",
          100: "hsl(173, 58%, 89%)",
          200: "hsl(173, 58%, 76%)",
          300: "hsl(173, 58%, 62%)",
          400: "hsl(173, 58%, 50%)",
          500: "hsl(173, 58%, 39%)",
          600: "hsl(173, 58%, 31%)",
          700: "hsl(173, 58%, 24%)",
          800: "hsl(173, 58%, 19%)",
          900: "hsl(173, 58%, 14%)",
        },
        orange: {
          DEFAULT: "var(--orange)",
          foreground: "var(--orange-foreground)",
          50: "hsl(24, 95%, 95%)",
          100: "hsl(24, 95%, 89%)",
          200: "hsl(24, 95%, 76%)",
          300: "hsl(24, 95%, 62%)",
          400: "hsl(24, 95%, 58%)",
          500: "hsl(24, 95%, 53%)",
          600: "hsl(24, 95%, 45%)",
          700: "hsl(24, 95%, 37%)",
          800: "hsl(24, 95%, 29%)",
          900: "hsl(24, 95%, 21%)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
