import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { requiredField } from '../Form/Validator/Validator'
import TextInput from '../Form/Fields/TextInput';
import FormField from '../Form/Fields/FormField';
import { useCreateMember, useSearchMembers } from '@/hooks/useMember';
import { LucideTrash, Search, Trash, Trash2, Trash2Icon } from 'lucide-react';
import { Avatar } from '../Common/Avatar';
import { useCreateTeams } from '@/hooks/useTeam';

const staticFields = [
    {
        name: 'teamName',
        label: 'Nama Tim',
        component: TextInput,
        props: { placeholder: 'Masukkan nama tim' },
        validators: requiredField('Nama Tim'),
    },
    {
        name: 'teamDescription',
        label: 'Deskripsi Tim',
        component: TextInput,
        props: { placeholder: 'Masukkan deskripsi tim' },
        validators: requiredField('Deskripsi Tim'),
    }
]

export default function AddTeam() {
    const { mutate: createTeams, isPending: isSubmitting } = useCreateTeams();

    const [searchTerm, setSearchTerm] = useState('')
    const { data: searchResults, isFetching: isSearching } = useSearchMembers(searchTerm)

    const form = useForm({
        defaultValues: {
            teamName: '',
            teamDescription: '',
            members: [],
        },
        onSubmit: async ({ value }) => {
            createTeams(value, {
                onSuccess: () => {
                    form.reset();
                    setSearchTerm('')
                },
                onError: (error) => {
                    console.error(error.message);
                },
            });
        },
    })

    return (
        <div className="py-5">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="max-w-md w-full space-y-6"
            >
                {staticFields.map(({ name, label, component: Component, props, validators }) => {
                    return (
                        <FormField
                            key={name}
                            form={form}
                            name={name}
                            label={label}
                            validators={validators}
                        >
                            <Component {...props} />
                        </FormField>
                    )
                })}

                <form.Field name="members" mode="array">
                    {(membersField) => {
                        const selectedIds = new Set(membersField.state.value.map((m) => m.id))
                        const filteredResults = searchResults.filter((u) => !selectedIds.has(u.id))
                        const count = membersField.state.value.length

                        return (
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <label className="text-sm font-semibold text-gray-900">
                                        Anggota Tim
                                    </label>
                                    {count > 0 && (
                                        <span className="text-xs font-medium text-gray-400">
                                            {count} orang dipilih
                                        </span>
                                    )}
                                </div>

                                <div className="relative">
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
                                                <div className="px-3.5 py-3 text-sm text-gray-400">
                                                    Mencari...
                                                </div>
                                            )}

                                            {!isSearching && filteredResults.length === 0 && (
                                                <div className="px-3.5 py-3 text-sm text-gray-400">
                                                    Tidak ada hasil untuk "{searchTerm}"
                                                </div>
                                            )}

                                            <div className="max-h-56 overflow-y-auto">
                                                {!isSearching && filteredResults.map((member) => {
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={member.id}
                                                            onClick={() => {
                                                                membersField.pushValue({
                                                                    id: member.id,
                                                                    name: member.name,
                                                                    email: member.email,
                                                                    avatar: member.avatar,
                                                                    avatarIndex: member.avatarIndex
                                                                })
                                                                setSearchTerm('')
                                                            }}
                                                            className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <Avatar name={member.name} avatar={member.avatar} avatarIndex={member.avatarIndex} />
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm font-medium text-gray-800">
                                                                    {member.name}
                                                                </span>
                                                                <span className="block truncate text-xs text-gray-500">
                                                                    {member.email}
                                                                </span>
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {count > 0 && (
                                    <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                                        {membersField.state.value.map((member, index) => {
                                            return (
                                                <li
                                                    key={member.id}
                                                    className="group flex items-center justify-between gap-3 bg-white px-3.5 py-2.5 transition-colors hover:bg-gray-50"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <Avatar name={member.name} avatar={member.avatar} avatarIndex={member.avatarIndex} />
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-medium text-gray-900">
                                                                {member.name}
                                                            </span>
                                                            <span className="block truncate text-xs text-gray-500">
                                                                {member.email}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => membersField.removeValue(index)}
                                                        aria-label={`Hapus ${member.name}`}
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-300 hover:text-red-500  cursor-pointer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}

                                {count === 0 && (
                                    <p className="rounded-lg border border-dashed border-gray-200 py-4 text-center text-xs text-gray-400">
                                        Belum ada anggota ditambahkan
                                    </p>
                                )}
                            </div>
                        )
                    }}
                </form.Field>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
            </form>
        </div>
    )
}