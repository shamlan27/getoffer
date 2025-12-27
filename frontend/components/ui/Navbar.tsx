

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Bell, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import GlobalSearch from './GlobalSearch';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const subState = localStorage.getItem('isNewsletterSubscribed');
        if (subState === 'true') setIsSubscribed(true);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubscribeSuccess = () => {
        setIsSubscribed(true);
        localStorage.setItem('isNewsletterSubscribed', 'true');
        setIsSubscribeOpen(false);
    };

    const handleUnsubscribe = () => {
        if (confirm('Are you sure you want to unsubscribe from alerts?')) {
            setIsSubscribed(false);
            localStorage.removeItem('isNewsletterSubscribed');
        }
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
                <div className={`container mx-auto px-4 md:px-6 transition-all duration-500 rounded-3xl ${scrolled ? 'bg-[#000000]/80 backdrop-blur-xl border border-white/5 shadow-2xl max-w-6xl' : ''}`}>
                    <div className="flex justify-between items-center h-14 md:h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 z-50 group">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-[var(--color-primary)]/50 group-hover:shadow-[0_0_20px_rgba(15,76,129,0.3)] transition-all duration-500">
                                <Image src="/logo.png" alt="GetOffer" width={24} height={24} className="object-contain" priority />
                            </div>
                            <span className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-glow transition-all">
                                GetOffer<span className="text-[var(--color-secondary)]">.lk</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center bg-white/5 backdrop-blur-md rounded-full p-1.5 border border-white/5 shadow-lg">
                            {['Home', 'Offers', 'Brands', 'Categories'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="px-6 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-all relative group overflow-hidden"
                                >
                                    <span className="relative z-10">{item}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <GlobalSearch />

                            <div className="h-6 w-[1px] bg-white/10" />

                            <Link href="/contact" className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                                <Phone size={20} />
                            </Link>

                            {isSubscribed ? (
                                <button
                                    onClick={handleUnsubscribe}
                                    className="px-5 py-2 rounded-full bg-black border border-white/10 text-neutral-400 text-sm font-bold hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-2"
                                >
                                    <Bell size={16} />
                                    <span>Alerts Active</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsSubscribeOpen(true)}
                                    className="px-6 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold shadow-[0_0_20px_rgba(15,76,129,0.4)] hover:shadow-[0_0_30px_rgba(15,76,129,0.6)] hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Bell size={16} className="fill-current" />
                                    <span>Subscribe</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden z-50 p-2 text-white bg-white/5 rounded-full border border-white/5 backdrop-blur-sm"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
                        <div className="flex flex-col items-center space-y-6">
                            {['Home', 'Offers', 'Brands', 'Categories'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 hover:to-white transition-all"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        <div className="w-16 h-[1px] bg-white/10" />

                        <div className="flex flex-col items-center gap-6">
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-xl text-neutral-400">Contact Support</Link>
                            <button
                                onClick={() => { setIsMenuOpen(false); setIsSubscribeOpen(true); }}
                                className="px-8 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg shadow-[0_0_30px_rgba(15,76,129,0.5)]"
                            >
                                Enable Alerts
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {isSubscribeOpen && (
                <SubscribeModal onClose={() => setIsSubscribeOpen(false)} onSuccess={handleSubscribeSuccess} />
            )}
        </>
    );
}

function SubscribeModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('/api/subscribe', { email });
            setStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Bell className="text-[var(--color-primary)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Don't Miss Out!</h2>
                    <p className="text-neutral-400">Join 10,000+ shoppers saving money every day.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        />
                    </div>

                    <button
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-[var(--color-primary)] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Get Alerts'}
                    </button>

                    {status === 'error' && (
                        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                </form>
            </div>
        </div>
    );
}
