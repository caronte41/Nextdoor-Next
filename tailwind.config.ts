import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./nextdoor/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F2E9DE",
          100: "#E1D3BF",
          200: "#D0BEA1",
          300: "#BFA883",
          400: "#A89160",
          500: "#7D5D37",
          600: "#6D4E2F",
          700: "#5C4027",
          800: "#4C331F",
          900: "#3C2718",
          DEFAULT: "#7D5D37",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#F0F6F9",
          100: "#DFECF2",
          200: "#CDDEE8",
          300: "#B8CEDD",
          400: "#A9C2D4",
          500: "#A2C2D2", // Default
          600: "#8BA6BA",
          700: "#728A9D",
          800: "#5B6E82",
          900: "#2B4552",
          DEFAULT: "#A2C2D2",
          foreground: "#ffffff",
        },
        third: {
          50: "#F3F9ED",
          100: "#E5F2DB",
          200: "#D0E3BA",
          300: "#C0D99F",
          400: "#B1CF84",
          500: "#B5D1A1",
          600: "#AEC99A",
          700: "#97B47D",
          800: "#768C63",
          900: "#55634C",
          DEFAULT: "#9DFFA2",
          foreground: "#ffffff",
        },
        danger: {
          50: "#ffece9", // Very light red (almost white)
          100: "#ffcfc9", // Lighter red
          200: "#ffada4", // Light red
          300: "#ff6c5d", // Medium-light red
          400: "#ff4c3a", // Lighter than base red
          500: "#FF1E0C", // Base red (Main color)
          600: "#e61909", // Slightly darker red
          700: "#b81307", // Darker red
          800: "#8f0f05", // Even darker red
          900: "#670b03", // Darkest red
          DEFAULT: "#FF1E0C", // Main color is still default
          foreground: "#ffffff", // Keep the foreground color white for contrast
        },
        success: {
          50: "#eaffea", // Very light green (almost white)
          100: "#c4ffc4", // Light green
          200: "#9bff9b", // Light-medium green
          300: "#73ff73", // Medium-light green
          400: "#4eff4e", // Lighter than base green
          500: "#5EFF2A", // Base green (Main color)
          600: "#53e526", // Slightly darker green
          700: "#3fb51f", // Darker green
          800: "#2e8617", // Even darker green
          900: "#1f5c10", // Darkest green
          DEFAULT: "#5EFF2A", // Main color is still default
          foreground: "#ffffff", // White foreground for contrast
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          // "2xl": "10rem",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
