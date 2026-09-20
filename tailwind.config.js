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
        snake: {
          950: '#070b14',
          900: '#0c1222',
          850: '#11192e',
          800: '#17223b',
          700: '#223254',
          green: '#10b981',
          greenLight: '#34d399',
          greenDark: '#059669',
          pinky: '#ec4899',
          pinkyLight: '#f472b6',
          pinkyDark: '#db2777',
        },
        dp: {
          void: '#03050d',
          ink: '#0a0f1e',
          edge: '#141c30',
          pink: '#ff207f',
          rose: '#ff4fa0',
          amber: '#ffba00',
          cyan: '#00d4ff',
          ghost: 'rgba(255,255,255,0.04)',
        }
      },
      fontFamily: {
        game: ['Fredoka', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'cursive', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1.5s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'stamp-in': 'stamp-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'float-y': 'float-y 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'stamp-in': {
          '0%': { transform: 'scale(1.4) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(1deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255, 32, 127, 0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(255, 32, 127, 0.65)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      fontSize: {
        'display': ['clamp(48px, 10vw, 112px)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'ghost-num': ['clamp(80px, 18vw, 160px)', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
