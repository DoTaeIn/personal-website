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

        } catch {
            setError("Internal Server Error");

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
                            className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                            비밀번호를 잊으셨나요?
                        </button>
                    </div>

                    <button
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "로그인"}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-slate-800 w-full"></div>
                        <span className="bg-slate-900 px-4 text-xs text-slate-500 absolute">또는 소셜 계정으로 로그인</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                            <GithubIcon size={18} /> GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                            <Chrome size={18} /> Google
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    계정이 없으신가요? {" "}
                    <button onClick={() => router.push("/register")} className="text-cyan-500 hover:underline font-medium">회원가입</button>
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