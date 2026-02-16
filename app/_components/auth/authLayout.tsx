// app/components/auth/AuthLayout.tsx
import React from 'react';
import { AlertCircle, ArrowLeft, Terminal, X } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    onBack?: () => void; // 필수값이 아닐 수도 있으므로 ? 처리
    error?: string;
    clearError?: () => void;
}

export const AuthLayout = ({
   children,
   title,
   subtitle,
   onBack,
   error,
   clearError
}: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12">
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>메인으로 돌아가기</span>
                </button>
            )}

            <div className="w-full max-w-md">
                {/* Error Alert Box */}
                {error && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start gap-3 text-red-400">
                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            <div className="flex-1 text-sm font-medium">
                                {error}
                            </div>
                            {clearError && (
                                <button onClick={clearError} className="hover:text-red-200 transition-colors">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
                        <Terminal size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-slate-400">{subtitle}</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
};