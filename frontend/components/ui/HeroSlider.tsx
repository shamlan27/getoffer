'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';

interface Banner {
    id: number;
    image_path: string;
    title?: string;
    link?: string;
}

export default function HeroSlider({ banners }: { banners: Banner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (!banners || banners.length === 0) return null;

    return (
        <div className="relative w-full h-[200px] md:h-[400px] lg:h-[500px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <a
                        href={banners[currentIndex].link || '#'}
                        target={banners[currentIndex].link ? "_blank" : "_self"}
                        className="block w-full h-full"
                    >
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${banners[currentIndex].image_path}`}
                            alt={banners[currentIndex].title || 'Hero Banner'}
                            className="w-full h-full object-cover"
                        />
                        {banners[currentIndex].title && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 px-4">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={`title-${currentIndex}`}
                                    className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg text-center"
                                >
                                    {banners[currentIndex].title}
                                </motion.h2>
                                <SearchBar className="max-w-lg mx-auto" />
                            </div>
                        )}
                    </a>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
