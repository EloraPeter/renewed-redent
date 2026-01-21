import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";


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
  plugins: [animate],
};

export default config;
