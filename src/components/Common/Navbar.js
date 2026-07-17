import { useState, useRef, useEffect } from "react";
import { useMemberById } from "@/hooks/useMember";
import { Avatar } from "./Avatar";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useLogout } from "@/hooks/useAuth";
import { User, LogOut, ChevronDown, Bell } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const { data: user } = useAuth();
    const { data: member } = useMemberById(user?.member_id);
    const logoutMutation = useLogout();

    const handleLogout = () => {
        setOpenDropdown(false);
        logoutMutation.mutate();
    };

    // Close when clicking outside the dropdown
    useEffect(() => {
        if (!openDropdown) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false);
            }
        };
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpenDropdown(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openDropdown]);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-500 focus:outline-none lg:hidden mr-4"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                    Welcome Back, {member?.name}
                </h1>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    className="p-2 text-gray-400 hover:text-gray-600 relative"
                    aria-label="Notifications"
                >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative border-l pl-4 border-gray-200" ref={dropdownRef}>
                    <button
                        onClick={() => setOpenDropdown((prev) => !prev)}
                        className="flex items-center space-x-2 focus:outline-none rounded-full"
                        aria-haspopup="menu"
                        aria-expanded={openDropdown}
                    >
                        {member && (
                            <>
                                <Avatar
                                    name={member?.name}
                                    avatar={member?.avatar}
                                    avatarIndex={member?.avatarIndex}
                                />
                                <div className="hidden sm:block text-left">
                                    <p className="font-medium text-slate-900">
                                        {member?.name}
                                    </p>
                                </div>
                            </>
                        )}

                        <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    <div
                        role="menu"
                        className={`absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right transition-all duration-150 ${openDropdown
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                            }`}
                    >
                        <Link
                            href="/profile"
                            role="menuitem"
                            onClick={() => setOpenDropdown(false)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>

                        <div className="border-t my-1"></div>

                        <button
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                            {logoutMutation.isPending ? "Logout..." : "Logout"}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}