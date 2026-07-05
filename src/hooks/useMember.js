import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchMembers(search) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`/api/members${query}`);

    if (!res.ok) {
        throw new Error('Gagal mengambil data member');
    }

    return res.json();
}

async function createMember(payload) {
    const res = await fetch('/api/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan member');
    }

    return data;
}

export function useMembers() {
    return useQuery({
        queryKey: ['members'],
        queryFn: () => fetchMembers(),
    });
}

// Debounce kecil biar gak nembak API tiap keystroke
function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export function useSearchMembers(search) {
    const debouncedSearch = useDebouncedValue(search);

    const query = useQuery({
        queryKey: ['members', 'search', debouncedSearch],
        queryFn: () => fetchMembers(debouncedSearch),
        enabled: debouncedSearch.trim().length > 0,
        staleTime: 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    return {
        data: query.data ?? [],
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
    };
}

export function useCreateMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMember,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['members'],
            });
        },
    });
}