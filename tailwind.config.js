/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1F44',   // Navy Blue
        accent: '#F4B400',     // Gold
        whatsapp: '#1DB954',   // WhatsApp Green
        alert: '#D32F2F',      // Red
        text: '#2E2E2E',      // Charcoal Gray
      }
    },
  },
  plugins: [],
}