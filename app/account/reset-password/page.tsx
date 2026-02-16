'use client'

import React, { useState } from 'react';
import {AuthLayout} from "@/app/_components/auth/authLayout";
import {InputField} from "@/app/_components/auth/inputField";
import {Mail} from "lucide-react";
import {createClient} from "@/app/_utils/supabase/client";
import {User} from "@supabase/supabase-js";
import {useRouter} from "next/navigation";
import {AlertModal} from "@/app/_components/clientPage/AlertModal";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState('');

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
        return true;
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;

            setIsModalOpen(true)
            setModalTitle("이메일 발송 완료!")
            setModalMessage("비밀번호 재설정 링크가 포함된 이메일을 보냈습니다. 메일함을 확인해주세요.");
        } catch{
            setError("Internal Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AuthLayout
                title="비밀번호 재설정"
                subtitle="이메일을 입력하시면 재설정 링크를 보내드려요."
                onBack={() => router.back()}
                error={error}
                clearError={() => setError("")}
            >
                <form onSubmit={handleAuthAction}>
                    <InputField
                        label="이메일 주소" type="email" placeholder="example@email.com" icon={Mail}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "메일 보내기"}
                    </button>
                </form>

                <button
                    onClick={() => router.push('/login')}
                    className="mt-6 w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                    로그인으로 돌아가기
                </button>
            </AuthLayout>

            <AlertModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    router.push('/login');
                }}
                title={modalTitle}
                message={modalMessage}
            />
        </>
    );
}