'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const { forgotPassword, resetPassword } = useAuth();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (step === 1) {
                await forgotPassword(email);
                setStep(2);
                setSuccess('Verification code sent to your email.');
            } else {
                if (password !== passwordConfirmation) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await resetPassword({ email, otp, password, password_confirmation: passwordConfirmation });
                setStep(3);
                setSuccess('Password reset successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 py-12 relative overflow-hidden text-neutral-900 dark:text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-transparent to-[var(--color-secondary)] opacity-10 animate-gradient pointer-events-none" />

            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-800 relative z-10 glass-card">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Recovery</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        {step === 1 ? 'Enter your email to reset password' : (step === 2 ? 'Verify Code & New Password' : 'Done')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm">
                        <span className="font-bold mr-2">Error:</span> {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg mb-6 text-sm">
                        {success}
                    </div>
                )}

                {step === 3 ? (
                    <div className="text-center py-8">
                        <div className="text-green-500 mb-4 flex justify-center">
                            <CheckCircle size={48} />
                        </div>
                        <p>Password reset successful. <br /> Redirecting to Login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 ? (
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Verification Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition text-center tracking-widest text-2xl"
                                        placeholder="123456"
                                        required
                                        maxLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 flex justify-center items-center cursor-pointer"
                        >
                            {loading ? (
                                <span>
                                    Processing<span className="text-[var(--color-accent)] animate-pulse">....</span>
                                </span>
                            ) : (step === 1 ? 'Send Reset Code' : 'Reset Password')}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    Remember your password?{' '}
                    <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </main>
    );
}
