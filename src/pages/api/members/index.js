import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getMembers(req, res);

        case "POST":
            return createMember(req, res);

        default:
            res.setHeader("Allow", ["GET", "POST"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getMembers(req, res) {
    try {
        const { search } = req.query;

        const where = search
            ? {
                OR: [
                    { member_name: { contains: search, mode: "insensitive" } },
                    { member_email: { contains: search, mode: "insensitive" } },
                ],
            }
            : undefined;

        const members = await prisma.members.findMany({
            where,
            include: {
                role: true,
                teams_members: {
                    include: {
                        team: true,
                    },
                },
            },
            orderBy: {
                dtm_crt: "desc",
            },
            take: search ? 10 : undefined,
        });
        const formattedMembers = members.map((m) => ({
            id: m.id,
            name: m.member_name,
            email: m.member_email,
            role: m.role?.role_name || null,
            team: m.teams_members.map((tm) => tm.team?.team_name).filter(Boolean),
            status: m.is_active ? "active" : "inactive",
            joinedAt: formatDate(m.dtm_crt),
            avatar: m.avatar,
            avatarIndex: m.avatar_index
        }));

        return res.status(200).json(formattedMembers);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

async function createMember(req, res) {
    try {
        const { memberName, memberEmail, memberRole, memberAvatarIndex } = req.body;

        if (!memberName || !memberEmail || !memberRole) {
            return res.status(400).json({
                message: "Semua field wajib diisi.",
            });
        }

        const existing = await prisma.members.findUnique({
            where: {
                member_email: memberEmail,
            },
        });

        if (existing) {
            return res.status(409).json({
                message: "Email sudah terdaftar.",
            });
        }

        const member = await prisma.members.create({
            data: {
                id: randomUUID(),
                member_name: memberName.trim(),
                member_email: memberEmail.trim().toLowerCase(),
                avatar: "",
                role_id: memberRole,
                is_active: true,
                avatar_index: memberAvatarIndex,
            },
        });

        return res.status(201).json({
            message: "Member berhasil ditambahkan.",
            data: member,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

// Helper format tanggal
function formatDate(date) {
    const bulan = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")} ${bulan[d.getMonth()]
        } ${d.getFullYear()}`;
}