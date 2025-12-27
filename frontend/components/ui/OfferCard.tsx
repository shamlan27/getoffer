'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Copy, ExternalLink, Clock, CheckCircle, Timer, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OfferProps {
    brand: string;
    description: string;
    code?: string;
    expiry: string;
    logo?: string;
    image?: string;
    verified?: boolean;
    variant?: 'default' | 'featured' | 'compact';
}

export default function OfferCard({ brand, description, code, expiry, verified, logo, image, variant = 'default' }: OfferProps) {
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [status, setStatus] = useState<'active' | 'expiring' | 'expired'>('active');

    useEffect(() => {
        if (!expiry) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(expiry) - +new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

                if (days < 3) setStatus('expiring');
                else setStatus('active');

                if (days > 0) return `${days}d ${hours}h left`;
                return `${hours}h ${Math.floor((difference / 1000 / 60) % 60)}m left`;
            }
            setStatus('expired');
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
            className={`group relative bg-[#111] rounded-2xl shadow-sm border border-neutral-800 p-5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-primary)]/50 h-full flex flex-col ${status === 'expired' ? 'opacity-60 grayscale' : ''}`}
        >
            {/* Expiry Badge */}
            {status === 'expiring' && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                    EXPIRING SOON
                </div>
            )}

            {/* Top Badge */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg font-bold text-neutral-500 shadow-sm overflow-hidden border border-neutral-700">
                        {logo ? (
                            <Image
                                src={logo}
                                alt={brand}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            brand.substring(0, 1)
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-neutral-100 group-hover:text-[var(--color-primary)] transition line-clamp-1">
                            {brand}
                        </h3>
                        {verified && (
                            <div className="flex items-center text-[10px] font-medium text-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {image && variant !== 'compact' && (
                <div className={`relative mb-4 rounded-lg overflow-hidden w-full bg-neutral-800 ${variant === 'featured' ? 'h-40' : 'h-32'}`}>
                    <Image
                        src={image}
                        alt={description}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            <p className="text-neutral-300 text-base font-semibold mb-2 line-clamp-2 leading-tight flex-grow">
                {description}
            </p>

            {/* Footer / Action */}
            <div className="mt-auto pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between gap-3">
                    <div className={`flex items-center text-xs font-medium whitespace-nowrap ${status === 'expired' ? 'text-red-500' :
                        status === 'expiring' ? 'text-orange-500' : 'text-neutral-500 dark:text-neutral-400'
                        }`}>
                        <Timer className="w-3.5 h-3.5 mr-1.5" /> {timeLeft || 'No expiry'}
                    </div>

                    {code ? (
                        <button
                            onClick={(e) => { e.preventDefault(); handleCopy(); }}
                            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg font-bold text-xs transition-colors flex-1 max-w-[140px] ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-neutral-800 hover:bg-[var(--color-primary)] hover:text-white text-neutral-200'
                                }`}
                        >
                            {copied ? (
                                <span>Copied!</span>
                            ) : (
                                <>
                                    <span className="truncate border-r border-current pr-2 mr-2 border-opacity-20">{code}</span>
                                    <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button className="flex items-center justify-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-opacity-90 transition flex-1 max-w-[120px]">
                            <span>Get Deal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

