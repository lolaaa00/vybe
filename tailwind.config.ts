import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        tint: 'var(--tint)',
        cta: 'var(--cta)',
        body: 'var(--body)',
        secondary: 'var(--secondary)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-strong': '0 0 30px rgba(124, 58, 237, 0.5)',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}

export default config
