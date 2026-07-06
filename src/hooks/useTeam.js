import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchTeams() {
    const res = await fetch(`/api/teams`);

    if (!res.ok) {
        throw new Error('Gagal mengambil data teams');
    }

    return res.json();
}

async function createTeams(payload) {
    const res = await fetch('/api/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan teams');
    }

    return data;
}

async function addMemberTeam(payload){
    const res = await fetch('/api/teams/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan members ke team');
    }

    return data;
}

export function useTeams() {
    return useQuery({
        queryKey: ['teams'],
        queryFn: () => fetchTeams(),
    });
}

export function useCreateTeams() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTeams,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['teams'],
            });
        },
    });
}

export function useAddMemberTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addMemberTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['membersteam'],
            });
        },
    });
}