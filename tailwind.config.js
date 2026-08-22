/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          bg: '#0a0a0a',
          header: '#2a2a2a',
          border: '#333333',
          orange: '#ff8c42',
          red: '#d32f2f',
          cyan: '#00d4ff',
          ocean: '#001a33',
          danger: '#ff3333',
        },
      },
      fontFamily: {
        terminal: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
