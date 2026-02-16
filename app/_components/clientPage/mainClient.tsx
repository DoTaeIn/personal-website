'use client'
import React, { useState, useEffect } from 'react';
import {
    Code,
    Cpu,
    Gamepad2,
    Server,
    Terminal,
    BookOpen,
    Github,
    Linkedin,
    Mail,
    ArrowRight,
    ExternalLink,
    ChevronDown,
    PenTool,
    User as UserIcon,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Chrome,
    Github as GithubIcon,
    LogOut,
    AlertCircle,
    X
} from 'lucide-react';
import {techConfig} from "@/app/_constants/techConfig";
import { Database } from '@/types/supabase'
import { User } from '@supabase/supabase-js'
import Link from "next/link";
import {useRouter} from 'next/navigation';

type Project = Database['public']['Tables']['projects']['Row']
type Post = Database['public']['Tables']['posts']['Row']


export default function Main({ projects, posts }: { projects: Project[], posts: Post[] }){
    const [isScrolled, setIsScrolled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const isLoggedIn = !!user;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const router = useRouter()

    // 스크롤 감지 효과
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 화면 전환 시 최상단 이동
    useEffect(() => {
        setError("");
        window.scrollTo(0, 0);
    }, [error]);



    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">
            {/* --- Hero 섹션 --- */}
            <section className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto min-h-screen flex flex-col justify-center">
                <div className="space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
                        Open to Work
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                        안녕하세요, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              탐구하는 개발자
            </span> Jin입니다.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                        AI 연구와 시스템 인프라 구축, 그리고 게임 개발을 좋아합니다.<br/>
                        복잡한 문제를 기술로 해결하고, 그 과정을 기록하는 것을 즐깁니다.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <a href="#projects" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/20">
                            프로젝트 보기 <ArrowRight size={18} />
                        </a>
                        <button className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg transition-all">
                            이력서 다운로드
                        </button>
                    </div>
                </div>

                {/* 하단 스크롤 유도 아이콘 */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* --- 기술 스택 (About) --- */}
            <section id="about" className="py-20 px-6 bg-slate-900/50 border-y border-slate-800/50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-12 flex items-center gap-2">
                        <Cpu className="text-cyan-400" />
                        Technical Expertise
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Code />, title: "Languages", desc: "Python, Java, TypeScript" },
                            { icon: <Terminal />, title: "Backend", desc: "FastAPI, Spring Boot, Next.js" },
                            { icon: <Server />, title: "Infra", desc: "Docker, K8s, Linux" },
                            { icon: <Gamepad2 />, title: "Game Dev", desc: "Unity, C#, Shader Graph" }
                        ].map((skill, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                                <div className="mb-4 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                    {skill.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{skill.title}</h3>
                                <p className="text-sm text-slate-400">{skill.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Featured Projects --- */}
            <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
                        <p className="text-slate-400">직접 기획하고 개발한 주요 프로젝트들입니다.</p>
                    </div>
                    <Link href="/projects" className="hidden md:flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                        전체 보기 <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {projects.map((project, idx) => {

                        const mainTag = project.tech_stack?.[0] || "Default";
                        const theme = techConfig[mainTag] || techConfig["Default"];
                        const IconComponent = theme.icon;

                        return (
                            <div key={idx} className={`group relative p-6 rounded-2xl border ${theme.color} hover:-translate-y-1 transition-transform duration-300`}>
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink size={20} className="text-slate-300" />
                                </div>
                                <div className="mb-4 p-3 bg-slate-950 rounded-lg w-fit">
                                    <IconComponent/>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {(project.tech_stack || []).map((tag, tIdx) => (
                                        <span key={tIdx} className="text-xs px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* --- Recent Posts (Blog) --- */}
            <section id="blog" className="py-24 px-6 bg-slate-900/30">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="text-cyan-400" />
                            Recent Writing
                        </h2>
                        <button
                            onClick={() => router.push("/posts/new")}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-all text-sm font-medium border border-slate-700 hover:border-cyan-500/50"
                        >
                            <PenTool size={16} />
                            <span className="hidden sm:inline">새 글 작성</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {posts.map((post, idx) => (
                            <div key={idx} className="group cursor-pointer block p-6 -mx-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-xs font-medium">
                                    <span className="text-cyan-400">{post.slug}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-500">{post.created_at}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 group-hover:text-cyan-300 transition-colors mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/posts" // 이동할 주소
                            className="text-slate-400 hover:text-white font-medium text-sm transition-colors border-b border-transparent hover:border-slate-500 pb-1"
                        >
                            블로그 전체 글 보러가기
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Footer (Contact) --- */}
            <footer id="contact" className="py-20 px-6 border-t border-slate-800 mt-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">Let&#39;s Connect</h2>
                        <p className="text-slate-400 mb-6">새로운 기회를 기다리겠습니다.</p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-cyan-400 transition-all text-slate-300">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-cyan-400 transition-all text-slate-300">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-cyan-400 transition-all text-slate-300">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm text-center md:text-right">
                        <p>© 2026 Ahn Jin. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};


