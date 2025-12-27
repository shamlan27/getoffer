'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface Banner {
    id: number;
    image_path: string;
    image_url?: string;
    title?: string;
    description?: string;
    link?: string;
    badge?: string;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
    }),
};

export default function HeroSlider({ banners }: { banners: Banner[] }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Normalize index for cycling
    const bannerIndex = ((page % banners.length) + banners.length) % banners.length;
    const currentBanner = banners[bannerIndex];

    useEffect(() => {
        if (!isAutoPlaying || banners.length <= 1) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, [page, isAutoPlaying, banners.length]);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    if (!banners || banners.length === 0) return null;

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] bg-neutral-950 overflow-hidden flex items-center justify-center font-sans"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-primary)] opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-secondary)] opacity-15 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] z-[1]"></div>
            </div>

            <div className="container mx-auto px-4 h-full relative z-10">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <div key={page} className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                        {/* Text Content (Left) */}
                        <motion.div
                            custom={direction}
                            variants={{
                                enter: { opacity: 0, x: -50 },
                                center: { opacity: 1, x: 0 },
                                exit: { opacity: 0, x: 50 }
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-start text-left space-y-6 order-2 md:order-1"
                        >
                            {currentBanner.badge && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-bold border border-[var(--color-primary)]/30 backdrop-blur-md">
                                    <Zap size={14} className="mr-1 fill-current" /> {currentBanner.badge}
                                </span>
                            )}

                            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                                {currentBanner.title || "Discover Exclusive Deals"}
                            </h1>

                            <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
                                {currentBanner.description || "Unlock massive savings on your favorite brands. Limited time offers available now."}
                            </p>

                            <Link
                                href={currentBanner.link || '#'}
                                className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-[var(--color-primary)] rounded-full hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] focus:ring-offset-gray-900"
                            >
                                <span>Check it out</span>
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>

                        {/* Image Content (Right) */}
                        <motion.div
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="relative h-[300px] md:h-[450px] w-full order-1 md:order-2 flex items-center justify-center"
                        >
                            <div className="relative w-full h-full max-w-md md:max-w-lg lg:max-w-xl mx-auto transform perspective-1000 rotate-y-[-5deg] hover:rotate-y-0 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                                <img
                                    src={currentBanner.image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${currentBanner.image_path}`}
                                    alt={currentBanner.title || "Banner"}
                                    className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10"
                                />

                                {/* Floating Card Overlay */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                                    className="absolute bottom-6 right-6 md:right-[-20px] bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl flex items-center space-x-3 max-w-[200px]"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                                        %
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-bold">Best Price</div>
                                        <div className="text-neutral-400 text-xs">Guaranteed Savings</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {banners.length > 1 && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/10 text-white backdrop-blur-md border border-white/5 transition-all z-20 hidden md:block"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/10 text-white backdrop-blur-md border border-white/5 transition-all z-20 hidden md:block"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const direction = idx > bannerIndex ? 1 : -1;
                                    setPage([page + (idx - bannerIndex), direction]);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === bannerIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

