'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Code,
    Cpu,
    Gamepad2,
    Server,
    Terminal,
    ExternalLink,
    Github,
    Mail,
    Linkedin,
    ArrowRight,
    Monitor,
    Layout,
    Smartphone
} from 'lucide-react';
import {Database} from "@/types/supabase";


type Project = Database['public']['Tables']['projects']['Row']

interface UIProject extends Project {
    category: 'web' | 'mobile' | 'ai' | 'infra' | 'game' | 'etc';
}

const categoryConfig: any = {
    web: { icon: Code, color: 'text-cyan-400', borderColor: 'group-hover:border-cyan-500/50', bgColor: 'bg-cyan-500/10' },
    mobile: { icon: Smartphone, color: 'text-orange-400', borderColor: 'group-hover:border-orange-500/50', bgColor: 'bg-orange-500/10' },
    ai: { icon: Cpu, color: 'text-blue-400', borderColor: 'group-hover:border-blue-500/50', bgColor: 'bg-blue-500/10' },
    infra: { icon: Server, color: 'text-emerald-400', borderColor: 'group-hover:border-emerald-500/50', bgColor: 'bg-emerald-500/10' },
    game: { icon: Gamepad2, color: 'text-purple-400', borderColor: 'group-hover:border-purple-500/50', bgColor: 'bg-purple-500/10' }, // 게임 추가
    etc: { icon: Terminal, color: 'text-slate-400', borderColor: 'group-hover:border-slate-500/50', bgColor: 'bg-slate-500/10' }
};

const TAG_KEYWORDS: Record<string, string[]> = {
    ai: ['Python', 'TensorFlow', 'PyTorch', 'AI', 'LLM', 'Deep Learning', 'RAG'],
    infra: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Server', 'CI/CD', 'Nginx'],
    mobile: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS'],
    game: ['Unity', 'C#', 'Unreal', 'Game'],
    web: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue', 'Tailwind', 'Node.js']
};

const getCategoryFromTags = (tags: string[]): UIProject['category'] => {
    // 태그가 없으면 기타(etc) 또는 기본값(web) 리턴
    if (!tags || tags.length === 0) return 'web';

    const lowerTags = tags.map(t => t.toLowerCase());

    // 1. AI 체크
    if (TAG_KEYWORDS.ai.some(k => lowerTags.includes(k.toLowerCase()))) return 'ai';
    // 2. Infra 체크
    if (TAG_KEYWORDS.infra.some(k => lowerTags.includes(k.toLowerCase()))) return 'infra';
    // 3. Mobile 체크
    if (TAG_KEYWORDS.mobile.some(k => lowerTags.includes(k.toLowerCase()))) return 'mobile';
    // 4. Game 체크
    if (TAG_KEYWORDS.game.some(k => lowerTags.includes(k.toLowerCase()))) return 'game';
    // 5. Web 체크 (가장 흔하므로 마지막에 체크하거나 기본값으로)
    if (TAG_KEYWORDS.web.some(k => lowerTags.includes(k.toLowerCase()))) return 'web';

    return 'web'; // 매칭되는게 없으면 기본값
};


export default function Projects({ projects }: { projects: UIProject[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const projectsWithCategory = useMemo<UIProject[]>(() => {
        return projects.map(project => ({
            ...project,
            category: getCategoryFromTags(project.tag || [])
        }));
    }, [projects]);

    // 필터링 로직 (이제 가공된 projectsWithCategory를 사용)
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projectsWithCategory;
        return projectsWithCategory.filter(p => p.category === activeCategory);
    }, [activeCategory, projectsWithCategory]);

    // 사용된 카테고리만 탭에 보여주기 (옵션)
    // const availableCategories = ['all', ...Array.from(new Set(projectsWithCategory.map(p => p.category)))];
    const categories = ['all', 'web', 'mobile', 'ai', 'infra', 'game'];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">

            {/* --- 네비게이션 바 (메인 페이지와 동일한 스타일) --- */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4">
                <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tighter text-cyan-400 flex items-center gap-2">
                        <Terminal size={20} />
                        Jin.Dev
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                        <Link href="/" className="hover:text-cyan-400 transition-colors">소개</Link>
                        <Link href="/projects" className="text-cyan-400">프로젝트</Link>
                        <Link href="/" className="hover:text-cyan-400 transition-colors">블로그</Link>
                        <Link href="/" className="hover:text-cyan-400 transition-colors">연락처</Link>
                    </div>
                </div>
            </nav>

            {/* --- 헤더 섹션 --- */}
            <header className="pt-40 pb-16 px-6 max-w-5xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
                        Project Gallery
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Featured Projects
            </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                        단순한 구현을 넘어 시스템 최적화와 사용자 경험을 고민하며 설계한<br/>
                        저의 대표 프로젝트들을 소개합니다.
                    </p>
                </div>
            </header>

            {/* --- 프로젝트 리스트 섹션 --- */}
            <main className="max-w-5xl mx-auto px-6 pb-32">

                {/* 카테고리 필터 버튼 */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all ${
                                activeCategory === cat
                                    ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-400'
                                    : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                            }`}
                        >
                            {cat === 'all' ? 'All Projects' : cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* 프로젝트 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const config = categoryConfig[project.category] || categoryConfig.etc;
                        const Icon = config.icon;

                        return (
                            <div
                                key={project.id}
                                className={`group relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] flex flex-col`}
                            >
                                {/* 카드 상단 아이콘 & 링크 */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-cyan-500/30 transition-colors ${config.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex gap-3">
                                        {project.links && (
                                            <a href={project.links} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                                <Github size={18} />
                                            </a>
                                        )}
                                        {project.links && (
                                            <a href={project.links} className="text-slate-500 hover:text-cyan-400 transition-colors">
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* 카드 내용 */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                                    {project.desc}
                                </p>

                                {/* 태그 리스트 */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
                                    {project.tag?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800"
                                        >
                                          {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 하단 푸터 (Contact 연결) */}
                <footer className="mt-32 pt-16 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
                            <p className="text-slate-400 text-sm">새로운 기회와 협업은 언제나 환영합니다.</p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Mail, href: "#" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="p-3 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all text-slate-400"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 text-center text-slate-500 text-xs">
                        © 2024 Jin Developer. Built with Next.js & Tailwind CSS.
                    </div>
                </footer>
            </main>
        </div>
    );
}