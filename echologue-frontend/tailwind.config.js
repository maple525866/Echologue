/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        'content': '720px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.625',
      },
      colors: {
        primary: {
          DEFAULT: '#2F80ED',
          dark: '#1E5BB8',
        },
        dark: {
          bg: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e0e0e0',
        }
      },
    },
  },
  plugins: [],
}
