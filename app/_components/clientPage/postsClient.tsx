'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link'; // ★ Link 컴포넌트 사용
import { createClient } from "@/app/_utils/supabase/client"; // ★ 클라이언트 직접 사용
import { useRouter } from 'next/navigation'; // ★ 라우터 사용
import {
    Search,
    Terminal,
    LogOut,
    ArrowRight,
    PenTool,
    Github,
    Linkedin,
    Mail,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Filter,
    X
} from 'lucide-react';
import { User } from '@supabase/supabase-js'

// DB 데이터 타입 정의 (필요시 수정)
interface Post {
    id: number;
    title: string;
    content?: string; // desc 대신 content를 쓸 수도 있음
    category?: string;
    created_at: string;
    read_time?: string;
}

interface PostsProps {
    posts: Post[];
    user: User | null;
}

export default function Posts({ posts = [], user: initialUser }: PostsProps) {
    const router = useRouter();
    const supabase = createClient();

    // 유저 상태 관리 (초기값은 서버에서 받은 initialUser)
    const [user, setUser] = useState<User | null>(initialUser);

    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // ★ 1. 로그아웃 로직 내장
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.refresh(); // 페이지 새로고침하여 상태 반영
    };

    // 카테고리 추출
    const categories = useMemo(() => {
        const cats = Array.from(new Set(posts.map(p => p.category)));
        return ["All", ...cats.filter(Boolean)];
    }, [posts]);

    // 필터링
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const category = post.category || "General";
            const desc = post.content || ""; // content를 설명으로 사용 (없으면 빈 문자열)

            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                desc.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, selectedCategory]);

    // 페이지네이션
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    }, [filteredPosts, currentPage, postsPerPage]);

    // 날짜 포맷팅 함수 (YYYY.MM.DD)
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '.').slice(0, -1); // 2024. 03. 15. -> 2024. 03. 15
    };

    // 스크롤 감지
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 검색어/카테고리 변경 시 페이지 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">

            {/* --- 네비게이션 바 --- */}

            {/* --- Blog Header Section --- */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm mb-8 group w-fit"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        메인으로 돌아가기
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Writing & <span className="text-cyan-400">Thoughts</span>
                            </h1>
                            <p className="text-slate-400 max-w-xl text-lg">
                                기술적인 탐구, 개발 경험, 그리고 일상의 생각들을 기록합니다.
                                현재 총 <span className="text-cyan-400 font-bold">{posts.length}</span>개의 포스트가 있습니다.
                            </p>
                        </div>
                        {user && (
                            <Link
                                href="/posts/new" // 글쓰기 페이지 경로
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/20"
                            >
                                <PenTool size={18} />
                                글쓰기
                            </Link>
                        )}
                    </div>

                    {/* --- 검색 및 필터 UI --- */}
                    <div className="flex flex-col gap-6 p-1 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="포스트 제목이나 내용을 검색해보세요..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-slate-200 focus:ring-0 outline-none placeholder:text-slate-600"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
                            <div className="flex items-center gap-2 text-slate-500 mr-2 shrink-0">
                                <Filter size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Category:</span>
                            </div>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    //@ts-expect-error NOTE: Yeah that is string no shit
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                                        selectedCategory === cat
                                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 포스트 리스트 영역 --- */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {currentPosts.length > 0 ? (
                        <>
                            <div className="grid gap-6 mb-12">
                                {currentPosts.map((post) => (
                                    <Link key={post.id} href={`/posts/${post.id}`}>
                                        <article className="group relative p-8 rounded-3xl bg-slate-900/20 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-900/40 transition-all duration-300 cursor-pointer h-full">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-cyan-950/50 border border-cyan-800/50 text-cyan-400">
                                                            {post.category || "General"}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                            <Calendar size={14} />
                                                            {formatDate(post.created_at)}
                                                        </div>
                                                        <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                                                        <span className="text-slate-500 text-xs">
                                                            {post.read_time || "5 min"} read
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                                        {post.title}
                                                    </h3>

                                                    <p className="text-slate-400 leading-relaxed line-clamp-2">
                                                        {/* 마크다운 기호 제거 후 미리보기 (간단 버전) */}
                                                        {post.content?.replace(/[#*`]/g, '') || "내용이 없습니다."}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-sm font-semibold text-cyan-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                                                        Read More <ArrowRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>

                            {/* --- 페이지네이션 UI --- */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-800 transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {/* (간소화) 페이지 번호 표시 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-sm font-medium">
                                            Page <span className="text-cyan-400">{currentPage}</span> of {totalPages}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-800 transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-32 text-center border border-dashed border-slate-800 rounded-3xl">
                            <div className="inline-flex p-4 rounded-full bg-slate-900 text-slate-600 mb-4">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">검색 결과가 없습니다</h3>
                            <p className="text-slate-500">다른 키워드나 카테고리로 검색해보세요.</p>
                            <button
                                onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                                className="mt-6 text-cyan-500 hover:text-cyan-400 font-medium underline underline-offset-4"
                            >
                                필터 초기화하기
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <footer id="contact" className="py-20 px-6 border-t border-slate-800 mt-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">Let&#39;s Connect</h2>
                        <p className="text-slate-400 mb-6">새로운 기회는 언제나 환영합니다.</p>
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
}