'use client'

import React, { useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, FolderPlus } from 'lucide-react'

interface CustomModalProps {
    isOpen: boolean
    type: 'input' | 'alert' | 'confirm'
    title: string
    message?: string
    inputValue?: string
    onClose: () => void
    onConfirm: (value?: string) => void
    placeholder?: string
}

export function CustomModal({
    isOpen, type, title, message, inputValue: initialValue = '',
    onClose, onConfirm, placeholder,
}: CustomModalProps) {
    const [inputVal, setInputVal] = React.useState(initialValue)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setInputVal(initialValue)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen, initialValue])

    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm(inputVal)
        onClose()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm()
        if (e.key === 'Escape') onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative z-10 rounded-2xl p-6 max-w-sm w-full shadow-2xl border animate-in fade-in zoom-in-95 duration-200"
                style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border"
                        style={{
                            background: 'var(--accent-light)',
                            borderColor: 'var(--accent)',
                            color: 'var(--accent)',
                        }}
                    >
                        {type === 'input'   && <FolderPlus size={22} />}
                        {type === 'alert'   && <CheckCircle size={22} />}
                        {type === 'confirm' && <AlertCircle size={22} />}
                    </div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    {message && <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{message}</p>}
                </div>

                {/* Input */}
                {type === 'input' && (
                    <div className="mb-6">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full rounded-lg py-3 px-4 text-sm text-center focus:outline-none transition-colors border"
                            style={{
                                background: 'var(--bg-subtle)',
                                borderColor: 'var(--border)',
                                color: 'var(--text)',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    {type !== 'alert' && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg font-medium text-sm border transition-colors"
                            style={{
                                background: 'var(--bg-subtle)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                            취소
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white transition-colors"
                        style={{ background: 'var(--accent)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                    >
                        {type === 'alert' ? '확인' : '추가하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}
