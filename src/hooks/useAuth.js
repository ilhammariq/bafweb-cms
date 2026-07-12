// hooks/useLogin.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

async function loginRequest({ email, password }) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || 'Could not sign in. Check your credentials and try again.');
    }

    return data;
}

export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: () => {
            router.push('/dashboard');
        },
    });
}

async function fetchAuthUser() {
    const res = await fetch('/api/auth/me');

    if (!res.ok) {
        throw new Error('Gagal mengambil data user');
    }

    const data = await res.json();

    return data.user;
}

export function useAuthUser() {
    return useQuery({
        queryKey: ['auth-user'],
        queryFn: fetchAuthUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

async function logoutRequest() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Gagal logout');
    }

    return data;
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: async () => {
            queryClient.clear();
            router.replace('/');
        },
    });
}