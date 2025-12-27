'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import axios from '@/lib/axios';
import OfferCard from '@/components/ui/OfferCard';
import { Search, Filter, X } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function OffersPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    // Fetch Data
    const { data: offersData, isLoading: offersLoading } = useSWR('/api/offers', fetcher);
    const { data: categoriesData } = useSWR('/api/categories', fetcher);
    const { data: brandsData } = useSWR('/api/brands', fetcher);

    const offers = offersData?.data || [];
    const categories = categoriesData || [];
    const brands = brandsData || [];

    // Filter Logic
    const filteredOffers = useMemo(() => {
        return offers.filter((offer: any) => {
            const matchesSearch = offer.title.toLowerCase().includes(search.toLowerCase()) ||
                offer.brand?.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory ? offer.category_id === selectedCategory || offer.brand?.category_id === selectedCategory : true; // Adjust based on data structure
            const matchesBrand = selectedBrand ? offer.brand_id == selectedBrand : true;

            return matchesSearch && matchesCategory && matchesBrand;
        });
    }, [offers, search, selectedCategory, selectedBrand]);

    return (
        <main className="min-h-screen bg-black pt-20 pb-20">
            {/* Header / Filter Section */}
            <div className="bg-black border-b border-[#111] sticky top-[80px] z-30 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">All Active Offers</h1>

                        <div className="flex flex-1 w-full md:w-auto gap-4 items-center overflow-x-auto no-scrollbar">
                            {/* Search */}
                            <div className="relative flex-grow md:flex-grow-0 md:min-w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search brands or offers..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black border border-[#111] focus:border-[var(--color-primary)] rounded-full pl-10 pr-4 py-2 text-sm outline-none transition-all text-white placeholder-neutral-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-black border border-[#111] rounded-full px-4 py-2 text-sm font-medium cursor-pointer focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            {/* Brand Filter */}
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="bg-black border border-[#111] rounded-full px-4 py-2 text-sm font-medium cursor-pointer focus:ring-1 focus:ring-[var(--color-primary)] outline-none text-white"
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand: any) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>

                            {(selectedCategory || selectedBrand || search) && (
                                <button
                                    onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); }}
                                    className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 transition"
                                    title="Clear filters"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                {offersLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-72 bg-[#050505] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredOffers.map((offer: any) => (
                            <div key={offer.id}>
                                <OfferCard
                                    brand={offer.brand?.name || 'Unknown'}
                                    logo={offer.brand?.logo_url || (offer.brand?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand.logo}` : undefined)}
                                    image={offer.how_to_claim_image_url || (offer.how_to_claim_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}` : undefined)}
                                    description={offer.title}
                                    code={offer.code}
                                    expiry={offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'No expiry'}
                                    verified={true}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                        <Filter size={48} className="mb-4 opacity-50" />
                        <p className="text-xl font-medium">No offers found.</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); }}
                            className="mt-4 text-[var(--color-primary)] font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
