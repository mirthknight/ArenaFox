/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        midnight: '#0f172a',
        neon: '#65f3c5',
        accent: '#7c3aed'
      },
      boxShadow: {
        glow: '0 10px 60px rgba(101, 243, 197, 0.45)',
        soft: '0 8px 30px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};
