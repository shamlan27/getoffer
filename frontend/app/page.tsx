'use client';

import Hero from '@/components/ui/Hero';
import HeroSlider from '@/components/ui/HeroSlider';
import OfferCard from '@/components/ui/OfferCard';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
    if (search) params.append('search', search); // Added search to brands too
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
    ? [...brands, ...brands] // Minimal duplication for smooth loop
    : brands;

  const shouldAnimateFeatured = featuredOffers.length > 4;
  const marqueeOffers = shouldAnimateFeatured
    ? [...featuredOffers, ...featuredOffers]
    : featuredOffers;

  // Filter for scrolling banners only
  const scrollingBanners = banners.filter((b: any) => !b.type || b.type === 'scrolling');
  const heroBanners = banners.filter((b: any) => b.type === 'standard');

  const shouldAnimateBanners = scrollingBanners.length > 3;
  const marqueeBanners = shouldAnimateBanners
    ? [...scrollingBanners, ...scrollingBanners]
    : scrollingBanners;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('loading');
    try {
      await axios.post('/api/subscribe', { email });
      setSubStatus('success');
      setEmail('');
    } catch (err) {
      setSubStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pb-20">
      {heroBanners.length > 0 ? (
        <HeroSlider banners={heroBanners} />
      ) : (
        <Hero />
      )}

      {/* Banners Scroller (Admin Managed) - Now above Featured Offers */}
      {scrollingBanners.length > 0 && (
        <section className="py-8 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 overflow-hidden">
          <div className="relative w-full overflow-hidden">
            <div className={shouldAnimateBanners
              ? "flex space-x-6 animate-marquee w-max hover:[animation-play-state:paused] px-4"
              : "flex space-x-6 px-4 overflow-x-auto no-scrollbar justify-center"
            }>
              {marqueeBanners.map((banner: any, idx: number) => (
                <a
                  key={`${banner.id}-${idx}`}
                  href={banner.link || '#'}
                  target={banner.link ? "_blank" : "_self"}
                  className="block relative w-[300px] h-[160px] md:w-[400px] md:h-[200px] flex-shrink-0 rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${banner.image_path}`}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Offers Marquee Section */}
      {featuredOffers.length > 0 && (
        <section className="py-8 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
          <div className="container mx-auto px-4 mb-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center">
              <span className="mr-2">🔥</span> Featured Offers
            </h2>
          </div>
          <div className="relative w-full overflow-hidden group">
            <div className={shouldAnimateFeatured
              ? "flex space-x-6 animate-marquee w-max hover:[animation-play-state:paused] px-4"
              : "flex space-x-6 px-4 overflow-x-auto no-scrollbar justify-center"
            }>
              {marqueeOffers.map((offer: any, idx: number) => (
                <div key={`${offer.id}-${idx}`} className="w-[300px] flex-shrink-0">
                  <Link href={`/offer/${offer.id}`} className="block transform hover:scale-105 transition duration-300">
                    <OfferCard
                      brand={offer.brand?.name || 'Unknown'}
                      logo={offer.brand?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${offer.brand.logo}` : undefined}
                      image={offer.how_to_claim_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${offer.how_to_claim_image}` : undefined}
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

      <section className="container mx-auto px-4 py-8" id="categories">
        {/* Categories */}
        <div className="flex overflow-x-auto space-x-4 pb-8 no-scrollbar mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-2 rounded-full whitespace-nowrap shadow-lg transition-all font-bold ${selectedCategory === ''
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-white text-neutral-900 md:text-neutral-700 dark:bg-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-[var(--color-primary)]'
              }`}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-2 rounded-full whitespace-nowrap border transition-all cursor-pointer shadow-sm font-bold ${selectedCategory === cat.slug
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-neutral-900 md:text-neutral-700 dark:bg-neutral-800 dark:text-white border-neutral-200 dark:border-neutral-700 hover:border-[var(--color-primary)]'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Brands Section (Marquee) */}
        {brands.length > 0 && (
          <div className="mb-12 overflow-hidden">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Popular Brands</h2>
            <div className="relative w-full overflow-hidden group">
              <div className="flex space-x-8 animate-marquee w-max hover:[animation-play-state:paused]">
                {marqueeBrands.map((brand: any, idx: number) => (
                  <Link key={`${brand.id}-${idx}`} href={`/brand/${brand.id}`} className="group flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer">
                    <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center border border-neutral-100 dark:border-neutral-700 overflow-hidden group-hover:border-[var(--color-primary)] transition">
                      {brand.logo ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${brand.logo}`}
                          alt={brand.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-400">{brand.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-[var(--color-primary)] transition">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Trending Offers</h2>
          <button className="text-[var(--color-primary)] font-semibold hover:underline">View all</button>
        </div>

        {/* Loading State */}
        {!offersData && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-red-500">
            Failed to load offers. Please try again later.
          </div>
        )}

        {/* Data State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer: any) => (
            <Link key={offer.id} href={`/offer/${offer.id}`}>
              <OfferCard
                brand={offer.brand?.name || 'Unknown Brand'}
                logo={offer.brand?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${offer.brand.logo}` : undefined}
                image={offer.how_to_claim_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${offer.how_to_claim_image}` : undefined}
                description={offer.title}
                code={offer.code}
                expiry={offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'No expiry'}
                verified={true}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer (Simple) */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">GetOffer<span className="text-[var(--color-accent)]">.lk</span></h3>
            <p className="mb-4">Sri Lanka's #1 coupon and promotion discovery platform. Save money on every purchase.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[var(--color-primary)] transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--color-primary)] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--color-primary)] transition">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to our newsletter for the latest deals.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-neutral-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                  required
                />
                <button disabled={subStatus === 'loading'} className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-r-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50">
                  {subStatus === 'loading' ? '...' : 'Go'}
                </button>
              </div>
              {subStatus === 'success' && <span className="text-green-500 text-sm">Subscribed successfully!</span>}
              {subStatus === 'error' && <span className="text-red-500 text-sm">Subscription failed. Try again.</span>}
            </form>
          </div>
        </div>
        <div className="text-center text-sm border-t border-neutral-800 pt-8">
          <p>&copy; 2025 GetOffer Sri Lanka. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

