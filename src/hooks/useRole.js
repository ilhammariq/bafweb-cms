import { useQuery } from '@tanstack/react-query';

async function fetchRoles() {
    const res = await fetch('/api/roles');
    if (!res.ok) {
        throw new Error('Gagal mengambil data role');
    }
    return res.json();
}

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: fetchRoles,
    });
}