/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilita el soporte para clases de modo oscuro
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

