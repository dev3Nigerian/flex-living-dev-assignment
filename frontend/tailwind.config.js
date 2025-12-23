/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c4ed8',
          foreground: '#f9fafb',
        },
        accent: '#0f172a',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 25px -5px rgba(15,23,42,0.15)',
      },
    },
  },
  plugins: [],
};

