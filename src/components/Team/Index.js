import { useEffect, useState } from 'react'
import { Search, Plus, Users, MoreVertical, X, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarStack } from '@/components/Common/Avatar';
import { StatusBadge } from '@/components/Common/Badge';
import ActionsMenu from '@/components/Common/ActionMenu';
import { useAddMemberTeam, useTeams } from '@/hooks/useTeam';
import { useSearchMembers } from '@/hooks/useMember';

function TeamCard({ team, onAddMember }) {
    return (
        <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-100 transition-all">
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{team.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{team.description}</p>
                </div>
                <ActionsMenu
                    onEdit={() => console.log("edit", team)}
                    onDelete={() => console.log("delete", team)}
                    onDetail={() => console.log("detail", team)}
                />
            </div>

            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center">
                    <AvatarStack members={team.members} />
                    <button
                        type="button"
                        onClick={() => onAddMember(team)}
                        title="Tambah anggota"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                        <Plus size={14} />
                    </button>
                </div>
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

function AddMemberModal({ team, onClose }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selected, setSelected] = useState([])
    const { data: searchResults = [], isFetching: isSearching } = useSearchMembers(searchTerm)
    const { mutate: addMembers, isPending } = useAddMemberTeam(team.id)

    const existingIds = new Set(team.members.map((m) => m.id))
    const selectedIds = new Set(selected.map((m) => m.id))

    const filteredResults = searchResults.filter((u) => !selectedIds.has(u.id))

    const handleSelect = (member) => {
        if (existingIds.has(member.id)) {
            return
        }
        setSelected((prev) => [...prev, member])
        setSearchTerm('')
    }

    const handleRemove = (memberId) => {
        setSelected((prev) => prev.filter((m) => m.id !== memberId))
    }

    const handleSave = () => {
        addMembers(
            { teamId: team.id, memberIds: selected.map((m) => m.id) },
            {
                onSuccess: () => {
                    onClose()
                },
            }
        )
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Tambah anggota</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{team.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="relative mt-4">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari nama atau email anggota..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />

                    {searchTerm.trim() !== '' && (
                        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-gray-900/5">
                            {isSearching && (
                                <div className="px-3.5 py-3 text-sm text-gray-400">Mencari...</div>
                            )}

                            {!isSearching && filteredResults.length === 0 && (
                                <div className="px-3.5 py-3 text-sm text-gray-400">
                                    Tidak ada hasil untuk "{searchTerm}"
                                </div>
                            )}

                            <div className="max-h-56 overflow-y-auto">
                                {!isSearching && filteredResults.map((member) => {
                                    const alreadyInTeam = existingIds.has(member.id)
                                    return (
                                        <button
                                            type="button"
                                            key={member.id}
                                            onClick={() => handleSelect(member)}
                                            className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${alreadyInTeam ? 'opacity-50 hover:bg-white' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <Avatar name={member.name} avatar={member.avatar} avatarIndex={member.avatarIndex} />
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-gray-800">
                                                        {member.name}
                                                    </span>
                                                    <span className="block truncate text-xs text-gray-500">
                                                        {member.email}
                                                    </span>
                                                </span>
                                            </span>
                                            {alreadyInTeam && (
                                                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                                    Sudah di tim
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {selected.length > 0 && (
                    <>
                        <p className="text-xs font-medium text-gray-400 mt-4 mb-2">
                            {selected.length} anggota dipilih
                        </p>
                        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                            {selected.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                                >
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <Avatar name={member.name} avatar={member.avatar} avatarIndex={member.avatarIndex} />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-gray-800">
                                                {member.name}
                                            </span>
                                            <span className="block truncate text-xs text-gray-500">
                                                {member.email}
                                            </span>
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(member.id)}
                                        aria-label={`Hapus ${member.name}`}
                                        className="text-gray-300 hover:text-red-500 cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <div className="flex gap-2 mt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isPending || selected.length === 0}
                        className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Team() {
    const { data: teams = [], isLoading, error, refetch } = useTeams();
    const [query, setQuery] = useState("");
    const [addMemberTeam, setAddMemberTeam] = useState(null)

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
                    Add Team
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
                    placeholder="Cari tim..."
                    className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {isLoading ? (
                <div className="py-16 text-center">
                    <p className="text-slate-500">Memuat data teams...</p>
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
            ) : filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeams.map((team) => (
                        <TeamCard key={team.id} team={team} onAddMember={setAddMemberTeam} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center">
                    <Users className="mx-auto text-slate-300" size={40} />
                    <p className="text-slate-500 mt-3">Tim tidak ditemukan</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Coba kata kunci lain atau buat tim baru
                    </p>
                </div>
            )}

            {addMemberTeam && (
                <AddMemberModal
                    team={addMemberTeam}
                    onClose={() => setAddMemberTeam(null)}
                />
            )}
        </div>
    )
}