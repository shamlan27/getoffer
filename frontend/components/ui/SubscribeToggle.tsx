'use client';

import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import axios from '@/lib/axios';

interface SubscribeToggleProps {
    id: number | string;
    type: 'brand' | 'category';
    initialSubscribed?: boolean;
    className?: string;
}

export default function SubscribeToggle({ id, type, initialSubscribed = false, className = '' }: SubscribeToggleProps) {
    const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
    const [loading, setLoading] = useState(false);

    const toggleSubscription = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent parent link clicks
        e.stopPropagation();

        setLoading(true);
        // Optimistic update
        const previousState = isSubscribed;
        setIsSubscribed(!previousState);

        try {
            const endpoint = type === 'brand' ? '/api/subscribe/brand' : '/api/subscribe/category';
            // Assuming the backend expects an ID and a 'subscribe' boolean or handles toggle
            await axios.post(endpoint, {
                id,
                action: !previousState ? 'subscribe' : 'unsubscribe'
            });
            // Success, keep the state
        } catch (error) {
            // Revert on error
            console.error('Subscription failed', error);
            setIsSubscribed(previousState);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleSubscription}
            disabled={loading}
            className={`p-2 rounded-full transition-all duration-300 group ${isSubscribed
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white'
                } ${className}`}
            title={isSubscribed ? "Unsubscribe" : "Subscribe for alerts"}
        >
            <div className={`transition-transform duration-300 ${loading ? 'scale-90 opacity-70' : 'scale-100'}`}>
                {isSubscribed ? <Bell size={18} fill="currentColor" /> : <Bell size={18} />}
            </div>
        </button>
    );
}
