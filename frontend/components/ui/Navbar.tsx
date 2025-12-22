'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full z-50 p-6">
            <div className="container mx-auto flex justify-between items-center text-white">
                <Link href="/" className="text-2xl font-bold tracking-tight z-50">
                    GetOffer<span className="text-[var(--color-accent)]">.lk</span>
                </Link>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-50">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 font-medium">
                    <Link href="/about" className="hover:text-white/80 transition shadow-sm">About Us</Link>
                    <Link href="/brands" className="hover:text-white/80 transition shadow-sm">Brands</Link>
                    <Link href="/categories" className="hover:text-white/80 transition shadow-sm">Categories</Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-neutral-600 dark:text-neutral-300 hover:text-[var(--color-primary)] font-medium">
                                Hi, {user.name}
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-white text-[var(--color-primary)] px-5 py-2.5 rounded-full font-bold hover:bg-neutral-100 transition shadow-lg"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="hover:text-white/80">Login</Link>
                            <Link href="/register" className="bg-white text-[var(--color-primary)] px-5 py-2 rounded-full font-bold hover:bg-neutral-100 transition shadow-lg">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Nav Overlay */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-xl">Home</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl">About Us</Link>
                        <Link href="/brands" onClick={() => setIsOpen(false)} className="text-xl">Brands</Link>
                        {user ? (
                            <>
                                <span className="text-gray-400">Hi, {user.name}</span>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-400 text-xl">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl">Login</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="text-xl text-[var(--color-primary)] font-bold">Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
