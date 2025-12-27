'use client';

import Hero from '@/components/ui/Hero';
import HeroSlider from '@/components/ui/HeroSlider';
import OfferCard from '@/components/ui/OfferCard';
import SubscribeToggle from '@/components/ui/SubscribeToggle';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

// Helper for auto-scrolling
const useAutoScroll = (ref: any, isPaused: boolean) => {
  const animationRef = useRef<number | null>(null);
  // We use a ref to track precise scroll position to allow for sub-pixel scrolling speeds (e.g. 0.5px/frame)
  // However, since scrollLeft is integer-based in most browsers, we just add a small amount each frame
  // and rely on the high framerate for smoothness.

  useEffect(() => {
    const scrollContainer = ref.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (!scrollContainer) return;

      // Move 1px every frame (approx 60px/sec at 60fps)
      // If this is too fast, we can use an accumulator.
      // Let's try 0.5 speed essentially by running every other frame or using accumulator.
      // Simple smooth scroll:
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
        scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        scrollContainer.scrollLeft += 1;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (!isPaused) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, ref]);
};

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isTrendingPaused, setIsTrendingPaused] = useState(false);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const [isBrandsPaused, setIsBrandsPaused] = useState(false);
  const brandsScrollRef = useRef<HTMLDivElement>(null);

  useAutoScroll(trendingScrollRef, isTrendingPaused);
  useAutoScroll(featuredScrollRef, isFeaturedPaused);
  useAutoScroll(brandsScrollRef, isBrandsPaused);

  const getOffersApiUrl = (isFeatured = false) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory) params.append('category', selectedCategory);
    if (isFeatured) params.append('featured', 'true');
    return `/api/offers?${params.toString()}`;
  };

  const { data: offersData, error } = useSWR(getOffersApiUrl(), fetcher);
  const { data: categoriesData } = useSWR('/api/categories', fetcher);
  const { data: featuredOffersData } = useSWR(getOffersApiUrl(true), fetcher);
  const { data: bannersData } = useSWR('/api/banners', fetcher);

  // Fetch brands filtered by category
  const getBrandsApiUrl = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (search) params.append('search', search);
    return `/api/brands?${params.toString()}`;
  };
  const { data: brandsData } = useSWR(getBrandsApiUrl(), fetcher);

  const featuredOffers = featuredOffersData?.data || [];
  const banners = bannersData?.data || [];
  const offers = offersData?.data || [];
  const categories = categoriesData || [];
  const brands = brandsData || [];

  /* Marquee Helpers */
  const shouldAnimateBrands = brands.length > 6;
  const marqueeBrands = shouldAnimateBrands
    ? [...brands, ...brands]
    : brands;

  const shouldAnimateFeatured = featuredOffers.length > 4;
  const marqueeOffers = shouldAnimateFeatured
    ? [...featuredOffers, ...featuredOffers]
    : featuredOffers;

  const scrollingBanners = banners.filter((b: any) => !b.type || b.type === 'scrolling');
  const heroBanners = banners.filter((b: any) => b.type === 'standard');

  const shouldAnimateBanners = scrollingBanners.length > 3;
  const marqueeBanners = shouldAnimateBanners
    ? [...scrollingBanners, ...scrollingBanners]
    : scrollingBanners;

  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('loading');
    setMessage('');
    try {
      await axios.post('/api/subscribe', { email });
      setSubStatus('success');
      setEmail('');
    } catch (err: any) {
      setSubStatus('error');
      setMessage(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white">
      {heroBanners.length > 0 ? (
        <HeroSlider banners={heroBanners} />
      ) : (
        <Hero />
      )}

      {/* Stats Bar */}
      <section className="bg-[#000000] border-y border-white/5 py-4">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Active Deals', value: '500+' },
            { label: 'Verified Brands', value: '100+' },
            { label: 'Daily Updates', value: '24/7' },
            { label: 'Users Saving', value: '10k+' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-white dark:to-neutral-400">{stat.value}</span>
              <span className="text-xs md:text-sm text-neutral-600 dark:text-neutral-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Brands (Moves above Trending) */}
      <section className="container mx-auto px-6 py-12 border-b border-neutral-200 dark:border-white/5 group/brands">
        {brands.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Popular Brands</h2>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2 opacity-0 group-hover/brands:opacity-100 transition-opacity">
                  <button
                    onClick={() => brandsScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  >
                    <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-300" />
                  </button>
                  <button
                    onClick={() => brandsScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                    className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  >
                    <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-300" />
                  </button>
                </div>
                <Link href="/brands" className="text-sm text-neutral-400 hover:text-white transition-colors">View All Brands</Link>
              </div>
            </div>

            <div className="relative w-full overflow-hidden group bg-white/5 rounded-3xl p-8 border border-white/5"
              onMouseEnter={() => setIsBrandsPaused(true)}
              onMouseLeave={() => setIsBrandsPaused(false)}
            >
              <div
                ref={brandsScrollRef}
                className="flex space-x-12 overflow-x-auto no-scrollbar scroll-smooth items-center"
              >
                {marqueeBrands.map((brand: any, idx: number) => (
                  <div key={`${brand.id}-${idx}`} className="group/brand relative flex flex-col items-center space-y-3 min-w-[90px]">
                    <div className="relative">
                      <Link href={`/brand/${brand.id}`} className="block">
                        <div className="w-20 h-20 bg-[#151515] rounded-2xl shadow-lg flex items-center justify-center border border-white/5 overflow-hidden group-hover/brand:border-[var(--color-primary)] group-hover/brand:shadow-[0_0_20px_rgba(var(--color-primary),0.3)] transition-all duration-500">
                          {brand.logo ? (
                            <img
                              src={brand.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${brand.logo}`}
                              alt={brand.name}
                              className="w-[80%] h-[80%] object-contain transition-all duration-500"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-neutral-600 group-hover/brand:text-white">{brand.name.charAt(0)}</span>
                          )}
                        </div>
                      </Link>
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover/brand:opacity-100 transition-opacity duration-300 z-10">
                        <SubscribeToggle id={brand.id} type="brand" className="shadow-lg bg-neutral-800 border border-neutral-700 w-8 h-8 flex items-center justify-center !p-0 hover:bg-[var(--color-primary)]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fades for marquee */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#111] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111] to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </section>

      {/* Scrolling Banners (Trending Promotions) */}
      {scrollingBanners.length > 0 && (
        <section className="py-12 border-b border-neutral-200 dark:border-white/5 overflow-hidden group/trending">
          <div className="container mx-auto px-6 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-neutral-800 dark:text-white/80">Trending Promotions</h2>
            <div className="flex gap-2 opacity-0 group-hover/trending:opacity-100 transition-opacity">
              <button
                onClick={() => document.getElementById('trending-scroll')?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-300" />
              </button>
              <button
                onClick={() => document.getElementById('trending-scroll')?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
          </div>
          <div className="relative w-full"
            onMouseEnter={() => setIsTrendingPaused(true)}
            onMouseLeave={() => setIsTrendingPaused(false)}
          >
            <div
              id="trending-scroll"
              ref={trendingScrollRef}
              className="flex space-x-6 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
            >
              {marqueeBanners.map((banner: any, idx: number) => (
                <a
                  key={`${banner.id}-${idx}`}
                  href={banner.link || '#'}
                  target={banner.link ? "_blank" : "_self"}
                  className="block relative w-[300px] h-[160px] md:w-[400px] md:h-[200px] flex-shrink-0 rounded-2xl overflow-hidden glass-card transition-transform hover:scale-[1.02] group"
                >
                  <img
                    src={banner.image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${banner.image_path}`}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover opacity-100 md:opacity-90 dark:md:opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:from-black/80 md:to-transparent flex items-end p-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium truncate">{banner.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Offers Marquee */}
      {featuredOffers.length > 0 && (
        <section className="py-16 relative bg-[#000000] group/featured">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505] pointer-events-none" />
          <div className="container mx-auto px-6 mb-8 relative z-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Featured Offers</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Hand-picked deals you shouldn't miss</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-2 opacity-0 group-hover/featured:opacity-100 transition-opacity">
                <button
                  onClick={() => featuredScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => featuredScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <Link href="/offers" className="text-[var(--color-primary)] font-semibold hover:text-inherit transition-colors flex items-center gap-2">
                View All <span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full z-10"
            onMouseEnter={() => setIsFeaturedPaused(true)}
            onMouseLeave={() => setIsFeaturedPaused(false)}
          >
            <div
              id="featured-scroll"
              ref={featuredScrollRef}
              className="flex space-x-6 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-4"
            >
              {featuredOffers.map((offer: any, idx: number) => (
                <div key={`${offer.id}-${idx}`} className="w-[300px] flex-shrink-0">
                  <Link href={`/offer/${offer.id}`} className="block transform hover:-translate-y-2 transition duration-500">
                    <OfferCard
                      brand={offer.brand?.name || 'Unknown'}
                      logo={offer.brand?.logo_url || (offer.brand?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand.logo}` : undefined)}
                      image={offer.how_to_claim_image_url || (offer.how_to_claim_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}` : undefined)}
                      description={offer.title}
                      code={offer.code}
                      expiry={offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'No expiry'}
                      verified={true}
                      variant="featured"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area: Sidebar + Grid layout for desktop could go here, keeping simple sections for now as per design */}

      <section className="container mx-auto px-6 py-12" id="categories">
        {/* Categories Pills (Enhanced) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="flex overflow-x-auto pb-4 md:flex-wrap md:overflow-visible md:pb-0 gap-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 font-medium ${selectedCategory === ''
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg'
                : 'bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
                }`}
            >
              <span>All</span>
            </button>
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className={`flex-shrink-0 group flex items-center pl-1 pr-3 py-1 rounded-full border transition-all duration-300 gap-2 ${selectedCategory === cat.slug
                  ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-300'
                  }`}
              >
                <button
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${selectedCategory === cat.slug ? 'text-[var(--color-primary)]' : 'group-hover:text-black dark:group-hover:text-white'} transition-colors whitespace-nowrap`}
                >
                  {cat.icon && (
                    cat.icon.startsWith('http') || cat.icon.startsWith('/')
                      ? <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />
                      : <span className="text-lg leading-none">{cat.icon}</span>
                  )}
                  <span>{cat.name}</span>
                </button>
                <SubscribeToggle
                  id={cat.id}
                  type="category"
                  className={`w-6 h-6 flex items-center justify-center !p-0 ${selectedCategory === cat.slug ? 'text-[var(--color-primary)]' : 'text-neutral-400 hover:text-black dark:hover:text-white'}`}
                />
              </div>
            ))}
          </div>
        </div>



        {/* Offers Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Latest Deals</h2>
          <Link href="/offers" className="px-4 py-2 border border-white/10 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all">
            Browse All
          </Link>
        </div>

        {/* Loading State */}
        {!offersData && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-red-500/10 rounded-2xl border border-red-500/20">
            <p className="text-red-400">Failed to load offers. Please try again later.</p>
          </div>
        )}

        {/* Data State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((offer: any) => (
            <Link key={offer.id} href={`/offer/${offer.id}`} className="block h-full transform hover:-translate-y-1 transition duration-300">
              <OfferCard
                brand={offer.brand?.name || 'Unknown Brand'}
                logo={offer.brand?.logo_url || (offer.brand?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand.logo}` : undefined)}
                image={offer.how_to_claim_image_url || (offer.how_to_claim_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}` : undefined)}
                description={offer.title}
                code={offer.code}
                expiry={offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'No expiry'}
                verified={true}
              />
            </Link>
          ))}
        </div>


      </section>



      {/* Footer (Premium) */}
      <footer className="bg-[#000000] border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="GetOffer Logo" className="w-8 h-8 object-contain" />
                <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  GetOffer<span className="text-[var(--color-secondary)]">.lk</span>
                </span>
              </Link>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                Sri Lanka's premier destination for exclusive discounts, coupons, and brand promotions. Join the community of smart shoppers today.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-[#1877F2] hover:text-white dark:hover:bg-[#1877F2] dark:hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-[#E4405F] hover:text-white dark:hover:bg-[#E4405F] dark:hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-[#0077B5] hover:text-white dark:hover:bg-[#0077B5] dark:hover:text-white transition-all">
                  <Linkedin size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-transparent flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-[#FF0000] hover:text-white dark:hover:bg-[#FF0000] dark:hover:text-white transition-all">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-neutral-900 dark:text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/offers" className="hover:text-[var(--color-primary)] transition">Browse Offers</Link></li>
                <li><Link href="/brands" className="hover:text-[var(--color-primary)] transition">Our Partner Brands</Link></li>
                <li><Link href="/about" className="hover:text-[var(--color-primary)] transition">About GetOffer</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-900 dark:text-white font-bold mb-6">Stay Updated</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Get the latest offers delivered to your inbox.</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-neutral-400"
                  required
                />
                <button
                  disabled={subStatus === 'loading'}
                  className="absolute right-1 top-1 bottom-1 bg-[var(--color-primary)] text-white px-4 rounded-md font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {subStatus === 'loading' ? '...' : 'Join'}
                </button>
              </form>
              {subStatus === 'success' && <p className="text-green-500 text-xs mt-2">Subscribed successfully!</p>}
              {subStatus === 'error' && <p className="text-red-500 text-xs mt-2">{message}</p>}
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
            <p>&copy; 2025 GetOffer Sri Lanka. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

