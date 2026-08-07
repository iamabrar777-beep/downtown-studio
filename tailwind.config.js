/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#F5F4F0',
        paper: '#0A0A0A',
        line: '#2A2A2A'
      },
      letterSpacing: {
        wide2: '0.08em'
      }
    }
  },
  plugins: []
};
