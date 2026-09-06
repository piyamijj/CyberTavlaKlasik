export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          magenta: '#ff2ec4',
          'magenta-dim': '#a3187f',
          cyan: '#28f4ff',
          'cyan-dim': '#14818c',
        },
        space: {
          900: '#05040d',
          800: '#0b0a17',
          700: '#12101f',
        },
        glass: 'rgba(18,16,31,0.55)',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon-magenta': '0 0 6px #ff2ec4, 0 0 18px #ff2ec4, 0 0 32px rgba(255,46,196,0.5)',
        'neon-cyan': '0 0 6px #28f4ff, 0 0 18px #28f4ff, 0 0 32px rgba(40,244,255,0.5)',
        'neon-magenta-sm': '0 0 4px #ff2ec4, 0 0 8px rgba(255,46,196,0.6)',
        'neon-cyan-sm': '0 0 4px #28f4ff, 0 0 8px rgba(40,244,255,0.6)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        tumble: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        tumble: 'tumble 0.6s linear',
        'pop-in': 'pop-in 0.35s ease-out',
        scan: 'scan 6s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}