/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom:
          "0px 4.8px 0px 0px rgba(111, 137, 46, 1), inset 0px 2.4px 4.8px 0px rgba(255, 255, 255, 0.25), inset 0px -2.4px 4.8px 0px rgba(111, 137, 46, 1)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
