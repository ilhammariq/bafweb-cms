import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return addMembers(req, res);

        default:
            res.setHeader("Allow", ["POST"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function addMembers(req, res) {
    try {
        const { teamId, memberIds = [] } = req.body;

        if (!teamId) {
            return res.status(400).json({ message: "Team wajib dipilih." });
        }

        if (memberIds.length === 0) {
            return res.status(400).json({ message: "Pilih minimal satu anggota." });
        }

        const team = await prisma.teams.findUnique({ where: { id: teamId } });
        if (!team) {
            return res.status(404).json({ message: "Team tidak ditemukan." });
        }

        const existing = await prisma.teams_members.findMany({
            where: {
                team_id: teamId,
                member_id: { in: memberIds },
            },
            select: { member_id: true },
        });
        const existingIds = new Set(existing.map((e) => e.member_id));
        const newMemberIds = memberIds.filter((id) => !existingIds.has(id));

        if (newMemberIds.length === 0) {
            return res.status(409).json({ message: "Semua anggota sudah ada di team ini." });
        }

        const created = await prisma.teams_members.createMany({
            data: newMemberIds.map((memberId) => ({
                id: randomUUID(),
                team_id: teamId,
                member_id: memberId,
            })),
        });

        return res.status(201).json({
            message: "Anggota berhasil ditambahkan.",
            count: created.count,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}