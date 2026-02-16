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
    Smartphone,
    Globe
} from 'lucide-react';
import {Database} from "@/types/supabase";


type Project = Database['public']['Tables']['projects']['Row'];

// UI용 카테고리 설정 (DB의 project_type Enum과 매칭)
const categoryConfig: Record<string, any> = {
    web: { icon: Globe, color: 'text-cyan-400', label: 'Web' },
    mobile: { icon: Smartphone, color: 'text-orange-400', label: 'Mobile' },
    ai: { icon: Cpu, color: 'text-blue-400', label: 'AI' },
    infra: { icon: Server, color: 'text-emerald-400', label: 'Infra' },
    game: { icon: Gamepad2, color: 'text-purple-400', label: 'Game' },
    other: { icon: Terminal, color: 'text-slate-400', label: 'Other' }
};


const TAG_KEYWORDS: Record<string, string[]> = {
    ai: ['Python', 'TensorFlow', 'PyTorch', 'AI', 'LLM', 'Deep Learning', 'RAG'],
    infra: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Server', 'CI/CD', 'Nginx'],
    mobile: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS'],
    game: ['Unity', 'C#', 'Unreal', 'Game'],
    web: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue', 'Tailwind', 'Node.js']
};


export default function Projects({ projects }: { projects: Project[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // 필터링 로직 (이제 가공된 projectsWithCategory를 사용)
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projects;
        return projects.filter(p => p.type === activeCategory);
    }, [activeCategory, projects]);

    // 사용된 카테고리만 탭에 보여주기 (옵션)
    // const availableCategories = ['all', ...Array.from(new Set(projectsWithCategory.map(p => p.category)))];
    const categories = ['all', 'web', 'mobile', 'ai', 'infra', 'game'];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">

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
                        const config = categoryConfig[project.type || 'other'];
                        const Icon = config.icon;

                        return (
                            <Link
                                key={project.id}
                                href={`/projects/${project.slug}`}
                                className="group block h-full"
                            >
                                <div className="relative h-full p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-slate-900/60 overflow-hidden flex flex-col">

                                    {/* 배경 효과 */}
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />

                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`p-3.5 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-cyan-500/50 transition-all duration-500 ${config.color}`}>
                                            <Icon size={28} />
                                        </div>
                                        <div className="flex gap-4 text-slate-500">
                                            {project.github_url && <Github size={20} className="hover:text-white transition-colors" />}
                                            {project.demo_url && <ExternalLink size={20} className="hover:text-cyan-400 transition-colors" />}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* 4. tech_stack 배열 매핑 (이전의 slug 에러 해결) */}
                                    <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-slate-800/50">
                                        {project.tech_stack?.map((tech) => (
                                            <span
                                                key={tech}
                                                className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-950 text-slate-500 border border-slate-800 group-hover:border-cyan-500/20 group-hover:text-cyan-500/70 transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
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