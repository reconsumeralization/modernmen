/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'salon-dark': '#1a1a1a',
        'salon-gold': '#d4af37',
        'modern-orange': '#f97316', // Modern Men brand orange
        'modern-dark': '#374151', // Professional gray
        'brand-black': '#000000',
        'brand-red': '#C00000',
        'brand-silver': '#B8B8B8',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
