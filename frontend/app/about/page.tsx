import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function About() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-neutral-500 hover:text-[var(--color-primary)] mb-8 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mb-6">
                        Helping Sri Lanka Save More
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        GetOffer.lk is the ultimate destination for smart shoppers in Sri Lanka, bringing you the best verified deals, coupons, and offers in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="space-y-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Our Mission</h2>
                        <p>
                            We started with a simple goal: to make saving money effortless for every Sri Lankan.
                            In a world of rising costs, finding a good deal shouldn't be a hassle.
                            We scour the internet, partner with top brands, and verify every coupon so you don't have to.
                        </p>
                        <p>
                            Whether you are ordering food, booking a ride, buying electronics, or planning a trip,
                            GetOffer.lk ensures you never pay full price again.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl p-1 shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                        <div className="bg-white dark:bg-neutral-900 rounded-[22px] h-64 flex items-center justify-center">
                            <span className="text-8xl font-black text-neutral-100 dark:text-neutral-800 select-none">SAVE</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 dark:border-neutral-800 text-center">
                    <h2 className="text-2xl font-bold mb-8">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                ✓
                            </div>
                            <h3 className="font-bold mb-2 dark:text-white">100% Verified</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Every code is tested manually by our team.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                ⚡
                            </div>
                            <h3 className="font-bold mb-2 dark:text-white">Real-time Updates</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">New offers added hourly, 24/7.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                ♥
                            </div>
                            <h3 className="font-bold mb-2 dark:text-white">Free for Everyone</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">No subscriptions, no hidden fees. Just savings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
