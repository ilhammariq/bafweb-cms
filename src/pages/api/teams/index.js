import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const teams = await prisma.teams.findMany({
                include: {
                    teams_members: {
                        include: {
                            member: true,
                        },
                    },
                },
                orderBy: {
                    dtm_crt: 'desc',
                },
            });

            // Mapping ke format sesuai spec JSON
            const formattedTeams = teams.map((team) => ({
                id: team.id,
                name: team.team_name,
                description: team.team_desc,
                members: team.teams_members.map((tm) => ({
                    name: tm.member.member_name,
                    avatar: tm.member.avatar || tm.member.member_name.charAt(0).toUpperCase(),
                })),
                status: team.is_active ? 'active' : 'inactive',
                createdAt: formatDate(team.dtm_crt),
            }));

            return res.status(200).json(formattedTeams);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { team_name, team_desc } = req.body;
        try {
            const newTeam = await prisma.teams.create({
                data: {
                    id: crypto.randomUUID(),
                    team_name: team_name,
                    team_desc: team_desc,
                },
            });
            return res.status(201).json(newTeam);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

// Helper untuk format tanggal ke "12 Jun 2026"
function formatDate(date) {
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