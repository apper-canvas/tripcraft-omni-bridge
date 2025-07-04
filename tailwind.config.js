/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#2563EB',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#ffffff'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'travel': '0 10px 25px rgba(37, 99, 235, 0.1)',
        'activity': '0 8px 20px rgba(0, 0, 0, 0.08)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)'
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}