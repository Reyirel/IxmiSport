/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      animation: {
        bounce: 'bounce 2.5s cubic-bezier(0.47, 0, 0.745, 0.715) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'emerald-xl': '0 20px 25px -5px rgba(5, 150, 105, 0.1)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
          },
        },
      },
    },
  },
  plugins: [],
}
