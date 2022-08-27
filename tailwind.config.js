/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'main-text': 'var(--color-main-text)',
        'border-dark': 'var(--color-border-dark)',
        'main-background': 'var(--color-main-background)',
      }
    }
  },
  plugins: [],
  important: true
}
