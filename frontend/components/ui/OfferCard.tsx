'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, Clock, CheckCircle, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OfferProps {
    brand: string;
    description: string;
    code?: string;
    expiry: string;
    logo?: string;
    image?: string;
    verified?: boolean;
    variant?: 'default' | 'featured';
}

export default function OfferCard({ brand, description, code, expiry, verified, logo, image, variant = 'default' }: OfferProps) {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!expiry) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(expiry) - +new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

                if (days > 0) return `${days}d ${hours}h left`;
                return `${hours}h ${Math.floor((difference / 1000 / 60) % 60)}m left`;
            }
            return 'Expired';
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [expiry]);

    const handleCopy = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col"
        >
            {/* Top Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-xl font-bold text-neutral-500 shadow-sm overflow-hidden">
                    {logo ? (
                        <img
                            src={logo}
                            alt={brand}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        brand.substring(0, 1)
                    )}
                </div>
                {verified && (
                    <span className="flex items-center text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </span>
                )}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-[var(--color-primary)] transition line-clamp-1">
                {brand}
            </h3>

            {image && (
                <div className={`mb-4 rounded-lg overflow-hidden w-full ${variant === 'featured' ? 'h-48' : 'h-32'}`}>
                    <img src={image} alt={description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
            )}

            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 line-clamp-2 flex-grow">
                {description}
            </p>

            {/* Footer / Action */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className={`flex items-center text-xs font-medium ${timeLeft === 'Expired' ? 'text-red-500' : 'text-orange-500'}`}>
                    <Timer className="w-3 h-3 mr-1" /> {timeLeft || 'No expiry'}
                </div>

                {code ? (
                    <button
                        onClick={(e) => { e.preventDefault(); handleCopy(); }}
                        className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-[var(--color-primary)] hover:text-white text-neutral-900 dark:text-neutral-200 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        {copied ? (
                            <span>Copied!</span>
                        ) : (
                            <>
                                <span className="border-r border-current pr-2 mr-2 border-opacity-20">{code}</span>
                                <Copy className="w-4 h-4" />
                            </>
                        )}
                    </button>
                ) : (
                    <button className="flex items-center space-x-2 bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition text-sm">
                        <span>Get Deal</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] opacity-5 rounded-bl-full pointer-events-none" />
        </motion.div>
    );
}
