export function StatusBadge({ status }) {
    const isActive = status === 'active'
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-500' : 'bg-slate-400'}`} />
            {isActive ? 'Aktif' : 'Nonaktif'}
        </span>
    )
}