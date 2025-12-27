'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing unsubscribe token.');
            return;
        }

        const unsubscribe = async () => {
            setStatus('processing');
            try {
                await axios.post('/api/unsubscribe', { token });
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to unsubscribe. Please try again.');
            }
        };

        unsubscribe();
    }, [token]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full shadow-xl border border-neutral-100 dark:border-neutral-800 text-center">
                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Processing...</h2>
                        <p className="text-neutral-500">Please wait while we update your preferences.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Unsubscribed</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                            You have been successfully removed from our mailing list. You will receive a final confirmation email shortly.
                        </p>
                        <Link
                            href="/"
                            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition inline-block"
                        >
                            Return to Home
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Action Failed</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                            {message}
                        </p>
                        <Link
                            href="/"
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition inline-block"
                        >
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24">
            <Suspense fallback={<div className="flex justify-center p-10">Loading...</div>}>
                <UnsubscribeContent />
            </Suspense>
        </main>
    );
}
