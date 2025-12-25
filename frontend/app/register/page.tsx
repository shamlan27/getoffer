'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';

export default function Register() {
    const { register, verifyEmail, login } = useAuth();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (step === 1) {
                if (password !== passwordConfirmation) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await register({ name, email, password, password_confirmation: passwordConfirmation });
                setStep(2);
            } else {
                await verifyEmail({ email, otp });
                alert('Email verified successfully! You can now login.');
                // Attempt to auto-login or redirect
                try {
                    await login({ email, password });
                } catch (loginErr) {
                    // If auto-login fails, redirect to login page logic handles it or user manually logs in
                    window.location.href = '/login';
                }
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                // If validation errors exist, format them
                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || (step === 1 ? 'Registration failed' : 'Verification failed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/redirect`;
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 py-12 relative overflow-hidden text-neutral-900 dark:text-white">
            <div className="absolute inset-0 bg-gradient-to-tl from-[var(--color-secondary)] via-transparent to-[var(--color-primary)] opacity-10 animate-gradient pointer-events-none" />

            <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-800 relative z-10 glass-card">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                        {step === 1 ? 'Join GetOffer' : 'Verify Email'}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        {step === 1 ? 'Create an account to save deals and get alerts' : `Enter the code sent to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm">
                        <span className="font-bold mr-2">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
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
                                {/* Password Strength Meter */}
                                {password && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex space-x-1 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                                            <div className={`flex-1 transition-all duration-300 ${password.length >= 8 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div className={`flex-1 transition-all duration-300 ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                                            <div className={`flex-1 transition-all duration-300 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                                            <div className={`flex-1 transition-all duration-300 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                                        </div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {password.length < 8 && 'Min 8 chars • '}
                                            {(!/[A-Z]/.test(password) || !/[a-z]/.test(password)) && 'Mixed case • '}
                                            {!/[0-9]/.test(password) && 'Number • '}
                                            {!/[^A-Za-z0-9]/.test(password) && 'Symbol'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm Password</label>
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
                    ) : (
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
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 flex justify-center items-center mt-6 cursor-pointer"
                    >
                        {loading ? (
                            <span>
                                {step === 1 ? 'Creating Account' : 'Verifying'}
                                <span className="text-[var(--color-accent)] animate-pulse">....</span>
                            </span>
                        ) : (step === 1 ? 'Create Account' : 'Verify Email')}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">Or continue with</span>
                        </div>
                    </div>
                </form>

                {step === 1 && (
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                )}

                <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </main>
    );
}
