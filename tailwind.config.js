/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colours for the website-grade redesign
        primary: '#2563EB',      // trust blue
        secondary: '#FACC15',    // optimism yellow
        accent: '#22C55E',       // growth green
        neutral: '#F9FAFB',      // background light
        surface: '#E5E7EB',      // secondary neutral for surfaces
        textHeading: '#111827',  // dark text for headings
        textBody: '#374151',     // softer text for body
      },
      fontFamily: {
        sans: [
          'Inter Tight',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};