/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Tight', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        accent:   '#0066FF',
        success:  '#00C781',
        warning:  '#F5A623',
        danger:   '#E02020',
        border:   '#E5E5E5',
        muted:    '#6B6B6B',
        subtle:   '#F7F7F7',
        tertiary: '#AAAAAA',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
