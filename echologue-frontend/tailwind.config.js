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
          base:      'var(--color-base)',
          surface:   'var(--color-surface)',
          hover:     'var(--color-hover)',
          border:    'var(--color-border)',
          primary:   'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent:    'var(--color-accent)',
          danger:    'var(--color-danger)',
        },
      },
    },
  },
  plugins: [],
}
