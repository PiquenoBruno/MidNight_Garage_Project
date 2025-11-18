/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'text-color': '#F7FEFF',
        'background': '#0A0A0A',
        'text-background': '#1A1A1A',
        'destaque': '#F8FCFF',
        'primaria': '#F8FFFF',
      },
      fontFamily: {
        sans: ['Urbanist', 'Montserrat', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '22px',
      },
      zIndex: {
        '100': '100',
      },
      backgroundImage: {
        'car-hover': "url('/car01.gif')",
        'moto-hover': "url('/moto01.gif')",
        'garage-bg': "url('/Logo_midnight_fundo01.gif')",
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
