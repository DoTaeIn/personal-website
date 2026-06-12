import { createClient } from '@/app/_utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    ChevronLeft, Github, ExternalLink, Calendar,
    Cpu, Globe, Smartphone, Server, Gamepad2, Terminal,
} from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
    params: Promise<{ slug: string }>
}

const typeConfig: Record<string, { icon: any; label: string }> = {
    web:    { icon: Globe,      label: 'Web' },
    mobile: { icon: Smartphone, label: 'Mobile' },
    ai:     { icon: Cpu,        label: 'AI' },
    infra:  { icon: Server,     label: 'Infra' },
    game:   { icon: Gamepad2,   label: 'Game' },
    other:  { icon: Terminal,   label: 'Other' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const { data: project } = await supabase
        .from('projects')
        .select('title, description')
        .eq('slug', slug)
        .single()

    if (!project) return { title: 'Project Not Found' }
    return {
        title: `${project.title} | Jin Ahn`,
        description: project.description ?? undefined,
    }
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !project) notFound()

    const config = typeConfig[project.type] ?? typeConfig['other']
    const Icon = config.icon

    const formatDate = (d: string | null) =>
        d ? new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : null

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

                {/* Back */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm mb-10 transition-colors group"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ChevronLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                        style={{ color: 'var(--accent)' }}
                    />
                    프로젝트 목록으로
                </Link>

                {/* Thumbnail */}
                {project.thumbnail_url && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border mb-10" style={{ borderColor: 'var(--border)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="p-2.5 rounded-xl border"
                            style={{
                                background: 'var(--accent-light)',
                                borderColor: 'var(--border)',
                                color: 'var(--accent)',
                            }}
                        >
                            <Icon size={20} />
                        </div>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
                            style={{
                                background: 'var(--accent-light)',
                                borderColor: 'var(--accent)',
                                color: 'var(--accent)',
                            }}
                        >
                            {config.label}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                        {project.title}
                    </h1>

                    {project.description && (
                        <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                            {project.description}
                        </p>
                    )}

                    {/* Meta row */}
                    <div
                        className="flex flex-wrap items-center gap-5 text-sm pb-8 border-b"
                        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                    >
                        {(project.start_date || project.end_date) && (
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} style={{ color: 'var(--accent)' }} />
                                {formatDate(project.start_date)}
                                {project.end_date && ` – ${formatDate(project.end_date)}`}
                            </span>
                        )}
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 transition-colors hover:text-[var(--text)]"
                            >
                                <Github size={14} />
                                GitHub
                            </a>
                        )}
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]"
                            >
                                <ExternalLink size={14} />
                                Live Demo
                            </a>
                        )}
                    </div>

                    {/* Tech stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-6">
                            {project.tech_stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-xs font-semibold px-3 py-1 rounded-full border"
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
                    )}
                </header>

                {/* Content */}
                {project.content && (
                    <div
                        className="tiptap-preview"
                        dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                )}

                {/* Footer nav */}
                <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                    >
                        <ChevronLeft size={16} />
                        모든 프로젝트 보기
                    </Link>
                </div>
            </div>
        </div>
    )
}
