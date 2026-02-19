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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.75',
      },
      colors: {
        ink: {
          // 背景层次
          base:    '#141414',
          surface: '#1c1c1c',
          hover:   '#222222',
          // 边框
          border:  '#2e2e2e',
          // 文字
          primary:   '#f0ede8',
          secondary: '#8a8a8a',
          // 强调 & 危险
          accent:  '#a8b8cc',
          danger:  '#e07070',
        },
      },
    },
  },
  plugins: [],
}
