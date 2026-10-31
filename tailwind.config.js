/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00F0FF',
          purple: '#A855F7',
          pink: '#FF007F',
          emerald: '#00FF9D',
          blue: '#38BDF8',
          violet: '#7C3AED',
        },
        cyber: {
          950: '#030712',
          900: '#070C18',
          850: '#0B1122',
          800: '#111827',
          700: '#1E293B',
          600: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        'neon-glow': 'radial-gradient(ellipse at top, rgba(0,240,255,0.18), rgba(168,85,247,0.12), transparent 75%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.45), 0 0 10px -2px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 25px -4px rgba(168, 85, 247, 0.45), 0 0 10px -2px rgba(168, 85, 247, 0.3)',
        'neon-pink': '0 0 25px -4px rgba(255, 0, 127, 0.45), 0 0 10px -2px rgba(255, 0, 127, 0.3)',
        'neon-emerald': '0 0 25px -4px rgba(0, 255, 157, 0.45), 0 0 10px -2px rgba(0, 255, 157, 0.3)',
        'card-3d': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'card-3d-hover': '0 30px 60px -20px rgba(0, 240, 255, 0.25), 0 0 0 1px rgba(0, 240, 255, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
