import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D1B2A",
        secondary: "#E0E1DD",
        tertiary: "#778DA9",
        dark: "#0D1B2A",
        "dark-blue": "#415A77",
        light: "#778DA9",
        spotify: "#00DA5A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "5p": "5%",
        "10p": "10%",
        "15p": "15%",
        "20p": "20%",
        "25p": "25%",
        "30p": "30%",
        "35p": "35%",
        "40p": "40%",
        "50p": "50%",
        "60p": "60%",
        "70p": "70%",
        "80p": "80%",
        "90p": "90%",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
