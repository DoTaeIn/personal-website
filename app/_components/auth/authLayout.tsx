import React from 'react'
import { AlertCircle, ArrowLeft, Terminal, X } from 'lucide-react'

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
    onBack?: () => void
    error?: string
    clearError?: () => void
}

export const AuthLayout = ({
    children,
    title,
    subtitle,
    onBack,
    error,
    clearError,
}: AuthLayoutProps) => {
    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center px-6 py-12"
            style={{ background: 'var(--bg)' }}
        >
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 flex items-center gap-2 text-sm transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <ArrowLeft size={18} />
                    메인으로 돌아가기
                </button>
            )}

            <div className="w-full max-w-md">
                {error && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 flex items-start gap-3 text-red-500">
                            <AlertCircle className="shrink-0 mt-0.5" size={16} />
                            <div className="flex-1 text-sm font-medium">{error}</div>
                            {clearError && (
                                <button onClick={clearError} className="hover:text-red-300 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-center mb-10">
                    <div
                        className="inline-flex p-3 rounded-2xl border mb-5"
                        style={{
                            background: 'var(--accent-light)',
                            borderColor: 'var(--accent)',
                            color: 'var(--accent)',
                        }}
                    >
                        <Terminal size={28} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                        {title}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
                </div>

                <div
                    className="border p-8 rounded-3xl shadow-xl"
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
