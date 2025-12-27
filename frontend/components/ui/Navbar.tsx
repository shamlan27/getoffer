'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Menu, X, ShoppingBag, Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import GlobalSearch from './GlobalSearch';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check local subscription state
        const subState = localStorage.getItem('isNewsletterSubscribed');
        if (subState === 'true') {
            setIsSubscribed(true);
        }

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
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#000000] border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center text-white transition-colors">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-50 group">
                        <Image src="/logo.png" alt="GetOffer Logo" width={40} height={40} className="object-contain" priority />
                        <span className="text-2xl font-bold tracking-tight">
                            GetOffer<span className="text-[var(--color-secondary)]">.lk</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-1 bg-[#000000] rounded-full px-2 py-1.5 border border-white/10 shadow-none">
                        {['Home', 'Offers', 'Brands', 'Categories'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="px-5 py-2 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <GlobalSearch />
                        <div className="h-6 w-[1px] bg-white/10 mx-2" />



                        <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition mr-4">Contact</Link>

                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/10">
                                        <User size={14} />
                                    </div>
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                            </div>
                        ) : (
                            isSubscribed ? (
                                <button
                                    onClick={handleUnsubscribe}
                                    className="px-6 py-2.5 rounded-full bg-black text-neutral-300 border border-white/10 text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-2"
                                >
                                    <Bell size={16} className="fill-current" />
                                    Unsubscribe
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsSubscribeOpen(true)}
                                    className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center gap-2"
                                >
                                    <Bell size={16} className="fill-current" />
                                    Subscribe
                                </button>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 text-white p-2">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>

                    {/* Mobile Nav Overlay */}
                    {isMenuOpen && (
                        <div className="fixed inset-0 bg-[#000000] z-40 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-white">Home</Link>
                            <Link href="/offers" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-neutral-400 hover:text-white">Offers</Link>
                            <Link href="/brands" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-neutral-400 hover:text-white">Brands</Link>
                            <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-neutral-400 hover:text-white">Categories</Link>

                            <div className="w-16 h-[1px] bg-white/10 my-4" />


                            {/* Search Trigger for Mobile - Simplified to just toggle search visibility or distinct mobile search */}
                            <div className="block md:hidden">
                                <GlobalSearch />
                            </div>


                            {user ? (
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-500 text-lg font-medium mt-4">Log Out</button>
                            ) : (
                                isSubscribed ? (
                                    <button onClick={() => { setIsMenuOpen(false); handleUnsubscribe(); }} className="px-8 py-3 rounded-full bg-black text-red-400 border border-white/10 font-bold text-lg">
                                        Unsubscribe
                                    </button>
                                ) : (
                                    <button onClick={() => { setIsMenuOpen(false); setIsSubscribeOpen(true); }} className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center gap-2">
                                        <Bell size={18} />
                                        Subscribe
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </header >

            {/* Subscribe Modal */}
            {
                isSubscribeOpen && (
                    <SubscribeModal onClose={() => setIsSubscribeOpen(false)} onSuccess={handleSubscribeSuccess} />
                )
            }
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
