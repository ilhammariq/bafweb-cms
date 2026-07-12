import { createContext, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuth';

const AuthContext = createContext(null);

function AuthLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />

                <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">
                        Memuat aplikasi...
                    </p>
                    <p className="text-sm text-gray-500">
                        Mohon tunggu sebentar
                    </p>
                </div>
            </div>
        </div>
    );
}

export function AuthProvider({ children }) {
    const auth = useAuthUser();

    if (auth.isLoading) {
        return <AuthLoading />;
    }

    if (auth.isError) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="rounded-xl border bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-red-600">
                        Gagal memuat data pengguna
                    </h2>

                    <button
                        onClick={() => auth.refetch()}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}