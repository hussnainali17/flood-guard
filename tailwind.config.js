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
        ocean: {
          950: '#F7F3ED',
          900: '#F0E9DF',
          850: '#E8DED2',
          800: '#DED1C2',
          700: '#D1C0AE',
          600: '#B9A38F',
        },
        hydro: {
          300: '#D99A7B',
          400: '#D1815D',
          500: '#C66D49',
          600: '#A95335',
        },
        cyan: {
          300: '#A95335',
          400: '#B85C3A',
          500: '#C66D49',
          600: '#A95335',
          800: '#E0B9A5',
          950: '#F5E8DF',
        },
        sky: {
          200: '#D78B68',
          400: '#AF5637',
          500: '#C66D49',
          600: '#A95335',
        },
        blue: {
          400: '#AF5637',
          500: '#C66D49',
          600: '#A95335',
        },
        slate: {
          100: '#493D34',
          200: '#57493E',
          300: '#68594D',
          400: '#7D6E61',
          500: '#938475',
        },
        rose: {
          200: '#784A3A',
          300: '#89513D',
          400: '#9D563A',
          500: '#BD6446',
          950: '#F3E2D9',
        },
        amber: {
          300: '#A86C2C',
          400: '#946020',
          500: '#C58332',
        },
        emerald: {
          300: '#176B4A',
          400: '#197A54',
          500: '#21805A',
        },
        risk: {
          low: '#10B981',
          med: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
