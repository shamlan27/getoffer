'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ChevronRight, Store, Tag } from 'lucide-react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ brands: any[], offers: any[] }>({ brands: [], offers: [] });
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults({ brands: [], offers: [] });
                return;
            }

            setLoading(true);
            try {
                // Fetching all for client-side filtering (efficient for < 1000 items)
                // In a larger app, we'd use a dedicated search endpoint like /api/search?q=...
                const [brandsRes, offersRes] = await Promise.all([
                    axios.get('/api/brands'),
                    axios.get('/api/offers')
                ]);

                const allBrands = brandsRes.data || [];
                const allOffers = offersRes.data.data || []; // Assuming paginated response structure for offers

                const matchedBrands = allBrands.filter((b: any) =>
                    b.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 3);

                const matchedOffers = allOffers.filter((o: any) =>
                    o.title.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);

                setResults({ brands: matchedBrands, offers: matchedOffers });
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (path: string) => {
        setIsOpen(false);
        setQuery('');
        router.push(path);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className={`flex items-center transition-all duration-300 ${isOpen ? 'w-64 bg-white/10' : 'w-10 bg-transparent'} rounded-full overflow-hidden border ${isOpen ? 'border-white/20' : 'border-transparent'}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white flex-shrink-0"
                >
                    <Search size={20} />
                </button>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className={`bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 h-10 w-full pr-4 ${!isOpen && 'hidden'}`}
                    autoFocus={isOpen}
                />
                {query && isOpen && (
                    <button onClick={() => setQuery('')} className="pr-3 text-neutral-500 hover:text-white">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute right-0 top-12 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-2 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-4 text-neutral-500">
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Searching...
                        </div>
                    ) : (results.brands.length === 0 && results.offers.length === 0) ? (
                        <div className="text-center py-4 text-neutral-500 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {/* Brands Section */}
                            {results.brands.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase px-3 py-2">Brands</h4>
                                    {results.brands.map(brand => (
                                        <div
                                            key={brand.id}
                                            onClick={() => handleSelect(`/offers?brand=${brand.id}`)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-400">
                                                {brand.logo ? (
                                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${brand.logo}`} alt="" className="w-full h-full object-cover rounded-full" />
                                                ) : <Store size={14} />}
                                            </div>
                                            <span className="text-sm text-neutral-300 group-hover:text-white">{brand.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Offers Section */}
                            {results.offers.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase px-3 py-2">Offers</h4>
                                    {results.offers.map(offer => (
                                        <div
                                            key={offer.id}
                                            onClick={() => handleSelect(`/offers?highlight=${offer.id}`)} // Or specific offer page if exists
                                            className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                                        >
                                            <div className="mt-1 w-6 h-6 flex-shrink-0 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
                                                <Tag size={12} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-neutral-300 group-hover:text-white line-clamp-1">{offer.title}</p>
                                                <p className="text-xs text-neutral-500">{offer.brand?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
