import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const roles = await prisma.roles.findMany({
                orderBy: {
                    dtm_crt: 'desc',
                },
            });

            const formattedRoles = roles.map((role) => ({
                id: role.id,
                name: role.role_name,
                isActive: role.is_active,
                createdAt: formatDate(role.dtm_crt),
                updatedAt: formatDate(role.dtm_upd),
            }));

            return res.status(200).json(formattedRoles);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { role_name } = req.body;

        if (!role_name) {
            return res.status(400).json({ error: 'role_name wajib diisi' });
        }

        try {
            const newRole = await prisma.roles.create({
                data: {
                    id: crypto.randomUUID(),
                    role_name: role_name,
                    is_active: true, // Sesuai default value di skema database kamu
                },
            });
            return res.status(201).json(newRole);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

// Helper untuk format tanggal ke "12 Jun 2026"
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