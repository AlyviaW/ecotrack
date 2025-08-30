import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          600: "#1b8f4d",
          700: "#157544"
        }
      }
    }
  },
  plugins: [],
};
export default config;
