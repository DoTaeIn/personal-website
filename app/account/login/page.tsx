'use client'


import {Chrome, Eye, EyeOff, Github as GithubIcon, Lock, Mail} from "lucide-react";
import React, {useState} from 'react';
import {createClient} from "@/app/_utils/supabase/client";
import {User} from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';
import {AuthLayout} from "@/app/_components/auth/authLayout";
import {InputField} from "@/app/_components/auth/inputField";
import {AlertModal} from "@/app/_components/clientPage/AlertModal";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const router = useRouter();

    const supabase = createClient();

    const validateForm = () => {
        if (!email.includes('@')) {
            setError("올바른 이메일 형식이 아닙니다.");
            return false;
        }
        if (password.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }
        return true;
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            router.push('/');

        } catch (error: any) {
            // Supabase auth 실패 케이스(계정 없음/비밀번호 틀림 등)는 대개 같은 메시지로 내려옵니다.
            const message = String(error?.message ?? "");
            const lower = message.toLowerCase();

            if (
                lower.includes("invalid login credentials") ||
                lower.includes("invalid password") ||
                (lower.includes("credentials") && lower.includes("invalid")) ||
                (lower.includes("user") && lower.includes("not found"))
            ) {
                setError("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
                setError("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
            } else if (lower.includes("rate limit") || lower.includes("too many attempts")) {
                setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
            } else {
                setError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AuthLayout
                title="반가워요!"
                subtitle="Jin.Dev 계정으로 로그인을 진행합니다."
                onBack={() => router.push('/')}
                error={error}
                clearError={() => setError("")}
            >
                <form onSubmit={handleAuthAction}>
                    <InputField
                        label="이메일" type="email" placeholder="example@email.com" icon={Mail}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="비밀번호"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />

                    <div className="flex justify-end mb-6">
                        <button
                            type="button"
                            onClick={() => router.push('/account/reset-password')}
                            className="text-xs transition-colors"
                            style={{ color: 'var(--accent)' }}
                        >
                            비밀번호를 잊으셨나요?
                        </button>
                    </div>

                    <button
                        className="w-full py-3 text-white font-bold rounded-xl transition-all flex justify-center items-center"
                        style={{ background: 'var(--accent)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "로그인"}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div>
                        <span className="px-4 text-xs absolute" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>또는 소셜 계정으로 로그인</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[{ icon: GithubIcon, label: 'GitHub' }, { icon: Chrome, label: 'Google' }].map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-subtle)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                            >
                                <Icon size={17} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    계정이 없으신가요?{' '}
                    <button onClick={() => router.push('/register')} className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>회원가입</button>
                </p>
            </AuthLayout>

            <AlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
            />
        </>
    );
}