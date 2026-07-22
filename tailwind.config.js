/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "theme-green-action": "#0D9F1B",
        "theme-green-dark": "#14535B",
        "theme-green-shaded": "#669DA4",
        "theme-blue-dark": "#25223E",
        "theme-blue-darkshade": "#363351",
        "theme-blue-panel": "#302D48",
        "theme-black": "#0E1726",
        "theme-gray": "#888EA8",
        "theme-gray-white": "#F8F8F8",
        "theme-gray-border": "#E0E6ED",
        "theme-red-action": "#FF0000",
        "theme-orange": "#FF8329"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
      fontSize: {
        "2-3lg": ["1.375rem", { lineHeight: "1.75rem" }],
        "2-3xl": ["1.625rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4-5xl": ["2.5rem", { lineHeight: "3rem" }],
        "5-6xl": ["3rem", { lineHeight: "3.5rem" }],
        md: ["0.9375rem", { lineHeight: "1.375rem" }],
        "md-lg": ["1.0625rem", { lineHeight: "1.5rem" }],
        "lg-xl": ["1.1875rem", { lineHeight: "1.75rem" }]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
