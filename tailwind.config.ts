import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 🔴 THIS IS REQUIRED FOR YOUR TOGGLE
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 20px rgba(249,115,22,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
