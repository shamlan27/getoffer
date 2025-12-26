'use client';

import useSWR from 'swr';
import axios from '@/lib/axios';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';
import GlobalLoader from '@/components/ui/GlobalLoader';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function BrandsPage() {
    const { data: brands, error } = useSWR('/api/brands', fetcher);

    if (!brands && !error) return <GlobalLoader />;

    return (
        <main className="min-h-screen bg-white dark:bg-black pb-20">
            <div className="container mx-auto px-4 py-24">
                <Link href="/" className="inline-flex items-center text-neutral-500 hover:text-[var(--color-primary)] mb-8 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">All Brands</h1>

                {error && (
                    <div className="text-center py-20 text-red-500">
                        Failed to load brands.
                    </div>
                )}

                {brands && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {brands.map((brand: any) => (
                            <Link key={brand.id} href={`/brand/${brand.id}`} className="group">
                                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-neutral-100 dark:border-neutral-800 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-4 group-hover:border-[var(--color-primary)] transition">
                                        {brand.logo ? (
                                            <img
                                                src={brand.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${brand.logo}`}
                                                alt={brand.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold text-neutral-400">{brand.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[var(--color-primary)] transition text-center">{brand.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
