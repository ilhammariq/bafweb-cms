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

            const formattedTeams = teams.map((team) => ({
                id: team.id,
                name: team.team_name,
                description: team.team_desc,
                members: team.teams_members.map((tm) => ({
                    id: tm.member.id,
                    name: tm.member.member_name,
                    avatar: tm.member.avatar,
                    avatarIndex: tm.member.avatar_index
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
        const { teamName, teamDescription, members = [] } = req.body;

        console.log(members)

        if (!teamName) {
            return res.status(400).json({ error: 'Nama tim wajib diisi.' });
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                const newTeam = await tx.teams.create({
                    data: {
                        id: crypto.randomUUID(),
                        team_name: teamName,
                        team_desc: teamDescription,
                    },
                });

                if (members.length > 0) {
                    await tx.teams_members.createMany({
                        data: members.map((member) => ({
                            id: crypto.randomUUID(),
                            team_id: newTeam.id,
                            member_id: member.id,
                        })),
                    });
                }

                return newTeam;
            });

            return res.status(201).json(result);
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