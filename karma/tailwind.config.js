/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        balgin: ['Balgin', 'sans-serif'],
        arsenal: ['Arsenal', 'sans-serif'],
      },
      colors: {
        black: '#000',
        'gray-50': '#f2f2f2',
        muted: '#dcdcdc',
        accent: '#ff914d',
        'accent-700': '#ff914d',
        orange: {
          DEFAULT: '#ff914d',
          50: '#ff914d',
          100: '#ff914d',
          200: '#ff914d',
          300: '#ff914d',
          400: '#ff914d',
          500: '#ff914d',
          600: '#ff914d',
          700: '#ff914d',
          800: '#ff914d',
          900: '#ff914d',
        },
        line: '#2a2a2a',
      },
      fontWeight: {
        extralight: 200,
        light: 300,
        normal: 400,
        bold: 700,
        extrabold: 800,
      },
      boxShadow: {
        custom: '0 10px 30px rgba(0,0,0,0.35)',
      },
      animation: {
        'caret-blink': 'caretBlink 1s steps(1) infinite',
      },
      keyframes: {
        caretBlink: {
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}