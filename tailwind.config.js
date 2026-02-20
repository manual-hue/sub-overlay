/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1e1e1e',
          paper: '#2d2d2d',
          hover: '#3d3d3d',
          selected: '#424242',
        }
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        'pretendard-jp': ['Pretendard JP', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
