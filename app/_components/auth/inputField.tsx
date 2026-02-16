// app/components/auth/InputField.tsx
import React from 'react';
import { LucideIcon } from "lucide-react";

interface InputFieldProps {
    label: string;
    type: string;
    placeholder: string;
    icon: LucideIcon; // Lucide 아이콘 타입
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    rightElement?: React.ReactNode;
}

export const InputField = ({
   label,
   type,
   placeholder,
   icon: Icon,
   value,
   onChange,
   rightElement
}: InputFieldProps) => (
    <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 ${rightElement ? 'pr-12' : 'pr-4'} text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`}
                placeholder={placeholder}
            />
            {rightElement && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);