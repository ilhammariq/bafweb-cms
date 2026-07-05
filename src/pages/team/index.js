import { useEffect, useState } from 'react'
import { Search, Plus, Users, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { AvatarStack } from '@/components/Common/Avatar';
import { StatusBadge } from '@/components/Common/Badge';
import ActionsMenu from '@/components/Common/ActionMenu';

function TeamCard({ team }) {
    return (
        <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-100 transition-all">
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{team.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{team.description}</p>
                </div>
                <ActionsMenu
                    onEdit={() => console.log("edit", member)}
                    onDelete={() => console.log("delete", member)}
                    onDetail={() => console.log("detail", member)}
                />
            </div>

            <div className="flex items-center justify-between mt-5">
                <AvatarStack members={team.members} />
                <StatusBadge status={team.status} />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                    <Users size={14} />
                    {team.members.length} anggota
                </span>
                <span>Dibuat {team.createdAt}</span>
            </div>
        </div>
    )
}

export default function Index() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(data);
    };

    console.log(teams);

    const [query, setQuery] = useState('')

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">List Team</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola tim dan anggota tim di satu tempat
                    </p>
                </div>
                <Link
                    href="/team/add"
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Team
                </Link>
            </div>

            <div className="relative mb-6">
                <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari squad..."
                    className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center">
                    <Users className="mx-auto text-slate-300" size={40} />
                    <p className="text-slate-500 mt-3">Squad tidak ditemukan</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Coba kata kunci lain atau buat squad baru
                    </p>
                </div>
            )}
        </div>
    )
}