/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#FF4700', // AliExpress Vibrant Orange/Red
                    secondary: '#FD6B01', // Bright Orange
                    yellow: '#FFC107',  // Gold/Yellow
                    black: '#111111',
                    gray: '#F5F5F7',
                    text: '#1F2937',
                    surface: '#FFFFFF'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'floating': '0 10px 30px -5px rgba(255, 85, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                'glow': '0 0 20px rgba(255, 85, 0, 0.4)'
            }
        },
    },
    plugins: [],
}
