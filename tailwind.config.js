/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
        },
        brand: {
          blue: '#2563EB',
          violet: '#7C3AED',
          cyan: '#06B6D4',
        }
      }
    },
  },
  plugins: [],
}
