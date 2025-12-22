'use client';

import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

export default function Hero() {
    return (
        <div className="relative w-full h-[600px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] animate-gradient">
            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
                >
                    Find the Best Deals in Sri Lanka
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-md"
                >
                    Exclusive coupons, promotions, and discounts for your favorite brands.
                </motion.p>

                <SearchBar className="max-w-lg mx-auto" />
            </div>

            {/* Background Overlay for texture if needed */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>
    );
}
