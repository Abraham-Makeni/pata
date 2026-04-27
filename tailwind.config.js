/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        body: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0a0a0a',
          soft: '#1a1a1a',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#F7F7F5',
          muted: '#EFEFEC',
          border: '#E5E5E0',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          secondary: '#4a4a44',
          muted: '#9a9a92',
          faint: '#c8c8c0',
        },
        gold: '#C9A84C',
      },
      borderRadius: {
        'card': '20px',
        'pill': '999px',
        'xl2': '24px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        'float': '0 -2px 24px rgba(0,0,0,0.08)',
      },
      screens: {
        'xs': '390px',
      },
    },
  },
  plugins: [],
}
