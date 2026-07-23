import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    if (req.method === 'GET') {
        const { id } = req.query;

        try {
            const participants = await prisma.event_participants.findMany({
                where: {
                    ...(id && { member_id: id }),
                },
                orderBy: {
                    dtm_crt: 'desc',
                },
            });

            const formattedParticipant = participants.map((item) => ({
                id: item.id,
                eventId: item.event_id,
                memberId: item.member_id,
                statusCode: item.status_code,
                isActive: item.is_active,
                createdAt: formatDate(item.dtm_crt),
                updatedAt: formatDate(item.dtm_upd),
            }));

            return res.status(200).json(formattedParticipant);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const {
            eventId,
            memberId,
            status,
        } = req.body;

        try {
            if (!eventId || !memberId || !status) {
                return res.status(400).json({
                    error: 'eventId, memberId, dan status wajib diisi',
                });
            }

            const eventParticipant = await prisma.event_participants.upsert({
                where: {
                    event_id_member_id: {
                        event_id: eventId,
                        member_id: memberId,
                    },
                },
                update: {
                    status_code: status,
                },
                create: {
                    id: randomUUID(),
                    event_id: eventId,
                    member_id: memberId,
                    status_code: status,
                    is_active: true,
                },
            });

            return res.status(200).json(eventParticipant);
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