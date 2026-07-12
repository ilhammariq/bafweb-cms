import { useState } from "react";
import { useAuthUser, useLogout } from "@/hooks/useAuth";
import { useMemberById } from "@/hooks/useMember";
import { Avatar } from "./Avatar";

export default function Navbar({ toggleSidebar }) {
    const [openDropdown, setOpenDropdown] = useState(false);

    const { data: user } = useAuthUser();
    const { data: member } = useMemberById(user?.member_id);
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

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

                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
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
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>

                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>


                {/* Profile Dropdown */}
                <div className="relative border-l pl-4 border-gray-200">
                    <button
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        {member && <>
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
                        </>}

                        <svg
                            className={`w-4 h-4 transition-transform ${openDropdown ? "rotate-180" : ""
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>


                    {openDropdown && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">

                            <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    // redirect profile jika ada
                                }}
                            >
                                Profile
                            </button>

                            <div className="border-t my-1"></div>

                            <button
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                {logoutMutation.isPending
                                    ? "Logout..."
                                    : "Logout"
                                }
                            </button>

                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}