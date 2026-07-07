import React, { useState } from 'react';
import {
    CalendarDays,
    Search,
    MapPin,
    Clock,
    Users,
    CalendarX,
    Dumbbell,
    Palmtree,
    PartyPopper,
    Mountain,
    Music,
    Tag,
    Plus,
} from 'lucide-react';
import Link from 'next/link';

const statusEvents = ['Upcoming', 'Ongoing', 'Past'];

const EVENTS = [
    {
        id: 1,
        title: 'Inter-department Badminton Tournament',
        category: 'Sports',
        date: '2026-07-14',
        time: '09:00 - 13:00',
        location: 'Senayan Sports Hall',
        attendees: 32,
        status: statusEvents[0],
    },
    {
        id: 2,
        title: 'Weekend Ice Skating',
        category: 'Travel & Leisure',
        date: '2026-07-19',
        time: '15:00 - 17:00',
        location: 'Ice Palace, Kelapa Gading',
        attendees: 20,
        status: statusEvents[0],
    },
    {
        id: 3,
        title: 'Bandung Weekend Trip',
        category: 'Travel & Leisure',
        date: '2026-08-01',
        time: '06:00 - 21:00',
        location: 'Lembang, Bandung',
        attendees: 45,
        status: statusEvents[0],
    },
    {
        id: 4,
        title: 'Team Bonding Dinner',
        category: 'Social',
        date: '2026-07-11',
        time: '18:30 - 21:00',
        location: 'Skye Restaurant',
        attendees: 28,
        status: statusEvents[1],
    },
    {
        id: 5,
        title: 'Mount Bromo Hiking Trip',
        category: 'Outdoor',
        date: '2026-08-15',
        time: '02:00 - 18:00',
        location: 'Mount Bromo, East Java',
        attendees: 16,
        status: statusEvents[1],
    },
    {
        id: 6,
        title: 'Friday Night Karaoke',
        category: 'Entertainment',
        date: '2026-06-27',
        time: '19:00 - 22:00',
        location: 'Inul Vizta, Kemang',
        attendees: 14,
        status: statusEvents[2],
    },
];

// Add or edit categories here — icon + color for each general category
const CATEGORY_CONFIG = {
    Sports: { icon: Dumbbell, style: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
    'Travel & Leisure': { icon: Palmtree, style: 'bg-teal-50 text-teal-700 ring-teal-600/20' },
    Social: { icon: PartyPopper, style: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
    Outdoor: { icon: Mountain, style: 'bg-green-50 text-green-700 ring-green-600/20' },
    Entertainment: { icon: Music, style: 'bg-pink-50 text-pink-700 ring-pink-600/20' },
};

const DEFAULT_CATEGORY_CONFIG = {
    icon: Tag,
    style: 'bg-gray-50 text-gray-700 ring-gray-500/20',
};

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

function EventCard({ event }) {
    const { icon: CategoryIcon, style: categoryStyle } =
        CATEGORY_CONFIG[event.category] || DEFAULT_CATEGORY_CONFIG;

    return (
        <div className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition">
            <div className="flex sm:flex-col items-center sm:items-start justify-start gap-2 sm:gap-0 sm:w-20 shrink-0">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-semibold text-gray-800 leading-none">
                        {new Date(event.date).getDate()}
                    </span>
                </div>
            </div>

            {/* Content */}
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
                </div>

                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {event.title}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(event.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendees} attendees
                    </span>
                </div>
            </div>

            {/* Action */}
            <div className="flex sm:flex-col justify-end sm:justify-center shrink-0">
                <button className="text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                    View details
                </button>
            </div>
        </div>
    );
}

export default function Event() {
    const [query, setQuery] = useState('');

    const filteredEvents = EVENTS.filter((e) => {
        const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
        return matchesQuery;
    });


    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Event</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage and track all events.
                    </p>
                </div>
                <Link
                    href="/event/add"
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Add Event
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

            {filteredEvents.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-gray-200 rounded-xl">
                    <CalendarX className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-700">No events found.</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </div>
    );
}