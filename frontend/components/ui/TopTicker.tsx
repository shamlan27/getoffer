'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { Megaphone, X } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function TopTicker() {
    const { data: announcements } = useSWR('/api/announcements', fetcher);
    const [isVisible, setIsVisible] = useState(true);

    if (!announcements || announcements.length === 0 || !isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white py-1.5 px-4 relative overflow-hidden group shadow-sm z-[100]">
            <div className="container mx-auto flex items-center justify-center">
                <div className="flex items-center space-x-4 animate-marquee-fast hover:[animation-play-state:paused] whitespace-nowrap">
                    {announcements.map((ann: any) => (
                        <div key={ann.id} className="flex items-center space-x-2">
                            <Megaphone className="w-4 h-4 flex-shrink-0" />
                            {ann.link ? (
                                <a href={ann.link} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                                    {ann.content}
                                </a>
                            ) : (
                                <span className="font-bold">{ann.content}</span>
                            )}
                            <span className="mx-4 text-white/50 text-xl font-thin">•</span>
                        </div>
                    ))}
                    {/* Duplicate for seamless scroll */}
                    {announcements.length > 2 && announcements.map((ann: any) => (
                        <div key={`${ann.id}-dup`} className="flex items-center space-x-2">
                            <Megaphone className="w-4 h-4 flex-shrink-0" />
                            {ann.link ? (
                                <a href={ann.link} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                                    {ann.content}
                                </a>
                            ) : (
                                <span className="font-bold">{ann.content}</span>
                            )}
                            <span className="mx-4 text-white/50 text-xl font-thin">•</span>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
