import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue':    '#2B6CB0',
        'brand-navy':    '#0D3B5E',
        'brand-sky':     '#4BC8E8',
        'brand-orange':  '#E8723A',
        'surface-light': '#EBF4FB',
        'text-dark':     '#1A202C',
        'text-muted':    '#718096',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
