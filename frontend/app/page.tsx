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
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight, TrendingUp, Grid, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

// Auto-scroll hook
const useAutoScroll = (ref: React.RefObject<HTMLDivElement | null>, isPaused: boolean, speed: number = 0.5) => {
  useEffect(() => {
    const scrollContainer = ref.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let exactScroll = scrollContainer.scrollLeft;

    const animate = () => {
      if (isPaused) return;

      exactScroll += speed;
      if (exactScroll >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        exactScroll = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = exactScroll;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [ref, isPaused, speed]);
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Auto-scroll states
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  useAutoScroll(featuredScrollRef, isFeaturedPaused, 0.8);

  const [isBrandsPaused, setIsBrandsPaused] = useState(false);
  const brandsScrollRef = useRef<HTMLDivElement>(null);
  useAutoScroll(brandsScrollRef, isBrandsPaused, 0.6);

  // API URLs
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
  const { data: brandsData } = useSWR('/api/brands', fetcher);

  const featuredOffers = featuredOffersData?.data || [];
  const banners = bannersData?.data || [];
  const offers = offersData?.data || [];
  const categories = categoriesData || [];
  const brands = brandsData || [];

  // Marquee data
  const marqueeBrands = brands.length > 0 ? [...brands, ...brands, ...brands] : []; // Triple for smooth looping

  const heroBanners = banners.filter((b: any) => b.type === 'standard' || !b.type);

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
      setMessage(err.response?.data?.message || 'Failed to subscribe.');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white font-sans selection:bg-[var(--color-primary)] selection:text-white">

      {/* Hero Section - Force Min Height to avoid collapse */}
      <div className="relative min-h-[500px] w-full bg-[var(--background)]">
        {heroBanners.length > 0 ? (
          <HeroSlider banners={heroBanners} />
        ) : (
          <Hero />
        )}
      </div>

      {/* Stats Ticker (Glass) */}
      <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm -mt-px relative z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/5">
            {[
              { label: 'Live Deals', value: '500+' },
              { label: 'Partner Brands', value: '100+' },
              { label: 'Verified Codes', value: 'Active' },
              { label: 'Users Saving', value: '50k+' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 space-y-12 md:space-y-24">

        {/* SECTION 1: Categories (Bento Grid) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Grid className="text-[var(--color-primary)]" />
            <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* "All" Block */}
            <button
              onClick={() => setSelectedCategory('')}
              className={`col-span-2 md:col-span-2 p-6 rounded-3xl border border-white/10 flex flex-col justify-between transition-all duration-300 group
                  ${selectedCategory === '' ? 'bg-[var(--color-primary)] shadow-[0_0_30px_rgba(15,76,129,0.3)]' : 'bg-[var(--surface-100)] hover:bg-[var(--surface-200)]'}
                `}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Grid size={20} className="text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">All Offers</span>
                <span className="text-sm text-white/60">View everything</span>
              </div>
            </button>

            {/* Category Blocks */}
            {categories.slice(0, 10).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`col-span-1 p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105
                    ${selectedCategory === cat.slug ? 'bg-white/10 border-white/20' : 'bg-[var(--surface-100)] hover:bg-[var(--surface-200)]'}
                  `}
              >
                <div className="w-12 h-12 relative flex items-center justify-center">
                  {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                    <img src={cat.icon} className="w-8 h-8 object-contain opacity-80" alt="" />
                  ) : (
                    <span className="text-2xl">{cat.icon || '#'}</span>
                  )}
                </div>
                <span className="font-medium text-sm text-center line-clamp-1">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 2: Featured Spotlight (Horizontal Scroll but Premium) */}
        {featuredOffers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-[var(--color-secondary)]" />
                <h2 className="text-3xl font-bold tracking-tight">Featured Selections</h2>
              </div>
              <Link href="/offers" className="px-4 py-2 rounded-full border border-white/10 text-sm hover:bg-white hover:text-black transition-all">View All</Link>
            </div>

            <div
              ref={featuredScrollRef}
              onMouseEnter={() => setIsFeaturedPaused(true)}
              onMouseLeave={() => setIsFeaturedPaused(false)}
              className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x"
            >
              {featuredOffers.map((offer: any) => (
                <div key={offer.id} className="min-w-[300px] md:min-w-[400px] snap-center">
                  <Link href={`/offer/${offer.id}`} className="block h-full">
                    <OfferCard
                      brand={offer.brand?.name}
                      description={offer.title}
                      code={offer.code}
                      expiry={offer.valid_to}
                      image={offer.how_to_claim_image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}`}
                      logo={offer.brand?.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand?.logo}`}
                      verified={true}
                      variant="featured"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: Latest Deals (Feed Layout) */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Tag className="text-green-500" />
            <h2 className="text-3xl font-bold tracking-tight">Latest Drops</h2>
          </div>

          {!offersData && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map((offer: any) => (
              <Link key={offer.id} href={`/offer/${offer.id}`} className="block h-full group">
                <OfferCard
                  brand={offer.brand?.name}
                  description={offer.title}
                  code={offer.code}
                  expiry={offer.valid_to}
                  image={offer.how_to_claim_image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.how_to_claim_image}`}
                  logo={offer.brand?.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${offer.brand?.logo}`}
                  verified={true}
                />
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/offers" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(15,76,129,0.4)]">
              Load More Deals <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* SECTION 4: Brand Wall (Simple Grid) */}
        {brands.length > 0 && (
          <section className="bg-white/5 rounded-[2rem] p-8 md:p-12 border border-white/5">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Trusted by Top Brands</h2>
              <p className="text-neutral-400">Join thousands of brands saving you money.</p>
            </div>

            <div
              ref={brandsScrollRef}
              onMouseEnter={() => setIsBrandsPaused(true)}
              onMouseLeave={() => setIsBrandsPaused(false)}
              className="flex overflow-x-auto gap-8 md:gap-12 items-center no-scrollbar pb-4"
            >
              {marqueeBrands.map((brand: any, idx: number) => (
                <Link key={`${brand.id}-${idx}`} href={`/brand/${brand.id}`} className="flex-shrink-0 group relative w-16 h-16 md:w-20 md:h-20 grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-500">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform group-hover:bg-[var(--color-secondary)]/20" />
                  <div className="relative w-full h-full bg-black rounded-xl border border-white/10 flex items-center justify-center p-2 group-hover:-translate-y-2 transition-transform">
                    {brand.logo ? (
                      <img src={brand.logo_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${brand.logo}`} className="w-full h-full object-contain" alt={brand.name} />
                    ) : (
                      <span className="font-bold">{brand.name[0]}</span>
                    )}
                  </div>
                </Link>
              ))}
              <Link href="/brands" className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl border border-dashed border-white/20 text-neutral-400 hover:text-white hover:border-white transition-all">
                <span className="text-sm font-medium">View All</span>
              </Link>
            </div>
          </section>
        )}

        {/* SECTION 5: Newsletter */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--color-primary)] px-6 py-20 text-center">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Never Pay Full Price Again.
            </h2>
            <p className="text-xl text-white/80">
              Get exclusive codes and daily deals delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20"
              />
              <button
                disabled={subStatus === 'loading'}
                className="px-8 py-4 rounded-xl bg-white text-[var(--color-primary)] font-bold text-lg hover:scale-105 transition-transform shadow-xl disabled:opacity-50"
              >
                {subStatus === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
            {subStatus === 'success' && <p className="text-green-300 font-bold">Welcome directly to the club!</p>}
            {subStatus === 'error' && <p className="text-red-200">{message}</p>}
          </div>
        </section>

      </div>

      {/* Mini Footer */}
      <footer className="border-t border-white/5 mt-20 py-12 bg-[#020202]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-6 h-6 opacity-50" />
            <span className="text-neutral-500 font-medium">© 2025 GetOffer</span>
          </div>
          <div className="flex gap-6 text-neutral-500 text-sm">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex gap-4">
            {[
              { Icon: Facebook, url: 'https://facebook.com' },
              { Icon: Twitter, url: 'https://twitter.com' },
              { Icon: Instagram, url: 'https://instagram.com' }
            ].map(({ Icon, url }, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition"><Icon size={20} /></a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  );
}
