'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import axios from '@/lib/axios';

export default function Dashboard() {
    const { user, logout, isLoading, requestAccountDeletion, deleteAccount } = useAuth();
    const router = useRouter();
    const [deleteStep, setDeleteStep] = useState(0); // 0: Idle, 1: Confirm/OTP Sent
    const [otp, setOtp] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center dark:text-white font-bold text-xl">
            Loading<span className="text-[var(--color-accent)] animate-pulse">....</span>
        </div>;
    }

    const handleDeleteInitiate = async () => {
        if (!confirm('Are you SURE you want to delete your account? This action is irreversible.')) return;

        setDeleteLoading(true);
        setDeleteError('');
        try {
            await requestAccountDeletion();
            setDeleteStep(1);
        } catch (err: any) {
            setDeleteError('Failed to send verification code.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        setDeleteError('');
        try {
            await deleteAccount(otp);
            // AuthContext handles logout and redirect
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || 'Deletion failed. Check OTP.');
            setDeleteLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-20 px-4 text-neutral-900 dark:text-white">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">My Account</h1>
                    <button
                        onClick={logout}
                        className="flex items-center text-red-500 hover:text-red-600 font-medium transition"
                    >
                        <LogOut className="w-5 h-5 mr-2" /> Sign Out
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-neutral-800 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 flex items-center mt-1">
                                <Mail className="w-4 h-4 mr-2" /> {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings / Danger Zone */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-900/30">
                    <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
                    </h2>

                    {deleteStep === 0 ? (
                        <div>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Deleting your account will permanently remove all your data. This action cannot be undone.
                            </p>
                            <button
                                onClick={handleDeleteInitiate}
                                disabled={deleteLoading}
                                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5 mr-2" />
                                {deleteLoading ? (
                                    <span>
                                        Sending Code<span className="text-[var(--color-accent)] animate-pulse">....</span>
                                    </span>
                                ) : 'Delete Account'}
                            </button>
                            {deleteError && <p className="text-red-500 mt-2 text-sm">{deleteError}</p>}
                        </div>
                    ) : (
                        <div className="max-w-md">
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                A verification code has been sent to <strong>{user.email}</strong>. Enter it below to confirm deletion.
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-red-500 outline-none transition"
                                    placeholder="Enter OTP"
                                />
                            </div>

                            {deleteError && <p className="text-red-500 mb-4 text-sm">{deleteError}</p>}

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteLoading}
                                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <span>
                                            Deleting<span className="text-[var(--color-accent)] animate-pulse">....</span>
                                        </span>
                                    ) : 'Confirm Deletion'}
                                </button>
                                <button
                                    onClick={() => setDeleteStep(0)}
                                    className="text-neutral-500 hover:text-neutral-700 font-medium px-4 py-3"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Subscription Settings */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-neutral-800 mt-8">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2" /> Newsletter
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        Manage your email subscription preferences.
                    </p>
                    <SubscriptionToggle email={user.email} />
                </div>
            </div>
        </main>
    );
}

function SubscriptionToggle({ email }: { email: string }) {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.post('/api/subscription/check', { email })
            .then(res => {
                setSubscribed(res.data.subscribed);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [email]);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/subscription/toggle', { email });
            setSubscribed(res.data.subscribed);
        } catch (error) {
            console.error('Failed to toggle subscription');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-sm text-neutral-500">
        Loading preference<span className="text-[var(--color-accent)] animate-pulse">....</span>
    </div>;

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-bold text-neutral-900 dark:text-white">
                    {subscribed ? 'Subscribed' : 'Not Subscribed'}
                </p>
                <p className="text-sm text-neutral-500">
                    {subscribed ? 'You are receiving latest deals.' : 'You are missing out on deals.'}
                </p>
            </div>
            <button
                onClick={handleToggle}
                className={`px-6 py-2 rounded-xl font-bold transition ${subscribed
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    : 'bg-[var(--color-primary)] text-white hover:opacity-90'
                    }`}
            >
                {subscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
        </div>
    );
}
