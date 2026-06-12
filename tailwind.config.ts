import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paris métro-inspired palette
        metro: {
          DEFAULT: "#003CA6", // RATP signage blue
          dark: "#002B77",
          light: "#3D6FD6",
          tint: "#EDF2FC",
        },
        ticket: {
          DEFAULT: "#FFCD00", // métro line 1 yellow
          dark: "#E0B400",
          tint: "#FFF8DC",
        },
      },
    },
  },
  plugins: [],
};
export default config;
