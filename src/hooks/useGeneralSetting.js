import { useQuery } from '@tanstack/react-query';

async function fetchGeneralSetting(type) {
    const res = await fetch(`/api/generalsetting${type ? `?type=${type}` : ''}`);
    if (!res.ok) {
        throw new Error('Gagal mengambil data general setting');
    }
    return res.json();
}

export function useGeneralSetting(type) {
    return useQuery({
        queryKey: ['general-setting', type],
        queryFn: () => fetchGeneralSetting(type),
        enabled: !!type,
    });
}