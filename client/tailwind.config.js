/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
  module.exports = {
    darkMode: 'class',
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        transitionProperty: {
          'colors': 'background-color, border-color, color, fill, stroke',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  };
