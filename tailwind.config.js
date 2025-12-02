/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background, #F9FAFB)',
        surface: 'var(--surface, #FFFFFF)',
        card: 'var(--card, rgba(0,0,0,0.03))',
        primary: 'var(--primary, #4F46E5)',
        primarySoft: 'var(--primarySoft, #EEF2FF)',
        secondary: 'var(--secondary, #6366F1)',
        accent: 'var(--accent, #8B5CF6)',
        text: 'var(--text, #111827)',
        textMuted: 'var(--textMuted, #6B7280)',
        border: 'var(--border, rgba(0,0,0,0.08))',
        shadow: 'var(--shadow, rgba(0,0,0,0.06))',
      },
    },
  },
  plugins: [],
}
