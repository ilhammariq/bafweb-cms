import React, { useState } from 'react';
import {
    CalendarDays,
    Search,
    MapPin,
    Clock,
    CalendarX,
    Dumbbell,
    Palmtree,
    PartyPopper,
    Mountain,
    Music,
    Tag,
    Plus,
    Layers,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEvents } from '@/hooks/useEvent';
import { useGeneralSetting } from '@/hooks/useGeneralSetting';
import { useAuth } from '@/contexts/AuthProvider';


const CATEGORY_ICONS = {
    SPORTS: Dumbbell,
    TRAVEL_LEISURE: Palmtree,
    SOCIAL: PartyPopper,
    OUTDOOR: Mountain,
    ENTERTAINMENT: Music,
};

const DEFAULT_CATEGORY_ICON = Tag;
const DEFAULT_CATEGORY_STYLE = 'bg-gray-50 text-gray-700 ring-gray-500/20';

const STATUS_STYLES = {
    Upcoming: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Past: 'bg-gray-100 text-gray-500 ring-gray-500/20',
    Ongoing: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getSessionDisplay(sessions) {
    if (!sessions || sessions.length === 0) return null;
    const first = sessions[0];
    const dateStr = formatDate(first.date);
    const timeStr = first.endTime
        ? `${first.startTime} - ${first.endTime}`
        : `${first.startTime} - selesai`;
    const count = sessions.length;
    return { dateStr, timeStr, count };
}

function getEventStatus(sessions) {
    if (!sessions || sessions.length === 0) return 'Upcoming';

    const now = new Date();
    let hasOngoing = false;
    let hasUpcoming = false;

    for (const s of sessions) {
        const start = new Date(`${s.date}T${s.startTime || '00:00'}:00`);
        const end = s.endTime
            ? new Date(`${s.date}T${s.endTime}:00`)
            : new Date(`${s.date}T23:59:00`);

        if (start <= now && now <= end) hasOngoing = true;
        else if (start > now) hasUpcoming = true;
    }

    if (hasOngoing) return 'Ongoing';
    if (hasUpcoming) return 'Upcoming';
    return 'Past';
}

function EventCard({ event }) {
    const CategoryIcon = CATEGORY_ICONS[event.categoryCode] || DEFAULT_CATEGORY_ICON;
    const categoryStyle = event.categoryStyle || DEFAULT_CATEGORY_STYLE;

    const sessionInfo = getSessionDisplay(event.sessions);

    return (
        <div className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition">
            {/* Tanggal besar (dari sesi pertama) */}
            <div className="flex sm:flex-col items-center sm:items-start justify-start gap-2 sm:gap-0 sm:w-20 shrink-0">
                {sessionInfo ? (
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-400 uppercase">
                            {new Date(event.sessions[0].date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-semibold text-gray-800 leading-none">
                            {new Date(event.sessions[0].date).getDate()}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gray-100 text-gray-400">
                        <CalendarX className="w-6 h-6" />
                    </div>
                )}
            </div>

            {/* Konten utama */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${categoryStyle}`}
                    >
                        <CategoryIcon className="w-3 h-3" />
                        {event.category}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[event.status]}`}
                    >
                        {event.status}
                    </span>
                    {sessionInfo && sessionInfo.count > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium ring-1 ring-blue-600/20">
                            <Layers className="w-3 h-3" />
                            {sessionInfo.count} sesi
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {event.title}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {sessionInfo && (
                        <>
                            <span className="inline-flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {sessionInfo.dateStr}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {sessionInfo.timeStr}
                                {sessionInfo.count > 1 && (
                                    <span className="text-gray-400 ml-0.5">
                                        (+{sessionInfo.count - 1} sesi lainnya)
                                    </span>
                                )}
                            </span>
                        </>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                    </span>
                </div>
            </div>

            {/* Aksi */}
            <div className="flex sm:flex-col justify-end sm:justify-center shrink-0">
                <button className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                    Lihat detail
                </button>
            </div>
        </div>
    );
}

export default function Event() {
    const [query, setQuery] = useState('');

    const { data: rawEvents, isLoading, isError, error } = useEvents({ active: true });
    const { data: categorySettings } = useGeneralSetting('CATEGORY_EVENT');
    const { data: categoryColors } = useGeneralSetting('CATEGORY_COLOR');
    const { data: user } = useAuth();

    const categoryLabel = (code) =>
        categorySettings?.find((c) => c.code === code)?.desc || code;

    const categoryStyle = (code) =>
        categoryColors?.find((c) => c.code === code)?.desc || DEFAULT_CATEGORY_STYLE;

    const events = (rawEvents || []).map((e) => ({
        id: e.id,
        title: e.title,
        categoryCode: e.categoryCode,
        category: categoryLabel(e.categoryCode),
        categoryStyle: categoryStyle(e.categoryCode),
        location: e.location,
        status: getEventStatus(e.sessions),
        sessions: e.sessions,
    }));

    const filteredEvents = events.filter((e) =>
        e.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Event</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola dan pantau semua event.
                    </p>
                </div>
                <Link
                    href="/event/add"
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Event
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
                    placeholder="Cari event..."
                    className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-gray-200 rounded-xl">
                    <Loader2 className="w-6 h-6 text-gray-300 mb-3 animate-spin" />
                    <p className="text-sm font-medium text-gray-700">Memuat event...</p>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-red-200 rounded-xl">
                    <CalendarX className="w-8 h-8 text-red-300 mb-3" />
                    <p className="text-sm font-medium text-red-600">Gagal memuat event.</p>
                    <p className="text-xs text-gray-400 mt-1">{error?.message}</p>
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-gray-200 rounded-xl">
                    <CalendarX className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-700">Tidak ada event.</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Coba ubah kata kunci pencarian.
                    </p>
                </div>
            )}
        </div>
    );
}