import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id, category, active } = req.query;

        try {
            const events = await prisma.events.findMany({
                where: {
                    ...(id && { id }),
                    ...(category && { category_code: category }),
                    ...(active !== undefined && { is_active: active === 'true' }),
                },
                orderBy: {
                    dtm_crt: 'desc',
                },
                include: {
                    event_sessions: {
                        orderBy: {
                            event_date: 'asc',
                        },
                    },
                },
            });

            const formattedEvents = events.map((item) => ({
                id: item.id,
                title: item.event_title,
                categoryCode: item.category_code,
                location: item.location,
                latitude: item.latitude,
                longitude: item.longitude,
                description: item.event_desc,
                isActive: item.is_active,
                sessions: item.event_sessions.map((session) => ({
                    id: session.id,
                    date: session.event_date.toISOString().split('T')[0],
                    startTime: formatTime(session.start_time),
                    endTime: formatTime(session.end_time),
                    isActive: session.is_active,
                })),
                createdAt: formatDate(item.dtm_crt),
                updatedAt: formatDate(item.dtm_upd),
            }));

            return res.status(200).json(formattedEvents);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const {
            eventTitle,
            categoryCode,
            location,
            latitude,
            longitude,
            eventDesc,
            sessions = [],
        } = req.body;

        try {
            if (!eventTitle || !categoryCode || !location) {
                return res.status(400).json({
                    error: 'event_title, category_code, dan location wajib diisi',
                });
            }

            const result = await prisma.$transaction(async (tx) => {
                const newEvent = await tx.events.create({
                    data: {
                        id: crypto.randomUUID(),
                        event_title: eventTitle,
                        category_code: categoryCode,
                        location,
                        latitude,
                        longitude,
                        event_desc: eventDesc,
                    },
                });

                if (sessions.length > 0) {
                    await tx.event_sessions.createMany({
                        data: sessions.map((s) => ({
                            id: crypto.randomUUID(),
                            event_id: newEvent.id,
                            event_date: new Date(s.eventDate),
                            start_time: toTimeValue(s.startTime),
                            end_time: toTimeValue(s.endTime),
                        })),
                    });
                }

                return newEvent;
            });

            return res.status(201).json(result);
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

function toTimeValue(time) {
    if (!time) return null;
    return new Date(`1970-01-01T${time}:00Z`);
}

function formatTime(date) {
    if (!date) return null;
    const d = new Date(date);
    const jam = String(d.getUTCHours()).padStart(2, '0');
    const menit = String(d.getUTCMinutes()).padStart(2, '0');
    return `${jam}:${menit}`;
}