/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff7a00",
          light: "#ff9a3c",
          dark: "#e06800",
        },
        accent: "#f5a623",
        dark: {
          DEFAULT: "#0d0d0d",
          card: "#161616",
          lighter: "#1e1e1e",
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 122, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 122, 0, 0.6), 0 0 40px rgba(255, 122, 0, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
