/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'main-text': 'var(--color-main-text)',
        'text-maxcontrast': 'var(--color-text-maxcontrast)',
        'border-dark': 'var(--color-border-dark)',
        'main-background': 'var(--color-main-background)',
        'background-dark': 'var(--color-background-dark)',
        'background-darker': 'var(--color-background-darker)',
        'primary-element': 'var(--color-primary-element)'
      }
    }
  },
  plugins: [],
  important: true,
  darkMode: ['class', '.theme--dark']
}
