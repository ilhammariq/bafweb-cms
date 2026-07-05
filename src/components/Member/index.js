import { useMembers } from "@/hooks/useMember";
import { Mail, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "../Common/Avatar";
import { StatusBadge } from "../Common/Badge";
import ActionsMenu from "../Common/ActionMenu";

export default function Member() {
    const { data: members = [], isLoading, error, refetch } = useMembers();
    const [query, setQuery] = useState("");

    const filteredMembers = members.filter(
        (member) =>
            member.name.toLowerCase().includes(query.toLowerCase()) ||
            member.email.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Member</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola anggota dan peran mereka di setiap tim
                    </p>
                </div>
                <Link
                    href="/member/add"
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Member
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
                    placeholder="Cari nama atau email..."
                    className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-500">Memuat data member...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={refetch}
                            className="text-sm text-teal-600 hover:underline mt-2"
                        >
                            Coba lagi
                        </button>
                    </div>
                ) : filteredMembers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left font-medium text-slate-500 px-5 py-3">Nama</th>
                                    <th className="text-left font-medium text-slate-500 px-5 py-3">Role</th>
                                    <th className="text-left font-medium text-slate-500 px-5 py-3">Team</th>
                                    <th className="text-left font-medium text-slate-500 px-5 py-3">Status</th>
                                    <th className="text-left font-medium text-slate-500 px-5 py-3">Bergabung</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member, index) => (
                                    <tr
                                        key={member.id}
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={member.name} letter={member.avatar} index={index} />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">
                                                        {member.name}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-slate-400 truncate">
                                                        <Mail size={12} />
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600">{member.role}</td>
                                        <td className="px-5 py-3.5">
                                            <span className=" space-x-2">
                                                {member.team.length > 0 ? (
                                                    member.team.map((team) => (
                                                        <span
                                                            key={team}
                                                            className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                                                        >
                                                            {team}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                                                        Belum bergabung tim
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={member.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500">{member.joinedAt}</td>
                                        <td className="px-5 py-3.5 text-right">
                                            <ActionsMenu
                                                onEdit={() => console.log("edit", member)}
                                                onDelete={() => console.log("delete", member)}
                                                onDetail={() => console.log("detail", member)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <p className="text-slate-500">Member tidak ditemukan</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Coba kata kunci lain atau tambah member baru
                        </p>
                    </div>
                )}
            </div>

            {!isLoading && !error && filteredMembers.length > 0 && (
                <p className="text-sm text-slate-400 mt-4">
                    Menampilkan {filteredMembers.length} dari {members.length} member
                </p>
            )}
        </div>
    )
}