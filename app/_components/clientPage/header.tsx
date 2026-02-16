'use client'

import Link from "next/link"; // Link 컴포넌트 사용
import { Terminal, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { createClient } from "@/app/_utils/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Header({ user }: { user: User | null }) {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4">
            <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl text-cyan-400 flex items-center gap-2">
                    <Terminal size={20} />
                    Jin.Dev
                </Link>

                <div className="flex items-center gap-6">
                    {/* 메뉴 링크들 */}
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                        <Link href="/#about" className="hover:text-cyan-400">소개</Link>
                        <Link href="/#projects" className="hover:text-cyan-400">프로젝트</Link>
                        <Link href="/#blog" className="hover:text-cyan-400">블로그</Link>
                        <Link href="/#contact" className="hover:text-cyan-400">연락처</Link>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                                <UserIcon size={14} />
                                <span className="text-xs">{user?.user_metadata.full_name}</span>
                            </div>
                            <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        // 로그인 페이지로 이동하는 링크
                        <Link
                            href="/account/login" // 로그인 페이지가 있다면
                            className="text-sm font-semibold px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all"
                        >
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}