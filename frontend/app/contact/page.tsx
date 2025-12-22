'use client';

import { Mail, MapPin, Phone, Send, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate form submission
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center text-neutral-500 hover:text-[var(--color-primary)] mb-8 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Have questions or suggestions? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-lg border border-neutral-100 dark:border-neutral-800 h-full">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Contact Info</h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 dark:text-white">Email Us</h3>
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">getoffersince2025@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 dark:text-white">Call Us</h3>
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">+94 72 050 5025</p>
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Mon - Fri, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 dark:text-white">Visit Us</h3>
                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                            123 Keyzer Street,<br />
                                            Colombo 11, Sri Lanka.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                                        <button key={social} className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-[var(--color-primary)] hover:text-white transition">
                                            {social[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-lg border border-neutral-100 dark:border-neutral-800">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Send a Message</h2>
                            <p className="text-neutral-500 mb-8">We usually reply within 24 hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Message</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tell us more about your inquiry..."
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition resize-none dark:text-white"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={submitted}
                                        className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitted ? (
                                            <>
                                                <span className="mr-2">Message Sent</span>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                Send Message <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </button>
                                    {submitted && <span className="text-green-500 font-medium animate-fade-in">Thank you! We'll be in touch.</span>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
