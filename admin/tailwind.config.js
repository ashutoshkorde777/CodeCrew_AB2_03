/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  
    "./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors:{
        'primary': "#34495E" //"#5F6FFF"
      }
    },
  },
  plugins: [],
}