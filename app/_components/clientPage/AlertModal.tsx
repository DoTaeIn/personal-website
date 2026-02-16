'use client';

import React from 'react';
import { CheckCircle, X } from "lucide-react";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export function AlertModal({ isOpen, onClose, title, message }: AlertModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* 배경 (Backdrop) - 흐림 효과 추가 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 모달 컨텐츠 */}
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    {/* 성공 아이콘 */}
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-5 text-cyan-400 ring-1 ring-cyan-500/20">
                        <CheckCircle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-8 px-2">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}