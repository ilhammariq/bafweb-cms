import { getAuthUser } from '@/lib/auth';

export default function handler(req, res) {
    const user = getAuthUser(req);

    if (!user) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    const userRes = {
        member_id: user.member_id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    return res.status(200).json({
        user: userRes
    });
}