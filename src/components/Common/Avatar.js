export const AvatarColors = ['bg-teal-600', 'bg-indigo-600', 'bg-amber-600', 'bg-rose-600', 'bg-violet-600']

const getInitials = (name) => {
    const parts = name.trim().split(' ').filter(Boolean)
    if (parts.length === 0) return ''
    return parts.map((p) => p[0]).join('').toUpperCase()
}

export function Avatar({ name, avatar, avatarIndex }) {
    return (
        <div
            title={name}
            className={`w-9 h-9 rounded-full ${AvatarColors[avatarIndex]} text-white text-sm font-semibold flex items-center justify-center shrink-0`}
        >
            {avatar ? <img src={avatar} alt={name}/> : getInitials(name)}
        </div>
    )
}

export function AvatarStack({ members }) {
    if (!members || members.length == 0) return null;

    const visible = members.slice(0, 3)
    const remaining = members.length - visible.length

    return (
        <div className="flex items-center mr-2">
            {visible.map((member, i) => (
                <div
                    key={i}
                    title={member.name}
                    className={`w-8 h-8 rounded-full ${AvatarColors[member.avatarIndex]} text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white -ml-2 first:ml-0`}
                >
                    {member.avatar ? <img src={member.avatar} alt={member.name} /> : getInitials(member.name)}
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