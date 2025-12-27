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
            className={`group relative bg-black rounded-3xl p-5 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(15,76,129,0.15)] hover:border-[var(--color-primary)]/30 border border-transparent h-full flex flex-col ${status === 'expired' ? 'opacity-60 grayscale' : ''}`}
        >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Expiry Badge */}
            {status === 'expiring' && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-red-600 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 shadow-lg">
                    EXPIRING
                </div>
            )}

            {/* Top Section */}
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-[#050505] rounded-full flex items-center justify-center text-lg font-bold text-neutral-500 overflow-hidden shadow-inner group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
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
                        <h3 className="text-base font-bold text-white group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-1">
                            {brand}
                        </h3>
                        {verified && (
                            <div className="flex items-center text-[10px] font-medium text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {image && variant !== 'compact' && (
                <div className={`relative mb-5 rounded-2xl overflow-hidden w-full bg-[#050505] ${variant === 'featured' ? 'h-48' : 'h-36'}`}>
                    <Image
                        src={image}
                        alt={description}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
            )}

            <p className="text-neutral-200 text-lg font-bold mb-4 line-clamp-2 leading-snug flex-grow group-hover:text-white transition-colors relative z-10">
                {description}
            </p>

            {/* Footer / Action */}
            <div className="mt-auto pt-4 relative z-10">
                <div className="flex items-center justify-between gap-3">
                    <div className={`flex items-center text-xs font-medium whitespace-nowrap bg-[#080808] px-3 py-1.5 rounded-lg ${status === 'expired' ? 'text-red-500' :
                        status === 'expiring' ? 'text-orange-500' : 'text-neutral-400'
                        }`}>
                        <Timer className="w-3.5 h-3.5 mr-1.5" /> {timeLeft || 'No expiry'}
                    </div>

                    {code ? (
                        <button
                            onClick={(e) => { e.preventDefault(); handleCopy(); }}
                            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex-1 max-w-[140px] shadow-lg ${copied
                                ? 'bg-green-500 text-white shadow-green-500/20'
                                : 'bg-[#111] text-white hover:bg-[var(--color-primary)] hover:shadow-[0_0_15px_rgba(15,76,129,0.4)]'
                                }`}
                        >
                            {copied ? (
                                <span>Copied!</span>
                            ) : (
                                <>
                                    <span className="truncate border-r border-white/20 pr-2 mr-2">{code}</span>
                                    <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 flex-1 max-w-[120px] shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(15,76,129,0.3)]">
                            <span>Get Deal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

