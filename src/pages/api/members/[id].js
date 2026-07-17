import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case "GET":
            return getMember(req, res, id);

        default:
            res.setHeader("Allow", ["GET"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getMember(req, res, id) {
    try {
        if (!id) {
            return res.status(400).json({
                message: "Member ID wajib diisi.",
            });
        }

        const member = await prisma.members.findUnique({
            where: {
                id,
            },
        });

        if (!member) {
            return res.status(404).json({
                message: "Member tidak ditemukan.",
            });
        }

        return res.status(200).json({
            id: member.id,
            name: member.member_name,
            email: member.member_email,
            role: member.role,
            status: member.is_active,
            avatar: member.avatar,
            avatarIndex: member.avatar_index,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

function formatDate(date) {
    const bulan = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")} ${bulan[d.getMonth()]
        } ${d.getFullYear()}`;
}