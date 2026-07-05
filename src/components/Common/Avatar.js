export const avatarColors = ['bg-teal-600', 'bg-indigo-600', 'bg-amber-600', 'bg-rose-600', 'bg-violet-600']

export function Avatar({ name, letter, index }) {
    return (
        <div
            title={name}
            className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} text-white text-sm font-semibold flex items-center justify-center shrink-0`}
        >
            {letter}
        </div>
    )
}

export function AvatarStack({ members }) {
    const visible = members.slice(0, 3)
    const remaining = members.length - visible.length

    return (
        <div className="flex items-center">
            {visible.map((member, i) => (
                <div
                    key={member.name}
                    title={member.name}
                    className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white -ml-2 first:ml-0`}
                >
                    {member.avatar}
                </div>
            ))}
            {remaining > 0 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center ring-2 ring-white -ml-2">
                    +{remaining}
                </div>
            )}
        </div>
    )
}