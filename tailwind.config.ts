import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '401px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced custom colors matching your theme
				rebuild: {
					black: '#0A0A0A',
					darkgray: '#141414',
					gray: '#1A1A1A',
					lightgray: '#2A2A2A',
					yellow: '#fff318',
					accent: '#F6C90E',
					white: '#FFFFFF',
					text: {
						primary: '#FFFFFF',
						secondary: '#B0B0B0',
						muted: '#666666'
					}
				}
			},
			fontFamily: {
				bebas: ['Bebas Neue', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'premium-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(255, 243, 24, 0.2), 0 0 40px rgba(255, 243, 24, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(255, 243, 24, 0.4), 0 0 60px rgba(255, 243, 24, 0.2)'
					}
				},
				'card-hover': {
					'0%': {
						transform: 'translateY(0) scale(1)',
						boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
					},
					'100%': {
						transform: 'translateY(-8px) scale(1.02)',
						boxShadow: '0 20px 60px rgba(255, 243, 24, 0.15), 0 10px 40px rgba(0, 0, 0, 0.3)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
				'premium-glow': 'premium-glow 3s ease-in-out infinite',
				'card-hover': 'card-hover 0.3s ease-out forwards'
			},
			backgroundImage: {
				'gym-texture': "url('https://images.unsplash.com/photo-1590487988256-9ed24133863e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2728&q=80')",
				'premium-gradient': 'linear-gradient(135deg, rgba(255, 243, 24, 0.1) 0%, rgba(246, 201, 14, 0.1) 100%)',
				'card-gradient': 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
