/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#34495E" //here we have added the primary color (charcoal gray) original was  #5f6FFF
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill,minmax(200px, 1fr))' /* this property alligns all the doctors profile */
      }
    },
  },
  plugins: [],
}