/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.{md,mdx}',
    './static/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1A73E8',
        'primary-blue-dark': '#0B62C8',
        'primary-blue-darker': '#0A4F99',
        'primary-blue-light': '#4C8BF5',
        'primary-blue-lighter': '#A3C4F3',
        'light-bg': '#F5F7FA',
        'dark-bg': '#1E1E1E',
        'text-dark': '#1A1A1A',
        'text-light': '#FFFFFF',
      }
    },
  },
  plugins: [],
}