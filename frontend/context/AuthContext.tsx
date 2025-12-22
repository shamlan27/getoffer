'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    verifyEmail: (data: { email: string; otp: string }) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: any) => Promise<void>;
    requestAccountDeletion: () => Promise<void>;
    deleteAccount: (otp: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    register: async () => { },
    verifyEmail: async () => { },
    forgotPassword: async () => { },
    resetPassword: async () => { },
    requestAccountDeletion: async () => { },
    deleteAccount: async () => { },
    logout: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async (token?: string) => {
        try {
            const currentToken = token || localStorage.getItem('token');
            if (currentToken) {
                const response = await axios.get('/api/user', {
                    headers: { Authorization: `Bearer ${currentToken}` }
                });
                setUser(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials: any) => {
        const response = await axios.get('/sanctum/csrf-cookie');
        const loginResponse = await axios.post('/api/login', credentials);
        const token = loginResponse.data.access_token;
        localStorage.setItem('token', token);
        await fetchUser(token);
        router.push('/');
    };

    const register = async (data: any) => {
        await axios.get('/sanctum/csrf-cookie');
        await axios.post('/api/register', data);
        // Don't auto login, wait for verification
    };

    const verifyEmail = async (data: { email: string; otp: string }) => {
        await axios.post('/api/auth/verify-email', data);
        // After verification, you might want to auto-login or ask user to login
        // await login({ email: data.email, password: '' }); // Password not available here, so maybe just ask user to login.
        // Actually, for better UX, let's just allow the user to login manually after verification or assume the token from register is valid if we stored it?
        // The current register implementation returns a token. We could verify and THEN use that token?
        // Simpler for now: Verification logic just calls API. The user can then login.
    };

    const forgotPassword = async (email: string) => {
        await axios.post('/api/auth/forgot-password', { email });
    };

    const resetPassword = async (data: any) => {
        await axios.post('/api/auth/reset-password', data);
    };

    const requestAccountDeletion = async () => {
        await axios.post('/api/auth/request-account-deletion');
    };

    const deleteAccount = async (otp: string) => {
        await axios.post('/api/auth/delete-account', { otp });
        setUser(null);
        router.push('/');
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmail, forgotPassword, resetPassword, requestAccountDeletion, deleteAccount, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
