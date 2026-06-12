'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Cpu, Gamepad2, Server, Terminal, ExternalLink, Github, Mail, Linkedin, Smartphone, Globe } from 'lucide-react'
import { Database } from '@/types/supabase'
import { FadeIn } from '@/app/_components/FadeIn'

type Project = Database['public']['Tables']['projects']['Row']

const categoryConfig: Record<string, any> = {
    web:    { icon: Globe,      label: 'Web' },
    mobile: { icon: Smartphone, label: 'Mobile' },
    ai:     { icon: Cpu,        label: 'AI' },
    infra:  { icon: Server,     label: 'Infra' },
    game:   { icon: Gamepad2,   label: 'Game' },
    other:  { icon: Terminal,   label: 'Other' },
}

const categories = ['all', 'web', 'mobile', 'ai', 'infra', 'game']

export default function Projects({ projects }: { projects: Project[] }) {
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projects
        return projects.filter(p => p.type === activeCategory)
    }, [activeCategory, projects])

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ── Header ── */}
            <header className="pt-40 pb-16 px-6 max-w-5xl mx-auto">
                <FadeIn className="space-y-5">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                        style={{
                            background: 'var(--accent-light)',
                            borderColor: 'var(--accent)',
                            color: 'var(--accent)',
                        }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ background: 'var(--accent)' }}
                            />
                            <span
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{ background: 'var(--accent)' }}
                            />
                        </span>
                        Project Gallery
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Featured{' '}
                        <span style={{ color: 'var(--accent)' }}>Projects</span>
                    </h1>

                    <p className="text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        단순한 구현을 넘어 시스템 최적화와 사용자 경험을 고민하며 설계한
                        <br />
                        저의 대표 프로젝트들을 소개합니다.
                    </p>
                </FadeIn>
            </header>

            {/* ── Projects ── */}
            <main className="max-w-5xl mx-auto px-6 pb-32">
                {/* Category Filter */}
                <FadeIn>
                    <div className="flex flex-wrap gap-2 mb-12">
                        {categories.map((cat) => {
                            const active = activeCategory === cat
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                                    style={{
                                        background: active ? 'var(--accent-light)' : 'var(--bg-card)',
                                        borderColor: active ? 'var(--accent)' : 'var(--border)',
                                        color: active ? 'var(--accent)' : 'var(--text-muted)',
                                    }}
                                >
                                    {cat === 'all' ? 'All Projects' : cat.toUpperCase()}
                                </button>
                            )
                        })}
                    </div>
                </FadeIn>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProjects.map((project, idx) => {
                        const config = categoryConfig[project.type || 'other']
                        const Icon = config.icon

                        return (
                            <FadeIn key={project.id} delay={idx * 60}>
                                <Link href={`/projects/${project.slug}`} className="group block h-full">
                                    <div
                                        className="relative h-full p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col"
                                        style={{
                                            background: 'var(--bg-card)',
                                            borderColor: 'var(--border)',
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-7">
                                            <div
                                                className="p-3 rounded-xl border"
                                                style={{
                                                    background: 'var(--accent-light)',
                                                    borderColor: 'var(--border)',
                                                    color: 'var(--accent)',
                                                }}
                                            >
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex gap-3" style={{ color: 'var(--text-muted)' }}>
                                                {project.github_url && (
                                                    <Github size={18} className="hover:text-[var(--text)] transition-colors" />
                                                )}
                                                {project.demo_url && (
                                                    <ExternalLink size={18} className="hover:text-[var(--accent)] transition-colors" />
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-[var(--accent)]">
                                            {project.title}
                                        </h3>

                                        <p className="text-sm leading-relaxed mb-7 flex-grow line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                                            {project.description}
                                        </p>

                                        <div
                                            className="flex flex-wrap gap-1.5 pt-5 border-t"
                                            style={{ borderColor: 'var(--border)' }}
                                        >
                                            {project.tech_stack?.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                                                    style={{
                                                        background: 'var(--bg-subtle)',
                                                        borderColor: 'var(--border)',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        )
                    })}
                </div>

                {/* Footer */}
                <footer className="mt-32 pt-16 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <FadeIn>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold mb-1">Let&apos;s Connect</h2>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>새로운 기회와 협업은 언제나 환영합니다.</p>
                            </div>
                        </FadeIn>
                        <div className="flex gap-3">
                            {[Github, Linkedin, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-2.5 rounded-full border transition-all"
                                    style={{
                                        background: 'var(--bg-subtle)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text-muted)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--accent)'
                                        e.currentTarget.style.color = 'var(--accent)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border)'
                                        e.currentTarget.style.color = 'var(--text-muted)'
                                    }}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="mt-10 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                        © 2026 Jin Developer. Built with Next.js & Tailwind CSS.
                    </p>
                </footer>
            </main>
        </div>
    )
}
