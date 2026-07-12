import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';

const ROSTER_PREVIEW = [
    { initials: 'AR', name: 'Aditya Rahman', role: 'Team Lead' },
    { initials: 'SN', name: 'Sri Nurhaliza', role: 'Member' },
    { initials: 'DP', name: 'Dimas Pratama', role: 'Member' },
    { initials: 'FW', name: 'Farah Wijaya', role: 'Manager' },
];

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const login = useLogin();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
        onSubmit: async ({ value }) => {
            login.mutate({
                email: value.email,
                password: value.password,
            });
        },
    });

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* LEFT — brand panel */}
            <aside className="hidden lg:flex lg:w-[46%] bg-slate-900 text-white flex-col justify-between px-12 py-10">
                <div>
                    <span className="text-xl font-bold tracking-wider">ADMIN PANEL</span>
                    <div className="mt-16">
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
                            Team console
                        </p>
                        <h1 className="text-3xl font-semibold leading-snug">
                            Manage your team,
                            <br />
                            all in one place.
                        </h1>
                        <p className="mt-4 text-sm text-gray-400 max-w-sm leading-relaxed">
                            Members, teams, cuti and events — organized in a single
                            dashboard built for admins who need clarity, fast.
                        </p>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                        Recently active
                    </p>
                    <ul className="space-y-1">
                        {ROSTER_PREVIEW.map((m) => (
                            <li
                                key={m.initials}
                                className="flex items-center gap-3 py-2 border-t border-slate-800 first:border-t-0"
                            >
                                <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                    {m.initials}
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm text-white truncate">{m.name}</span>
                                    <span className="block text-xs text-gray-500">{m.role}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 text-xs text-gray-600">
                        © {new Date().getFullYear()} Admin Panel. All rights reserved.
                    </p>
                </div>
            </aside>

            {/* RIGHT — form panel */}
            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <span className="lg:hidden block text-xl font-bold tracking-wider text-slate-900 mb-10">
                        ADMIN PANEL
                    </span>

                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                        Welcome back
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your groups, teams, and members from one dashboard.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        <form.Field
                            name="email"
                            validators={{
                                onChange: ({ value }) =>
                                    !value
                                        ? 'Email is required.'
                                        : !/^\S+@\S+\.\S+$/.test(value)
                                            ? 'Enter a valid email address.'
                                            : undefined,
                            }}
                        >
                            {(field) => (
                                <label className="block">
                                    <span className="block text-sm font-medium text-gray-700 mb-1.5">Email</span>
                                    <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
                                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@company.com"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
                                        />
                                    </div>
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="mt-1.5 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                                    )}
                                </label>
                            )}
                        </form.Field>

                        <form.Field
                            name="password"
                            validators={{
                                onChange: ({ value }) =>
                                    !value ? 'Password is required.' : undefined,
                            }}
                        >
                            {(field) => (
                                <label className="block">
                                    <span className="block text-sm font-medium text-gray-700 mb-1.5">Password</span>
                                    <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
                                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="mt-1.5 text-xs text-red-600">{field.state.meta.errors[0]}</p>
                                    )}
                                </label>
                            )}
                        </form.Field>

                        <div className="flex items-center justify-between">
                            <form.Field name="remember">
                                {(field) => (
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        Remember me
                                    </label>
                                )}
                            </form.Field>
                            <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </a>
                        </div>

                        {login.isError && (
                            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                                {login.error.message}
                            </p>
                        )}

                        <form.Subscribe selector={(state) => [state.canSubmit]}>
                            {([canSubmit]) => (
                                <button
                                    type="submit"
                                    disabled={!canSubmit || login.isPending}
                                    className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {login.isPending ? (
                                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            )}
                        </form.Subscribe>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don&apos;t have access?{' '}
                        <a href="" className="font-medium text-blue-600 hover:text-blue-700">
                            Contact your admin
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}