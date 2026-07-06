import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, User, Users, Calendar, CalendarDays } from 'lucide-react';

const NAVIGATION_MENU = [
    {
        name: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        name: 'Member',
        href: '/member',
        icon: <User className="w-5 h-5" />,
    },
    {
        name: 'Team',
        href: '/team',
        icon: <Users className="w-5 h-5" />,
    },
    {
        name: 'Event',
        href: '/event',
        icon: <CalendarDays className="w-5 h-5" />,
    }
    // {
    //     name: 'WFO Schedule',
    //     icon: <Calendar className="w-5 h-5" />,
    //     subMenus: [
    //         { name: 'Input List Team WFO', href: '/wfo/team' },
    //         { name: 'Input Cuti', href: '/wfo/cuti' },
    //     ],
    // },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
    const router = useRouter();
    const [wfoDropdownOpen, setWfoDropdownOpen] = useState(false);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden" onClick={toggleSidebar} />
            )}

            {/* Container Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-wider">ADMIN PANEL</span>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <nav className="mt-6 px-4 space-y-1">
                    {NAVIGATION_MENU.map((menu) => {
                        if (menu.subMenus) {
                            const hasActiveSubMenu = menu.subMenus.some((sub) => router.pathname === sub.href);

                            return (
                                <div key={menu.name}>
                                    <button
                                        onClick={() => setWfoDropdownOpen(!wfoDropdownOpen)}
                                        className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-slate-800 hover:text-white focus:outline-none ${hasActiveSubMenu ? 'text-blue-400 font-medium' : ''}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {menu.icon}
                                            <span className="font-medium">{menu.name}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transform transition-transform duration-200 ${wfoDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {wfoDropdownOpen && (
                                        <div className="mt-1 pl-11 pr-2 space-y-1">
                                            {menu.subMenus.map((sub) => {
                                                const isSubActive = router.pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        className={`block py-2 text-sm rounded-md transition-colors ${isSubActive ? 'text-blue-500 font-semibold' : 'text-gray-400 hover:text-white'}`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const isActive = router.pathname === menu.href;
                        return (
                            <Link
                                key={menu.name}
                                href={menu.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                {menu.icon}
                                <span className="font-medium">{menu.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
