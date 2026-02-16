'use client'
import React, { useState } from 'react';
import {AuthLayout} from "@/app/_components/auth/authLayout";
import {InputField} from "@/app/_components/auth/inputField";
import {UserIcon, Mail, Lock, Eye, EyeOff} from "lucide-react";
import {User} from "@supabase/supabase-js";
import {useRouter} from "next/navigation";
import {createClient} from "@/app/_utils/supabase/client";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const router = useRouter();
    const supabase = createClient();

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }, // 이름 저장
                }
            });
            if (error) throw error;

            alert("가입 확인 이메일을 보냈습니다! 이메일을 확인해주세요.");
            router.push('/login');
        } catch{
            setError("Internal Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        if (!email.includes('@')) {
            setError("올바른 이메일 형식이 아닙니다.");
            return false;
        }
        if (password.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }
        if (!name.trim()) {
            setError("이름을 입력해주세요.");
            return false;
        }
        return true;
    };

    return(
        <AuthLayout
            title="계정 만들기"
            subtitle="새로운 여정을 함께 시작해봐요."
            onBack={() => router.back()}
            error={error}
            clearError={() => setError("")}
        >
            <form onSubmit={handleAuthAction} className="space-y-4">
                <InputField
                    label="이름" type="text" placeholder="홍길동" icon={UserIcon}
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                <InputField
                    label="이메일" type="email" placeholder="example@email.com" icon={Mail}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    label="비밀번호"
                    type={showPassword ? "text" : "password"}
                    placeholder="8자 이상의 비밀번호"
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

                <div className="flex items-start gap-3 py-2">
                    <input type="checkbox" className="mt-1 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/50" required />
                    <span className="text-xs text-slate-400 leading-relaxed">
                            <button type="button" className="text-cyan-500 underline">서비스 이용약관</button> 및 <button type="button" className="text-cyan-500 underline">개인정보 처리방침</button>에 동의합니다.
                        </span>
                </div>

                <button
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "회원가입 완료"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
                이미 계정이 있나요? {" "}
                <button onClick={() => router.push('/login')} className="text-cyan-500 hover:underline font-medium">로그인</button>
            </p>
        </AuthLayout>
    )
}