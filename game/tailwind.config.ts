import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark gritty GoT-inspired palette
        parchment: {
          50: '#f5f0e8',
          100: '#ebe1d1',
          200: '#d6c3a3',
          300: '#c2a575',
          400: '#ad8747',
          500: '#8a6b38',
          600: '#6d552d',
          700: '#514022',
          800: '#342a16',
          900: '#1a150b',
        },
        blood: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#f9cece',
          300: '#f4a8a8',
          400: '#eb7474',
          500: '#dc4444',
          600: '#c82828',
          700: '#a81e1e',
          800: '#8b1c1c',
          900: '#731d1d',
        },
        iron: {
          50: '#f4f5f7',
          100: '#e4e7ec',
          200: '#cdd2db',
          300: '#a9b2c3',
          400: '#808da5',
          500: '#616f8a',
          600: '#4e5973',
          700: '#41495e',
          800: '#383f50',
          900: '#323744',
        },
        gold: {
          50: '#fdf9ef',
          100: '#faf0d1',
          200: '#f4de9f',
          300: '#edc86b',
          400: '#e6b240',
          500: '#d49a2a',
          600: '#b87920',
          700: '#99591d',
          800: '#7d471e',
          900: '#683b1c',
        },
        shadow: {
          50: '#f5f5f6',
          100: '#e5e6e8',
          200: '#cccdd2',
          300: '#a9abb3',
          400: '#7e818c',
          500: '#636671',
          600: '#545660',
          700: '#484a51',
          800: '#3f4046',
          900: '#28292d',
          950: '#1a1b1e',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Palatino', 'Georgia', 'serif'],
        body: ['Crimson Text', 'Palatino', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'parchment-texture': "url('/textures/parchment.png')",
        'dark-leather': "url('/textures/dark-leather.png')",
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 20px rgba(212, 154, 42, 0.1)',
        'blood-glow': '0 0 15px rgba(139, 0, 0, 0.3)',
        'gold-glow': '0 0 15px rgba(212, 154, 42, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'torch-flicker': 'torch-flicker 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'torch-flicker': {
          '0%, 100%': { opacity: '0.9' },
          '25%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '75%': { opacity: '0.95' },
        },
      },
      borderColor: {
        DEFAULT: 'rgba(81, 64, 34, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
