import { createClient } from '@/app/_utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, Clock, Tag } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: post } = await supabase
        .from('posts')
        .select('title, description')
        .eq('id', id)
        .single()

    if (!post) return { title: 'Post Not Found' }
    return {
        title: `${post.title} | Jin Ahn`,
        description: post.description ?? undefined,
    }
}

export default async function PostPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select(`*, categories ( name )`)
        .eq('id', id)
        .single()

    if (error || !post) notFound()

    // Increment view count (fire and forget)
    supabase
        .from('posts')
        .update({ view_count: (post.view_count ?? 0) + 1 })
        .eq('id', id)
        .then(() => {})

    const formattedDate = new Date(post.created_at!).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const category = (post as any).categories?.name ?? 'General'

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">

                {/* Back */}
                <Link
                    href="/posts"
                    className="inline-flex items-center gap-2 text-sm mb-10 transition-colors group"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={undefined}
                >
                    <ChevronLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                        style={{ color: 'var(--accent)' }}
                    />
                    <span>블로그 목록으로</span>
                </Link>

                {/* Header */}
                <header className="mb-12">
                    {/* Category badge */}
                    <div className="mb-5">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
                            style={{
                                background: 'var(--accent-light)',
                                borderColor: 'var(--accent)',
                                color: 'var(--accent)',
                            }}
                        >
                            {category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                            {post.description}
                        </p>
                    )}

                    {/* Meta */}
                    <div
                        className="flex flex-wrap items-center gap-5 text-sm pb-8 border-b"
                        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                    >
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} style={{ color: 'var(--accent)' }} />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} style={{ color: 'var(--accent)' }} />
                            {post.read_time ?? '5 min'} read
                        </span>
                        {post.view_count != null && (
                            <span>{post.view_count.toLocaleString()} views</span>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-6">
                            {post.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border"
                                    style={{
                                        background: 'var(--bg-subtle)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <Tag size={10} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Content */}
                <div
                    className="tiptap-preview"
                    dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                />

                {/* Footer nav */}
                <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                    >
                        <ChevronLeft size={16} />
                        모든 글 보기
                    </Link>
                </div>
            </article>
        </div>
    )
}
