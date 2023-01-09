const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      "spring-wood": {
        50: "#f9f7f3",
        100: "#f1ede3",
        200: "#e2d8c6",
        300: "#cfbea2",
        400: "#bb9f7c",
        500: "#ad8962",
        600: "#a07756",
        700: "#856149",
        800: "#6d503f",
        900: "#594235",
      },
    },
    extend: {},
  },
  plugins: [],
};
