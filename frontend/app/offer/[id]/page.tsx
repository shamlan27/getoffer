'use client';

import { ArrowLeft, Clock, Copy, ExternalLink, ShieldCheck, Share2, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import GlobalLoader from '@/components/ui/GlobalLoader';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function OfferDetail() {
    const { id } = useParams();
    const { data: offer, error } = useSWR(id ? `/api/offers/${id}` : null, fetcher);
    const [copied, setCopied] = useState(false);

    const [subEmail, setSubEmail] = useState('');
    const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subMessage, setSubMessage] = useState('');

    const handleCopy = () => {
        if (offer?.code) {
            navigator.clipboard.writeText(offer.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubscribe = async () => {
        if (!subEmail) return;
        setSubStatus('loading');
        setSubMessage('');
        try {
            await axios.post('/api/subscribe', { email: subEmail });
            setSubStatus('success');
            setSubEmail('');
        } catch (err: any) {
            setSubStatus('error');
            setSubMessage(err.response?.data?.message || 'Failed. Please try again.');
        }
    };

    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-50 dark:bg-black">Failed to load offer.</div>;
    if (!offer) return <GlobalLoader />;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 pt-24 pb-20">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-6">
                <Link href="/" className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-[var(--color-primary)] transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-10 rounded-bl-full pointer-events-none" />

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                {offer.brand?.logo || offer.brand?.logo_url ? (
                                    <img
                                        src={offer.brand.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand.logo}`}
                                        alt={offer.brand.name}
                                        className="w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <span className="font-bold text-2xl text-[var(--color-primary)]">
                                        {offer.brand?.name?.substring(0, 1) || 'B'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{offer.brand?.name}</h1>
                                <div className="flex items-center text-green-500 text-sm font-medium mt-1">
                                    <ShieldCheck className="w-4 h-4 mr-1" /> Verified Offer
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">{offer.title}</h2>
                        <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: offer.description }} />

                        {/* Coupon Section */}
                        {offer.type === 'code' ? (
                            <div className="bg-neutral-50 dark:bg-neutral-950 border-2 border-dashed border-[var(--color-primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center relative transition-all hover:bg-purple-50 dark:hover:bg-neutral-900">
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Coupon Code</span>
                                <div className="text-3xl md:text-4xl font-mono font-bold text-[var(--color-primary)] mb-4 tracking-wider">
                                    {offer.code}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition flex items-center shadow-lg shadow-purple-500/20 cursor-pointer"
                                >
                                    {copied ? <CheckCircle className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-lg font-bold text-neutral-800 dark:text-white mb-4">No Code Required</span>
                                <a href={offer.brand?.website || '#'} target="_blank" className="bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition flex items-center shadow-lg">
                                    Get Deal <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        )}


                        <p className="text-xs text-neutral-400 mt-6 flex items-center justify-center">
                            <Clock className="w-3 h-3 mr-1" /> Valid until: {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'Indefinite'}
                        </p>

                        <div className="mt-6 flex justify-center">
                            {offer.brand?.website && (
                                <a href={offer.brand.website} target="_blank" className="flex items-center text-[var(--color-primary)] hover:underline font-medium text-sm">
                                    Visit {offer.brand.name} Website <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* How to Claim Image */}
                    {offer.how_to_claim_image && (
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <Info className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                                How to Claim
                            </h3>
                            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                <img
                                    src={offer.how_to_claim_image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}`}
                                    alt="How to claim instructions"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[var(--color-primary)] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-2">Never miss a deal!</h3>
                            <p className="text-white/80 text-sm mb-4">Get the latest coupons delivered to your inbox.</p>
                            <input
                                type="email"
                                value={subEmail}
                                onChange={(e) => setSubEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 placeholder-white/60 text-white mb-3 focus:outline-none focus:bg-white/30"
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={subStatus === 'loading'}
                                className="w-full bg-white text-[var(--color-primary)] font-bold py-2 rounded-lg hover:bg-neutral-100 transition cursor-pointer disabled:opacity-70"
                            >
                                {subStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                            {subStatus === 'success' && <p className="text-white text-xs mt-2 font-bold">Subscribed successfully!</p>}
                            {subStatus === 'error' && <p className="text-red-200 text-xs mt-2">{subMessage}</p>}
                            <div className="pt-4 border-t border-white/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">Push Notifications</span>
                                    <button className="bg-white/20 hover:bg-white/30 rounded-full p-1 w-10 h-6 flex items-center transition relative">
                                        <span className="w-4 h-4 bg-white rounded-full shadow-sm transform translate-x-0 transition" />
                                    </button>
                                </div>
                                <p className="text-white/60 text-xs mt-1">Get instant alerts for {offer.brand?.name}</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
                        <h3 className="font-bold mb-4">Share this offer</h3>
                        <div className="flex space-x-2">
                            {['Facebook', 'WhatsApp', 'Twitter', 'Copy Link'].map(platform => (
                                <button
                                    key={platform}
                                    onClick={() => {
                                        const url = window.location.href;
                                        const text = `Check out this offer from ${offer.brand?.name}: ${offer.title}`;

                                        if (platform === 'Facebook') {
                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                                        } else if (platform === 'WhatsApp') {
                                            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                                        } else if (platform === 'Twitter') {
                                            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                                        } else if (platform === 'Copy Link') {
                                            navigator.clipboard.writeText(url);
                                            // You might want to show a toast here, but for now we'll just rely on user action
                                            alert('Link copied to clipboard!');
                                        }
                                    }}
                                    className="flex-1 bg-neutral-100 dark:bg-neutral-800 py-2 rounded-lg text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


