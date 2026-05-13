import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hunter-black': '#050505',
        'terminal-green': '#39ff14',
        'blood-red': '#8b0000',
        'bone-white': '#e3dac9',
        'dark-gray': '#1a1a1a',
      },
      fontFamily: {
        mono: ['var(--font-vt323)', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(57, 255, 20, 1)',
        'retro-red': '4px 4px 0px 0px rgba(139, 0, 0, 1)',
      }
    },
  },
  plugins: [],
};
export default config;