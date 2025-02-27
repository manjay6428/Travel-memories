/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage: {
        "login-img": "url('./src/assets/images/memories-login.jpg')",
        "signup-img": "url('./src/assets/images/memories-signup.jpg')",
      },
    },
  },

  plugins: [],
};
