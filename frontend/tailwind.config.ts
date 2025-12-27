import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                // Nuclear Option: Force all gray palettes to Black/Deep Dark for backgrounds
                // Text colors (300-600) remain visible.
                neutral: {
                    50: '#000000',
                    100: '#050505',
                    200: '#111111',
                    300: '#404040',
                    400: '#737373',
                    500: '#a3a3a3',
                    600: '#d4d4d4', // Inverted for Dark Mode text visibility? No, standard tailwind is 50=light, 900=dark.
                    // Wait, standard tailwind:
                    // 50 = fafafa (Very Light) -> Make Black
                    // 900 = 171717 (Very Dark) -> Make Black
                    // Usage in Dark Mode: bg-neutral-900 (Background), text-neutral-400 (Text)

                    // We simply want to CRUSH the backgrounds.
                    // Dark Mode Backgrounds usually use 700, 800, 900, 950.
                    700: '#111111',
                    800: '#050505', // The "Gray" Card Background -> NOW BLACKish
                    900: '#000000',
                    950: '#000000',
                },
                gray: {
                    50: '#000000',
                    100: '#050505',
                    200: '#111111',
                    300: '#1f2937',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#111111',
                    800: '#050505',
                    900: '#000000',
                    950: '#000000',
                },
                slate: {
                    50: '#000000',
                    100: '#050505',
                    200: '#111111',
                    700: '#111111',
                    800: '#050505',
                    900: '#000000',
                    950: '#000000',
                },
                zinc: {
                    50: '#000000',
                    100: '#050505',
                    200: '#111111',
                    700: '#111111',
                    800: '#050505',
                    900: '#000000',
                    950: '#000000',
                }
            },
        },
    },
    plugins: [],
};
export default config;
