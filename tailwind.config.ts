import type { Config } from "tailwindcss";

export default {
  content: ["./src/api/routes/frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
