'use client'

import Link from 'next/link'
import { Terminal, User as UserIcon, LogOut } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/app/_utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/app/_components/ThemeToggle'

export default function Header({ user }: { user: User | null }) {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <nav
            className="fixed top-0 w-full z-50 backdrop-blur-md border-b py-4"
            style={{
                background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
                borderColor: 'var(--border)',
            }}
        >
            <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="font-bold text-xl flex items-center gap-2"
                    style={{ color: 'var(--accent)' }}
                >
                    <Terminal size={20} />
                    Jin.Dev
                </Link>

                <div className="flex items-center gap-4">
                    <div
                        className="hidden md:flex gap-8 text-sm font-medium"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {[
                            { href: '/#about', label: '소개' },
                            { href: '/projects', label: '프로젝트' },
                            { href: '/posts', label: '블로그' },
                            { href: '/#contact', label: '연락처' },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="transition-colors hover:text-[var(--accent)]"
                                style={{ color: 'inherit' }}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border"
                                style={{
                                    background: 'var(--bg-subtle)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                <UserIcon size={13} />
                                {user.user_metadata.full_name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/account/login"
                            className="text-sm font-semibold px-4 py-2 rounded-lg border transition-all"
                            style={{
                                background: 'var(--bg-subtle)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
