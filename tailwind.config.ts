import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0d10",
        surface: "#11161c",
        card: "#171e26",
        border: "#232e3a",
        brand: {
          cyan: "#00d2d2",
          cyanHover: "#00b8b8",
          cyanLight: "#e0f7f7",
          red: "#ff3b30",
          redHover: "#e02d23",
          yellow: "#fee500", // 카카오 옐로우
        },
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
