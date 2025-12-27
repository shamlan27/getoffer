'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme] = useState<Theme>('dark'); // Always dark

    useEffect(() => {
        // STRICT ENFORCEMENT
        const root = window.document.documentElement;
        root.classList.remove('light');
        root.classList.add('dark');
        root.style.backgroundColor = '#000000'; // Force JS style
        root.style.colorScheme = 'dark';
        localStorage.setItem('theme', 'dark');

        // Prevent system changes from overriding
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        const handler = () => {
            root.classList.remove('light');
            root.classList.add('dark');
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const toggleTheme = () => {
        // Permanently Disabled
        console.log("Theme switching disabled. Locked to Dark Mode.");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
