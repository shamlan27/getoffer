'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import axios from '@/lib/axios';

import OfferCard from '@/components/ui/OfferCard';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function BrandDetailPage() {
    const params = useParams();
    const { id } = params;

    const { data: brand, error: brandError } = useSWR(id ? `/api/brands/${id}` : null, fetcher);
    // Fetch offers for this brand
    const { data: offersData, error: offersError } = useSWR(id ? `/api/offers?brand=${id}` : null, fetcher);

    const offers = offersData?.data || [];

    if (brandError) return <div className="text-center py-20">Brand not found.</div>;
    if (!brand && !brandError) return <div className="text-center py-20">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-20">

            {/* Brand Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 pt-24 pb-12">
                <div className="container mx-auto px-4 flex flex-col items-center text-center">
                    <Link href="/" className="absolute left-4 top-24 md:left-20 inline-flex items-center text-neutral-500 hover:text-[var(--color-primary)] transition">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <div className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-neutral-700 overflow-hidden mb-6">
                        {brand.logo ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${brand.logo}`}
                                alt={brand.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-bold text-neutral-400">{brand.name.charAt(0)}</span>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{brand.name}</h1>
                    {brand.website && (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline flex items-center font-medium">
                            Visit Website <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                    )}
                </div>
            </div>

            {/* Offers Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">Latest Offers from {brand.name}</h2>

                {offers.length === 0 && (
                    <div className="text-center py-12 text-neutral-500">
                        No active offers found for this brand.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer: any) => (
                        <Link key={offer.id} href={`/offer/${offer.id}`}>
                            <OfferCard
                                brand={brand.name}
                                description={offer.title}
                                code={offer.code}
                                expiry={offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'No expiry'}
                                verified={true}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
