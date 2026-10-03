/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        yekan: ["YekanBakh"],
      },

      colors: {
        background: "var(--background)",
        blue: "var(--blue)",
        gray: "var(--gray)",
        "gray-light": "var(--gray-light)",
        yellow: "var(--yellow)",
        orange: "var(--orange)",
        turquoise: "var(--turquoise)",
        "blue-light": "var(--blue-light)",
        "yellow-light": "var(--yellow-light)",
        "orange-light": "var(--orange-light)",
        "turquoise-light": "var(--turquoise-light)",
      },

      borderRadius: {
        8: "8px",
        12: "12px",
        16: "16px",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};