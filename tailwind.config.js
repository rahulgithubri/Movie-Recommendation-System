/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E50914',
          dark: '#B20710',
          hover: '#F40612',
        },
        surface: {
          DEFAULT: '#181818',
          black: '#000000',
          dark: '#111111',
          card: '#181818',
          hover: '#222222',
          border: '#282828',
          borderLight: '#333333',
        },
        brand: {
          500: '#E50914',
          600: '#E50914',
          700: '#B20710',
          800: '#980c14',
        },
        neutral: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          850: '#282828',
          900: '#181818',
          950: '#111111',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
