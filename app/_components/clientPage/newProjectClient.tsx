'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/_utils/supabase/client'
import {
    ArrowLeft, Plus, X, Upload, Github, ExternalLink,
    Loader2, FolderOpen, Calendar, Star,
} from 'lucide-react'

type ProjectType = 'web' | 'mobile' | 'ai' | 'infra' | 'game' | 'other'

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
    { value: 'web',    label: '🌐 Web' },
    { value: 'mobile', label: '📱 Mobile' },
    { value: 'ai',     label: '🤖 AI' },
    { value: 'infra',  label: '🖥️ Infra' },
    { value: 'game',   label: '🎮 Game' },
    { value: 'other',  label: '📦 Other' },
]

export default function NewProjectClient() {
    const router = useRouter()
    const supabase = createClient()
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    const [isSaving, setIsSaving]         = useState(false)
    const [isUploading, setIsUploading]   = useState(false)
    const [error, setError]               = useState('')

    const [title, setTitle]               = useState('')
    const [description, setDescription]   = useState('')
    const [type, setType]                 = useState<ProjectType>('web')
    const [techInput, setTechInput]       = useState('')
    const [techStack, setTechStack]       = useState<string[]>([])
    const [githubUrl, setGithubUrl]       = useState('')
    const [demoUrl, setDemoUrl]           = useState('')
    const [startDate, setStartDate]       = useState('')
    const [endDate, setEndDate]           = useState('')
    const [isFeatured, setIsFeatured]     = useState(true)
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const [thumbnailPreview, setThumbnailPreview] = useState('')

    // ── Tech stack tag input ──
    const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTech()
        } else if (e.key === 'Backspace' && !techInput && techStack.length > 0) {
            setTechStack(techStack.slice(0, -1))
        }
    }
    const addTech = () => {
        const tag = techInput.trim()
        if (tag && !techStack.includes(tag)) setTechStack([...techStack, tag])
        setTechInput('')
    }
    const removeTech = (tag: string) => setTechStack(techStack.filter(t => t !== tag))

    // ── Thumbnail upload ──
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const ext = file.name.split('.').pop()
            const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { data, error } = await supabase.storage
                .from('post-images')
                .upload(`thumbnails/${filename}`, file, { cacheControl: '3600', upsert: false })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(data.path)

            setThumbnailUrl(publicUrl)
            setThumbnailPreview(publicUrl)
        } catch (err) {
            setError('썸네일 업로드에 실패했습니다.')
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }

    // ── Submit ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim()) { setError('프로젝트 이름을 입력해주세요.'); return }
        if (!description.trim()) { setError('프로젝트 설명을 입력해주세요.'); return }
        if (techStack.length === 0) { setError('기술 스택을 하나 이상 입력해주세요.'); return }

        setIsSaving(true)
        try {
            const slug = title.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()

            const { error } = await supabase.from('projects').insert({
                title:         title.trim(),
                slug,
                description:   description.trim(),
                type,
                tech_stack:    techStack,
                github_url:    githubUrl.trim() || null,
                demo_url:      demoUrl.trim() || null,
                thumbnail_url: thumbnailUrl || null,
                is_featured:   isFeatured,
                start_date:    startDate || null,
                end_date:      endDate || null,
            })

            if (error) throw error
            router.push('/projects')
        } catch (err: any) {
            setError(err.message ?? '저장에 실패했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm mb-10 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <ArrowLeft size={16} />
                    프로젝트 목록으로
                </button>

                <h1 className="text-3xl font-bold mb-2">새 프로젝트 추가</h1>
                <p className="mb-10 text-sm" style={{ color: 'var(--text-muted)' }}>
                    포트폴리오에 표시할 프로젝트를 등록합니다.
                </p>

                {/* Error banner */}
                {error && (
                    <div
                        className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
                        style={{ background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}
                    >
                        <X size={15} />
                        {error}
                        <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Thumbnail */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                            썸네일 이미지
                        </label>
                        <div
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="relative w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
                            style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                            {thumbnailPreview ? (
                                <>
                                    <img
                                        src={thumbnailPreview}
                                        alt="thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium">클릭하여 변경</p>
                                    </div>
                                </>
                            ) : isUploading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin mb-2" style={{ color: 'var(--accent)' }} />
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>업로드 중...</p>
                                </>
                            ) : (
                                <>
                                    <Upload size={24} className="mb-2" style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-sm font-medium">클릭하여 이미지 업로드</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG, WebP</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                        />
                    </div>

                    {/* Title */}
                    <Field label="프로젝트 이름 *">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="예: AI 기반 추천 시스템"
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        />
                    </Field>

                    {/* Description */}
                    <Field label="프로젝트 설명 *">
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="프로젝트에 대해 간략히 설명해주세요."
                            rows={3}
                            className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all resize-none"
                            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        />
                    </Field>

                    {/* Type */}
                    <Field label="프로젝트 유형 *">
                        <div className="flex flex-wrap gap-2">
                            {PROJECT_TYPES.map(pt => (
                                <button
                                    key={pt.value}
                                    type="button"
                                    onClick={() => setType(pt.value)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                                    style={{
                                        background: type === pt.value ? 'var(--accent-light)' : 'var(--bg-subtle)',
                                        borderColor: type === pt.value ? 'var(--accent)' : 'var(--border)',
                                        color: type === pt.value ? 'var(--accent)' : 'var(--text-muted)',
                                    }}
                                >
                                    {pt.label}
                                </button>
                            ))}
                        </div>
                    </Field>

                    {/* Tech Stack */}
                    <Field label="기술 스택 * (Enter 또는 콤마로 추가)">
                        <div
                            className="flex flex-wrap gap-2 p-3 rounded-xl border min-h-[52px] transition-all"
                            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                            onClick={() => document.getElementById('tech-input')?.focus()}
                        >
                            {techStack.map(tag => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                    style={{
                                        background: 'var(--accent-light)',
                                        borderColor: 'var(--accent)',
                                        color: 'var(--accent)',
                                    }}
                                >
                                    {tag}
                                    <button type="button" onClick={() => removeTech(tag)}>
                                        <X size={11} />
                                    </button>
                                </span>
                            ))}
                            <input
                                id="tech-input"
                                type="text"
                                value={techInput}
                                onChange={e => setTechInput(e.target.value)}
                                onKeyDown={handleTechKeyDown}
                                onBlur={addTech}
                                placeholder={techStack.length === 0 ? 'Next.js, TypeScript, Docker...' : ''}
                                className="bg-transparent text-sm outline-none flex-1 min-w-[140px]"
                                style={{ color: 'var(--text)' }}
                            />
                        </div>
                    </Field>

                    {/* URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="GitHub URL">
                            <div className="relative">
                                <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="url"
                                    value={githubUrl}
                                    onChange={e => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none transition-all"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                />
                            </div>
                        </Field>
                        <Field label="데모 URL">
                            <div className="relative">
                                <ExternalLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="url"
                                    value={demoUrl}
                                    onChange={e => setDemoUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none transition-all"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="시작일">
                            <div className="relative">
                                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none transition-all"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                />
                            </div>
                        </Field>
                        <Field label="종료일">
                            <div className="relative">
                                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none transition-all"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Featured toggle */}
                    <div
                        className="flex items-center justify-between p-4 rounded-xl border"
                        style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                    >
                        <div className="flex items-center gap-3">
                            <Star size={18} style={{ color: 'var(--accent)' }} />
                            <div>
                                <p className="text-sm font-medium">Featured 프로젝트</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>홈 화면에 대표 프로젝트로 표시됩니다.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsFeatured(!isFeatured)}
                            className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                            style={{ background: isFeatured ? 'var(--accent)' : 'var(--border)' }}
                        >
                            <span
                                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                style={{ transform: isFeatured ? 'translateX(20px)' : 'translateX(0)' }}
                            />
                        </button>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3 rounded-xl text-sm font-medium border transition-all"
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
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            style={{ background: 'var(--accent)' }}
                            onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = 'var(--accent-hover)' }}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                        >
                            {isSaving ? (
                                <><Loader2 size={16} className="animate-spin" /> 저장 중...</>
                            ) : (
                                <><Plus size={16} /> 프로젝트 추가</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                {label}
            </label>
            {children}
        </div>
    )
}
