/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050311",
        text: "#dcd9f7",
        primary: "#ffffff",
        secondary: "#08061e",
        accent: "#00ff00",
      },
    },
  },
  plugins: [require("daisyui")],
};
