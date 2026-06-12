'use client'

import React from 'react'
import {
    Code, Cpu, Gamepad2, Server, Terminal, BookOpen,
    Github, Linkedin, Mail, ArrowRight, ExternalLink,
    ChevronDown, PenTool,
} from 'lucide-react'
import { techConfig } from '@/app/_constants/techConfig'
import { Database } from '@/types/supabase'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FadeIn } from '@/app/_components/FadeIn'

type Project = Database['public']['Tables']['projects']['Row']
type Post = Database['public']['Tables']['posts']['Row']

export default function Main({ projects, posts }: { projects: Project[]; posts: Post[] }) {
    const router = useRouter()

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ── Hero ── */}
            <section className="relative pt-44 pb-24 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
                <FadeIn className="space-y-8">
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
                        Open to Work
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                        안녕하세요,{' '}
                        <br />
                        <span style={{ color: 'var(--accent)' }}>탐구하는 개발자</span>{' '}
                        Jin입니다.
                    </h1>

                    <p className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        AI 연구와 시스템 인프라 구축, 그리고 게임 개발을 좋아합니다.
                        <br />
                        복잡한 문제를 기술로 해결하고, 그 과정을 기록하는 것을 즐깁니다.
                    </p>

                    <div className="flex gap-4 pt-2">
                        <a
                            href="#projects"
                            className="px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 text-white"
                            style={{ background: 'var(--accent)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                        >
                            프로젝트 보기 <ArrowRight size={18} />
                        </a>
                        <button
                            className="px-6 py-3 rounded-xl border transition-all font-medium"
                            style={{
                                borderColor: 'var(--border)',
                                color: 'var(--text-muted)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--border-hover)'
                                e.currentTarget.style.color = 'var(--text)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--border)'
                                e.currentTarget.style.color = 'var(--text-muted)'
                            }}
                        >
                            이력서 다운로드
                        </button>
                    </div>
                </FadeIn>

                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ChevronDown size={22} />
                </div>
            </section>

            {/* ── Skills ── */}
            <section
                id="about"
                className="py-24 px-6 border-y"
                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-12 flex items-center gap-2">
                            <Cpu size={22} style={{ color: 'var(--accent)' }} />
                            Technical Expertise
                        </h2>
                    </FadeIn>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {[
                            { icon: <Code size={22} />, title: 'Languages', desc: 'Python, Java, TypeScript' },
                            { icon: <Terminal size={22} />, title: 'Backend', desc: 'FastAPI, Spring Boot, Next.js' },
                            { icon: <Server size={22} />, title: 'Infra', desc: 'Docker, K8s, Linux' },
                            { icon: <Gamepad2 size={22} />, title: 'Game Dev', desc: 'Unity, C#, Shader Graph' },
                        ].map((skill, idx) => (
                            <FadeIn key={idx} delay={idx * 80}>
                                <div
                                    className="p-6 rounded-2xl border transition-all cursor-default"
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
                                    <div className="mb-4" style={{ color: 'var(--accent)' }}>
                                        {skill.icon}
                                    </div>
                                    <h3 className="text-base font-semibold mb-1.5">{skill.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {skill.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Projects ── */}
            <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Featured Projects</h2>
                            <p style={{ color: 'var(--text-muted)' }}>직접 기획하고 개발한 주요 프로젝트들입니다.</p>
                        </div>
                        <Link
                            href="/projects"
                            className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors"
                            style={{ color: 'var(--accent)' }}
                        >
                            전체 보기 <ArrowRight size={16} />
                        </Link>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-5">
                    {projects.map((project, idx) => {
                        const mainTag = project.tech_stack?.[0] || 'Default'
                        const theme = techConfig[mainTag] || techConfig['Default']
                        const IconComponent = theme.icon

                        return (
                            <FadeIn key={idx} delay={idx * 80}>
                                <Link href={`/projects/${project.slug}`} className="group block h-full">
                                <div
                                    className="relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
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
                                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink size={18} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    <div
                                        className="mb-4 p-3 rounded-xl w-fit border"
                                        style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                                    >
                                        <IconComponent />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                                    <p className="text-sm leading-relaxed line-clamp-3 flex-grow mb-5" style={{ color: 'var(--text-muted)' }}>
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {(project.tech_stack || []).map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="text-xs px-2 py-0.5 rounded border"
                                                style={{
                                                    background: 'var(--bg-subtle)',
                                                    borderColor: 'var(--border)',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                </Link>
                            </FadeIn>
                        )
                    })}
                </div>
            </section>

            {/* ── Recent Posts ── */}
            <section
                id="blog"
                className="py-24 px-6 border-y"
                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
                <div className="max-w-3xl mx-auto">
                    <FadeIn>
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <BookOpen size={26} style={{ color: 'var(--accent)' }} />
                                Recent Writing
                            </h2>
                            <button
                                onClick={() => router.push('/posts/new')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium"
                                style={{
                                    background: 'var(--bg-card)',
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
                                <PenTool size={15} />
                                <span className="hidden sm:inline">새 글 작성</span>
                            </button>
                        </div>
                    </FadeIn>

                    <div className="space-y-2">
                        {posts.map((post, idx) => (
                            <FadeIn key={idx} delay={idx * 60}>
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="group block p-6 -mx-2 rounded-2xl transition-colors"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-card)'
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-2 text-xs font-medium">
                                        <span style={{ color: 'var(--accent)' }}>{post.slug}</span>
                                        <span style={{ color: 'var(--border)' }}>•</span>
                                        <span style={{ color: 'var(--text-muted)' }}>
                                            {new Date(post.created_at).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-xl font-bold mb-2 transition-colors group-hover:text-[var(--accent)]"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {post.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {post.description}
                                    </p>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn>
                        <div className="mt-10 text-center">
                            <Link
                                href="/posts"
                                className="text-sm font-medium transition-colors pb-1 border-b"
                                style={{ color: 'var(--text-muted)', borderColor: 'transparent' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--text)'
                                    e.currentTarget.style.borderColor = 'var(--text-muted)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-muted)'
                                    e.currentTarget.style.borderColor = 'transparent'
                                }}
                            >
                                블로그 전체 글 보러가기
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer
                id="contact"
                className="py-20 px-6 border-t"
                style={{ borderColor: 'var(--border)' }}
            >
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <FadeIn>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2">Let&apos;s Connect</h2>
                            <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                                새로운 기회를 기다리겠습니다.
                            </p>
                            <div className="flex gap-3 justify-center md:justify-start">
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
                    </FadeIn>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2026 Ahn Jin. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
