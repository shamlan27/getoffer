'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Copy, ExternalLink, Timer, CheckCircle } from 'lucide-react';
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
        }, 60000);

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
            whileHover={{ y: -6 }}
            className={`group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-[var(--surface-100)] border border-white/5 transition-all duration-500 hover:shadow-[0_0_40px_rgba(15,76,129,0.15)] hover:border-[var(--color-primary)]/40 ${status === 'expired' ? 'opacity-60 grayscale' : ''}`}
        >
            {/* Image Section (Poster Style) */}
            {image && variant !== 'compact' && (
                <div className={`relative w-full overflow-hidden ${variant === 'featured' ? 'h-52' : 'h-40'}`}>
                    <Image
                        src={image}
                        alt={description}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-100)] via-transparent to-transparent opacity-90" />

                    {/* Floating Brand Logo */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-[var(--surface-200)] border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-shadow">
                            {logo ? (
                                <Image src={logo} alt={brand} fill className="object-cover" />
                            ) : (
                                <span className="font-bold text-neutral-500">{brand.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm tracking-wide shadow-black drop-shadow-md">{brand}</span>
                            {verified && (
                                <span className="text-[10px] text-green-400 flex items-center gap-1 font-medium bg-black/50 px-1.5 rounded-full backdrop-blur-sm w-fit border border-white/5">
                                    <CheckCircle size={10} /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow relative">
                {/* Expiry Pill */}
                <div className="absolute top-0 right-5 -mt-8">
                    {status === 'expiring' && (
                        <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
                            EXPIRING
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                    {description}
                </h3>

                <div className="flex items-center gap-2 mb-6">
                    <Timer size={14} className={status === 'expiring' ? 'text-red-500' : 'text-neutral-500'} />
                    <span className={`text-xs font-medium ${status === 'expiring' ? 'text-red-400' : 'text-neutral-500'}`}>
                        {timeLeft || 'No expiry'}
                    </span>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    {code ? (
                        <button
                            onClick={(e) => { e.preventDefault(); handleCopy(); }}
                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${copied
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-[var(--surface-200)] text-white border border-white/5 group-hover:bg-[var(--color-primary)] group-hover:shadow-[0_0_20px_rgba(15,76,129,0.4)]'
                                }`}
                        >
                            {copied ? 'Copied!' : (
                                <>
                                    <span className="opacity-50">Code:</span>
                                    <span className="tracking-wider">{code}</span>
                                    <Copy size={16} />
                                </>
                            )}
                        </button>
                    ) : (
                        <button className="w-full py-3 rounded-xl font-bold text-sm bg-white text-black flex items-center justify-center gap-2 group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(245,130,32,0.4)]">
                            Get Deal <ExternalLink size={16} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
