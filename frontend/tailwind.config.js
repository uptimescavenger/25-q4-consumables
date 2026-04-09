/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#F5F4FE",
          100: "#EFEEFC",
          200: "#EFEEFC",
          500: "#695EE4",
          600: "#5A50D0",
          700: "#4B42BC",
        },
        grey: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          400: "#BDBDBD",
          600: "#757575",
          800: "#424242",
          900: "#212121",
          black: "#1B1B1B",
        },
        status: {
          "red-light": "#FFEBEE",
          red: "#EF5350",
          "orange-light": "#FFF3E0",
          orange: "#FF9800",
          "green-light": "#E8F5E9",
          green: "#4CAF50",
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
