/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#06060b',
          900: '#0d0d14',
          800: '#13131d',
          700: '#1a1a27',
          600: '#222233',
          500: '#2d2d44',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        slate: {
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':     'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-in':     'toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out':    'toastOut 0.25s ease-in forwards',
        'spin-slow':    'spin 2s linear infinite',
        'pulse-amber':  'pulseAmber 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        toastIn:    { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        toastOut:   { from: { opacity: '1', transform: 'translateX(0)' }, to: { opacity: '0', transform: 'translateX(110%)' } },
        pulseAmber: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(251, 191, 36, 0)' },
        },
      },
    },
  },
  plugins: [],
}
