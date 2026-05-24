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
        'brand-blue':    '#0074B3',
        'brand-navy':    '#0c3a74',
        'brand-sky':     '#53c2ff',
        'brand-orange':  '#ff914d',
        'brand-deep':    '#022949',
        'brand-red':     '#4a2a28',
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
