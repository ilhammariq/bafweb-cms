import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthProvider } from '@/contexts/AuthProvider';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <AuthProvider>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Navbar toggleSidebar={toggleSidebar} />

                    <main className="p-6">
                        <div className="rounded-md">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}