/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SewTrack Brand Colors
        brand: {
          navy: '#1e3a5f',
          'navy-dark': '#0f1419',
          'navy-light': '#2d5a8f',
          orange: '#ff8c42',
          'orange-light': '#ffaa6f',
          'orange-dark': '#e67a2e',
        },
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#ff8c42', // Brand orange
          500: '#e67a2e',
          600: '#c2621f',
          700: '#9a4e18',
          800: '#7c3d13',
          900: '#653210',
        },
        secondary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f', // Brand navy
        },
      },
    },
  },
  plugins: [],
}
