import React from 'react'
import { LucideIcon } from 'lucide-react'

interface InputFieldProps {
    label: string
    type: string
    placeholder: string
    icon: LucideIcon
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    rightElement?: React.ReactNode
}

export const InputField = ({
    label,
    type,
    placeholder,
    icon: Icon,
    value,
    onChange,
    rightElement,
}: InputFieldProps) => (
    <div className="space-y-2 mb-4">
        <label className="text-sm font-medium ml-1" style={{ color: 'var(--text-muted)' }}>
            {label}
        </label>
        <div className="relative group">
            <div
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
            >
                <Icon size={17} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-xl py-3 pl-11 ${rightElement ? 'pr-12' : 'pr-4'} text-sm outline-none transition-all`}
                style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            {rightElement && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
)
