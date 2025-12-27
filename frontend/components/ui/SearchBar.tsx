import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Tag, ArrowRight, Loader2, Store } from 'lucide-react';
import axios from '@/lib/axios';

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    variant?: 'hero' | 'minimal';
}

export default function SearchBar({
    className = '',
    placeholder = "Search retailers, offers, or categories...",
    variant = 'hero'
}: SearchBarProps) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<{ brands: any[], offers: any[] }>({ brands: [], offers: [] });
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (search.length < 2) {
                setResults({ brands: [], offers: [] });
                return;
            }

            setLoading(true);
            try {
                // Fetching all for client-side filtering (efficient for < 1000 items)
                const [brandsRes, offersRes] = await Promise.all([
                    axios.get('/api/brands'),
                    axios.get('/api/offers')
                ]);

                const allBrands = brandsRes.data || [];
                const allOffers = offersRes.data.data || [];

                const matchedBrands = allBrands.filter((b: any) =>
                    b.name.toLowerCase().includes(search.toLowerCase())
                ).slice(0, 3);

                const matchedOffers = allOffers.filter((o: any) =>
                    o.title.toLowerCase().includes(search.toLowerCase())
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
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        if (search.trim()) {
            router.push(`/?search=${encodeURIComponent(search)}`);
        } else {
            router.push('/');
        }
    };

    const handleNavigate = (path: string) => {
        setShowDropdown(false);
        setSearch(''); // Clear search on direct navigation
        router.push(path);
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div className={`flex items-center ${variant === 'hero' ? 'bg-white/10 backdrop-blur-md border border-white/20 p-2 shadow-2xl' : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-1 shadow-sm'} rounded-full w-full transition-all duration-300`}>
                <form onSubmit={handleSearch} className="flex w-full items-center">
                    <Search className={`${variant === 'hero' ? 'text-white ml-4' : 'text-neutral-400'} w-5 h-5 flex-shrink-0`} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (e.target.value.length > 1) setShowDropdown(true);
                        }}
                        onFocus={() => search.length > 1 && setShowDropdown(true)}
                        placeholder={placeholder}
                        className={`bg-transparent border-none outline-none ${variant === 'hero' ? 'text-white placeholder-white/70 px-4 py-2' : 'text-neutral-900 dark:text-white placeholder-neutral-400 px-2 py-1 text-sm'} w-full`}
                    />
                    {variant === 'hero' ? (
                        <button type="submit" className="bg-white text-[var(--color-primary)] font-bold px-6 py-2 rounded-full hover:bg-white/90 transition cursor-pointer flex-shrink-0">
                            Search
                        </button>
                    ) : (
                        <button type="submit" className="text-[var(--color-primary)] flex-shrink-0">
                            <ArrowRight size={18} />
                        </button>
                    )}
                </form>
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && search.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="flex flex-col items-center justify-center text-neutral-500">
                                <Loader2 size={24} className="animate-spin mb-2" />
                                <span className="text-sm">Searching...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {/* Brands Section */}
                            {results.brands.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">Brands</div>
                                    {results.brands.map((brand) => (
                                        <button
                                            key={brand.id}
                                            onClick={() => handleNavigate(`/brand/${brand.id}`)}
                                            className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                                {brand.logo || brand.logo_url ? (
                                                    <img
                                                        src={brand.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${brand.logo}`}
                                                        className="w-full h-full object-cover"
                                                        alt={brand.name}
                                                    />
                                                ) : <Store size={14} className="text-neutral-400" />}
                                            </div>
                                            <span className="font-medium group-hover:text-black dark:group-hover:text-white transition-colors">{brand.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Offers Section */}
                            {results.offers.length > 0 && (
                                <div>
                                    <div className="px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">Offers</div>
                                    {results.offers.map((offer) => (
                                        <button
                                            key={offer.id}
                                            onClick={() => handleNavigate(`/offer/${offer.id}`)}
                                            className="w-full flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                                                {offer.brand?.logo || offer.brand?.logo_url ? (
                                                    <img
                                                        src={offer.brand?.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand?.logo}`}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                ) : <Tag size={14} className="text-neutral-400" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-medium truncate group-hover:text-black dark:group-hover:text-white transition-colors">{offer.title}</div>
                                                <div className="text-xs text-neutral-400 truncate">{offer.brand?.name}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {results.offers.length === 0 && results.brands.length === 0 && (
                                <div className="p-6 text-center text-neutral-500 text-sm">
                                    No results found for "{search}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
