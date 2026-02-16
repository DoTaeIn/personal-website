'use client';

import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, FolderPlus } from "lucide-react";

interface CustomModalProps {
    isOpen: boolean;
    type: 'input' | 'alert' | 'confirm'; // 입력창, 단순알림, 확인창
    title: string;
    message?: string;
    inputValue?: string;
    onClose: () => void;
    onConfirm: (value?: string) => void;
    placeholder?: string;
}

export function CustomModal({
                                isOpen, type, title, message, inputValue: initialValue = '',
                                onClose, onConfirm, placeholder
                            }: CustomModalProps) {
    const [inputVal, setInputVal] = React.useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // 모달이 열릴 때 초기화 및 포커스
    useEffect(() => {
        if (isOpen) {
            setInputVal(initialValue);
            // 약간의 딜레이 후 포커스 (애니메이션 고려)
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(inputVal);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* 배경 (Backdrop) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* 모달 박스 */}
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* 닫기 버튼 */}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
                    <X size={20} />
                </button>

                {/* 헤더 (아이콘 + 제목) */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-cyan-400 ring-1 ring-slate-700">
                        {type === 'input' && <FolderPlus size={24} />}
                        {type === 'alert' && <CheckCircle size={24} />}
                        {type === 'confirm' && <AlertCircle size={24} />}
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    {message && <p className="text-slate-400 text-sm mt-2">{message}</p>}
                </div>

                {/* 본문 (입력창) */}
                {type === 'input' && (
                    <div className="mb-6">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600 text-center"
                        />
                    </div>
                )}

                {/* 푸터 (버튼) */}
                <div className="flex gap-3">
                    {type !== 'alert' && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
                        >
                            취소
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 transition-colors"
                    >
                        {type === 'alert' ? '확인' : '추가하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}