/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rebuild-black': '#111111',
        'rebuild-yellow': '#fff318', // Updated from previous yellow color
        'rebuild-darkgray': '#1A1A1A',
      },
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        }
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite'
      },
      transitionDuration: {
        '1500': '1500ms',
      }
    },
  },
  plugins: [],
}
