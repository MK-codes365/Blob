/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this list when you add folders that use NativeWind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
