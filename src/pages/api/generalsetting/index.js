import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { type } = req.query;

        try {
            const gensett = await prisma.general_setting.findMany({
                where: type
                    ? { general_setting_type_code: type }
                    : undefined,
                orderBy: {
                    dtm_crt: 'desc',
                },
                include: {
                    general_setting_type: true,
                },
            });

            const formattedGensett = gensett.map((item) => ({
                id: item.id,
                typeCode: item.general_setting_type_code,
                typeDesc: item.general_setting_type?.general_setting_type_desc,
                code: item.general_setting_code,
                desc: item.general_setting_desc,
                isActive: item.is_active,
                createdAt: formatDate(item.dtm_crt),
                updatedAt: formatDate(item.dtm_upd),
            }));

            return res.status(200).json(formattedGensett);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

function formatDate(date) {
    if (!date) return '-';
    const bulan = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    const d = new Date(date);
    const tanggal = String(d.getDate()).padStart(2, '0');
    const namaBulan = bulan[d.getMonth()];
    const tahun = d.getFullYear();
    return `${tanggal} ${namaBulan} ${tahun}`;
}