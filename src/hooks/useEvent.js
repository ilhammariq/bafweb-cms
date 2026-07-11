import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/events${query ? `?${query}` : ''}`);

    if (!res.ok) {
        throw new Error('Gagal mengambil data events');
    }

    return res.json();
}

async function createEvent(payload) {
    const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan event');
    }

    return data;
}

export function useEvents(params = {}) {
    return useQuery({
        queryKey: ['events', params],
        queryFn: () => fetchEvents(params),
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['events'],
            });
        },
    });
}