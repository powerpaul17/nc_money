/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'color-main-text': 'var(--color-main-text)',
        'color-border-dark': 'var(--color-border-dark)',
        'color-main-background': 'var(--color-main-background)'
      }
    }
  },
  plugins: [],
  important: true
}
