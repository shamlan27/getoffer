'use client';

import useSWR from 'swr';
import axios from '@/lib/axios';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function CategoriesPage() {
    const { data: categories, error } = useSWR('/api/categories', fetcher);

    if (error) return <div className="text-center py-20 text-red-500">Failed to load categories.</div>;
    if (!categories) return <div className="text-center py-20 text-neutral-500">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-24 text-neutral-900 dark:text-white">
            <div className="container mx-auto px-4">
                <Link href="/" className="inline-flex items-center text-neutral-500 hover:text-[var(--color-primary)] mb-8 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                        Find the best deals across all our categories.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/?category=${cat.slug}`} // Linking back to home with filter, or we could make /category/[slug]
                            className="group block bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-neutral-100 dark:border-neutral-800"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl group-hover:bg-[var(--color-primary)] group-hover:text-white transition duration-300">
                                    {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                        <img src={cat.icon} alt="" className="w-10 h-10 object-contain" />
                                    ) : (
                                        <span className="text-3xl leading-none">{cat.icon || cat.name.charAt(0)}</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold group-hover:text-[var(--color-primary)] transition">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
