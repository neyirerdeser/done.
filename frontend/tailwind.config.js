/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        special: ["Special Elite", "system-ui"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "fantasy",
      "dracula",
    ],
    darkTheme: "dracula",
  },
  darkMode: ['selector', '[data-theme="dracula"]'],
}