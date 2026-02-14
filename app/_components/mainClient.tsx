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
    CheckCircle2,
    LogOut,
    LayoutDashboard,
    AlertCircle,
    X
} from 'lucide-react';
import BlogEditor from "@/app/_components/blogEditor";
import {createClient} from "@/app/_utils/supabase/client";
import {techConfig} from "@/app/_constants/techConfig";
import { Database } from '@/types/supabase'
import { User } from '@supabase/supabase-js'
import Link from "next/link";

type Project = Database['public']['Tables']['projects']['Row']
type Post = Database['public']['Tables']['posts']['Row']

const AuthLayout = ({ children, title, subtitle, onBack, error, clearError  }) => (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12">
        <button
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
            <ArrowLeft size={20} />
            <span>메인으로 돌아가기</span>
        </button>

        <div className="w-full max-w-md">
            {/* Error Alert Box */}
            {error && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start gap-3 text-red-400">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <div className="flex-1 text-sm font-medium">
                            {error}
                        </div>
                        <button onClick={clearError} className="hover:text-red-200 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
            <div className="text-center mb-10">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
                    <Terminal size={32} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-slate-400">{subtitle}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                {children}
            </div>
        </div>
    </div>
);

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, rightElement }) => (
    <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 ${rightElement ? 'pr-12' : 'pr-4'} text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600`}
                placeholder={placeholder}
            />
            {rightElement && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);

export default function Main({ projects, posts }: { projects: Project[], posts: Post[] }){
    const [isScrolled, setIsScrolled] = useState(false);
    const [view, setView] = useState('home'); // 'home' | 'write'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState(null);
    const isLoggedIn = !!user;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const supabase = createClient();

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
        setError(null);
        window.scrollTo(0, 0);
    }, [view]);

    const validateForm = () => {
        if (!email.includes('@')) {
            setError("올바른 이메일 형식이 아닙니다.");
            return false;
        }
        if (password.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }
        if (view === 'signup' && !name.trim()) {
            setError("이름을 입력해주세요.");
            return false;
        }
        return true;
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (view === 'login') {
                // --- 로그인 ---
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // 성공 시: 유저 정보 갱신 & 홈으로 이동
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
                setView('home');
            }
            else if (view === 'signup') {
                // --- 회원가입 ---
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name }, // 이름 저장
                    }
                });
                if (error) throw error;

                alert("가입 확인 이메일을 보냈습니다! 이메일을 확인해주세요.");
                setView('login');
            }
            else if (view === 'reset-password') {
                // --- 비밀번호 재설정 ---
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;

                alert("비밀번호 재설정 링크를 이메일로 보냈습니다.");
                setView('login');
            }
        } catch (error: any) {
            alert(error.message); // 에러 발생 시 알림 (예: 비밀번호 틀림)
        } finally {
            setIsLoading(false);
        }
    };

    // ★ 4. 로그아웃 함수 추가
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('home'); // 혹은 window.location.reload()
    };

    // 네비게이션 아이템
    const navItems = [
        { id: 'about', label: '소개' },
        { id: 'projects', label: '프로젝트' },
        { id: 'blog', label: '블로그' },
        { id: 'contact', label: '연락처' },
    ];



    // 1. 글쓰기 모드 렌더링
    if (view === 'write') {
        if (!user) {
            return (
                <AuthLayout
                    title="접근 제한"
                    subtitle="로그인이 필요한 페이지입니다."
                    onBack={() => setView('home')}
                >
                    <div className="text-center">
                        <button
                            onClick={() => setView('login')}
                            className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold"
                        >
                            로그인 하러 가기
                        </button>
                    </div>
                </AuthLayout>
            );
        }

        return <BlogEditor onBack={() => setView('home')} />;
    }

    if (view === 'login') {
        return (
            <AuthLayout
                title="반가워요!"
                subtitle="Jin.Dev 계정으로 로그인을 진행합니다."
                onBack={() => setView('home')}
                error={error}
                clearError={() => setError(null)}
            >
                <form onSubmit={handleAuthAction}>
                    <InputField
                        label="이메일" type="email" placeholder="example@email.com" icon={Mail}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="비밀번호"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />

                    <div className="flex justify-end mb-6">
                        <button
                            type="button"
                            onClick={() => setView('reset-password')}
                            className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                            비밀번호를 잊으셨나요?
                        </button>
                    </div>

                    <button
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "로그인"}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-slate-800 w-full"></div>
                        <span className="bg-slate-900 px-4 text-xs text-slate-500 absolute">또는 소셜 계정으로 로그인</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                            <GithubIcon size={18} /> GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300">
                            <Chrome size={18} /> Google
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    계정이 없으신가요? {" "}
                    <button onClick={() => setView('signup')} className="text-cyan-500 hover:underline font-medium">회원가입</button>
                </p>
            </AuthLayout>
        );
    }

    if (view === 'signup') {
        return (
            <AuthLayout
                title="계정 만들기"
                subtitle="새로운 여정을 함께 시작해봐요."
                onBack={() => setView('home')}
                error={error}
                clearError={() => setError(null)}
            >
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <InputField
                        label="이름" type="text" placeholder="홍길동" icon={UserIcon}
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <InputField
                        label="이메일" type="email" placeholder="example@email.com" icon={Mail}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        label="비밀번호"
                        type={showPassword ? "text" : "password"}
                        placeholder="8자 이상의 비밀번호"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />

                    <div className="flex items-start gap-3 py-2">
                        <input type="checkbox" className="mt-1 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/50" required />
                        <span className="text-xs text-slate-400 leading-relaxed">
                            <button type="button" className="text-cyan-500 underline">서비스 이용약관</button> 및 <button type="button" className="text-cyan-500 underline">개인정보 처리방침</button>에 동의합니다.
                        </span>
                    </div>

                    <button
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "회원가입 완료"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    이미 계정이 있나요? {" "}
                    <button onClick={() => setView('login')} className="text-cyan-500 hover:underline font-medium">로그인</button>
                </p>
            </AuthLayout>
        );
    }

    if (view === 'reset-password') {
        return (
            <AuthLayout
                title="비밀번호 재설정"
                subtitle="이메일을 입력하시면 재설정 링크를 보내드려요."
                onBack={() => setView('login')}
                error={error}
                clearError={() => setError(null)}
            >
                <form onSubmit={handleAuthAction}>
                    <InputField
                        label="이메일 주소" type="email" placeholder="example@email.com" icon={Mail}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "메일 보내기"}
                    </button>
                </form>

                <button
                    onClick={() => setView('login')}
                    className="mt-6 w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                    로그인으로 돌아가기
                </button>
            </AuthLayout>
        );
    }

    // 2. 홈 화면 렌더링
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">

            {/* --- 네비게이션 바 --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 py-4' : 'bg-transparent border-transparent py-6'}`}>
                <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
                    <button
                        className="font-bold text-xl tracking-tighter text-cyan-400 flex items-center gap-2"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <Terminal size={20} />
                        Jin.Dev
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="hover:text-cyan-400 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                        <div className="h-4 w-px bg-slate-800 mx-2 hidden md:block"></div>
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                                        <UserIcon size={14} />
                                    </div>
                                    <span className="text-xs font-medium">{user?.user_metadata.full_name} 님</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                    title="로그아웃"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setView('login')}
                                className="text-sm font-semibold px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </nav>

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

                        const mainTag = project.tag?.[0] || "Default";
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
                                    {project.desc}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {(project.tag || []).map((tag, tIdx) => (
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
                            onClick={() => setView('write')}
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
                                    <span className="text-cyan-400">{post.category}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-500">{post.created_at}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 group-hover:text-cyan-300 transition-colors mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {post.desc}
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
                        <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
                        <p className="text-slate-400 mb-6">새로운 기회와 협업은 언제나 환영합니다.</p>
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
                        <p>© 2024 Jin Developer. All rights reserved.</p>
                        <p>Built with React & Tailwind CSS</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};


