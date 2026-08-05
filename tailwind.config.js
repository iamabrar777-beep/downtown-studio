/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        paper: '#fafaf8',
        line: '#e4e2dc'
      },
      letterSpacing: {
        wide2: '0.08em'
      }
    }
  },
  plugins: []
};
