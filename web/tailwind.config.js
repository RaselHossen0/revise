/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      extend: {
        colors: {
          
          'pink-100': '#FBE4E6',
          'pink': '#CB1F5D',
          'grey':'#696969',
          'purple-100': '#ECD4EA',
          'purple-300': '#A987A8',
          'purple-500': '#693B69', 
          'purple-700': '#511F52',
        },
       
      }
    },
  },
  plugins: [],
}