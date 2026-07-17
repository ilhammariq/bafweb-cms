import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed.' });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    try {
        const member = await prisma.members.findUnique({
            where: { member_email: email },
            include: { user_access: true },
        });

        const invalidCredentials = () =>
            res.status(401).json({ message: 'Email atau password salah.' });

        if (!member || !member.is_active || !member.user_access) {
            return invalidCredentials();
        }

        if (!member.user_access.is_active) {
            return res.status(403).json({ message: 'Akun tidak aktif. Hubungi admin.' });
        }

        const isPasswordValid = await bcrypt.compare(password, member.user_access.password);
        if (!isPasswordValid) {
            return invalidCredentials();
        }

        const token = signToken({
            member_id: member.id,
            email: member.member_email,
            name: member.member_name,
            role: member.user_access.role_access,
        });

        setAuthCookie(res, token);

        prisma.user_access
            .update({
                where: { member_id: member.id },
                data: { last_login: new Date() },
            })
            .catch((err) => console.error('Gagal update last_login:', err));

        return res.status(200).json({
            member: {
                id: member.id,
                name: member.member_name,
                email: member.member_email,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan. Coba lagi.' });
    }
}