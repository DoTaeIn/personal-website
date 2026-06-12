'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/app/_utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    Search, ArrowRight, PenTool, Github, Linkedin, Mail,
    ChevronLeft, ChevronRight, Calendar, Filter, X,
} from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { FadeIn } from '@/app/_components/FadeIn'

interface Post {
    id: string
    title: string
    content?: string
    category?: string
    created_at: string
    read_time?: string
}

interface PostsProps {
    posts: Post[]
    user: User | null
}

export default function Posts({ posts = [], user: initialUser }: PostsProps) {
    const router = useRouter()
    const supabase = createClient()

    const [user, setUser] = useState<User | null>(initialUser)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 6

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.refresh()
    }

    const categories = useMemo(() => {
        const cats = Array.from(new Set(posts.map(p => p.category)))
        return ['All', ...cats.filter(Boolean)]
    }, [posts])

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const category = post.category || 'General'
            const desc = post.content || ''
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                desc.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [posts, searchQuery, selectedCategory])

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const currentPosts = useMemo(() => {
        const last = currentPage * postsPerPage
        return filteredPosts.slice(last - postsPerPage, last)
    }, [filteredPosts, currentPage])

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).slice(0, -1)

    useEffect(() => { setCurrentPage(1) }, [searchQuery, selectedCategory])

    const paginate = (n: number) => {
        setCurrentPage(n)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ── Blog Header ── */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm mb-8 group w-fit transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        메인으로 돌아가기
                    </Link>

                    <FadeIn>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="space-y-3">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                    Writing &{' '}
                                    <span style={{ color: 'var(--accent)' }}>Thoughts</span>
                                </h1>
                                <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                                    기술적인 탐구와 개발 경험을 기록합니다.{' '}
                                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                        {posts.length}
                                    </span>
                                    개의 포스트.
                                </p>
                            </div>
                            {user && (
                                <Link
                                    href="/posts/new"
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                                    style={{ background: 'var(--accent)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                                >
                                    <PenTool size={16} />
                                    글쓰기
                                </Link>
                            )}
                        </div>
                    </FadeIn>

                    {/* Search & Filter */}
                    <FadeIn delay={100}>
                        <div
                            className="rounded-2xl border overflow-hidden"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                        >
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="포스트 검색..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent py-4 pl-11 pr-4 outline-none text-sm"
                                    style={{ color: 'var(--text)' }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div
                                className="flex items-center gap-2 px-4 pb-4 overflow-x-auto border-t"
                                style={{ borderColor: 'var(--border)' }}
                            >
                                <div
                                    className="flex items-center gap-1.5 mr-2 shrink-0 text-xs font-semibold uppercase tracking-wider pt-4"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <Filter size={13} />
                                    Category
                                </div>
                                {categories.map(cat => {
                                    const active = selectedCategory === cat
                                    return (
                                        <button
                                            key={cat}
                                            //@ts-expect-error string is fine
                                            onClick={() => setSelectedCategory(cat)}
                                            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all mt-4"
                                            style={{
                                                background: active ? 'var(--accent-light)' : 'var(--bg-subtle)',
                                                borderColor: active ? 'var(--accent)' : 'var(--border)',
                                                color: active ? 'var(--accent)' : 'var(--text-muted)',
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Post List ── */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {currentPosts.length > 0 ? (
                        <>
                            <div className="grid gap-4 mb-12">
                                {currentPosts.map((post, idx) => (
                                    <FadeIn key={post.id} delay={idx * 50}>
                                        <Link href={`/posts/${post.id}`}>
                                            <article
                                                className="group p-7 rounded-2xl border transition-all duration-300"
                                                style={{
                                                    background: 'var(--bg-card)',
                                                    borderColor: 'var(--border)',
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                                                }}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span
                                                        className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border"
                                                        style={{
                                                            background: 'var(--accent-light)',
                                                            borderColor: 'var(--accent)',
                                                            color: 'var(--accent)',
                                                        }}
                                                    >
                                                        {post.category || 'General'}
                                                    </span>
                                                    <div
                                                        className="flex items-center gap-1.5 text-xs"
                                                        style={{ color: 'var(--text-muted)' }}
                                                    >
                                                        <Calendar size={12} />
                                                        {formatDate(post.created_at)}
                                                    </div>
                                                    <span style={{ color: 'var(--border)' }}>·</span>
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        {post.read_time || '5 min'} read
                                                    </span>
                                                </div>

                                                <h3
                                                    className="text-xl font-bold mb-2 leading-tight transition-colors group-hover:text-[var(--accent)]"
                                                >
                                                    {post.title}
                                                </h3>

                                                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                                                    {post.content?.replace(/[#*`]/g, '') || '내용이 없습니다.'}
                                                </p>

                                                <div
                                                    className="flex items-center gap-1.5 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                                                    style={{ color: 'var(--accent)' }}
                                                >
                                                    Read More <ArrowRight size={14} />
                                                </div>
                                            </article>
                                        </Link>
                                    </FadeIn>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3">
                                    <button
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border transition-all disabled:opacity-30"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Page{' '}
                                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                            {currentPage}
                                        </span>{' '}
                                        / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border transition-all disabled:opacity-30"
                                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <FadeIn>
                            <div
                                className="py-32 text-center border border-dashed rounded-3xl"
                                style={{ borderColor: 'var(--border)' }}
                            >
                                <div
                                    className="inline-flex p-4 rounded-full mb-4"
                                    style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                                >
                                    <Search size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">검색 결과가 없습니다</h3>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    다른 키워드나 카테고리로 검색해보세요.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
                                    className="mt-6 text-sm font-medium underline underline-offset-4"
                                    style={{ color: 'var(--accent)' }}
                                >
                                    필터 초기화하기
                                </button>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-20 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-1">Let&apos;s Connect</h2>
                        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>새로운 기회는 언제나 환영합니다.</p>
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
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2026 Jin Developer. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
