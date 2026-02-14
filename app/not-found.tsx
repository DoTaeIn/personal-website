'use client'
import React from 'react';
import {
    Terminal,
    Home,
    ArrowLeft,
    Search,
    AlertCircle,
    Ghost,
    ChevronRight,
    Code
} from 'lucide-react';

const App = () => {
    // 기존 프로젝트에서 사용된 스타일과 색상 팔레트 유지
    const bgGradient = "bg-slate-950";
    const cyanText = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600";

    // 이전 페이지로 돌아가기 기능
    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className={`min-h-screen ${bgGradient} text-slate-200 selection:bg-cyan-500/30 font-sans flex flex-col items-center justify-center px-6 relative overflow-hidden`}>

            {/* 배경 장식 요소 (기존 Hero 섹션 느낌) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* 상단 로고 (네비게이션 스타일) */}
            <div className="absolute top-8 left-8">
                <div className="font-bold text-xl tracking-tighter text-cyan-400 flex items-center gap-2">
                    <Terminal size={20} />
                    Jin.Dev
                </div>
            </div>

            <div className="max-w-2xl w-full text-center z-10">
                {/* 에러 코드 및 아이콘 */}
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 animate-ping bg-cyan-500/20 rounded-full blur-xl" />
                    <div className="relative bg-slate-900 border border-cyan-500/20 p-6 rounded-3xl shadow-2xl">
                        <Ghost size={64} className="text-cyan-400 mx-auto" />
                    </div>
                </div>

                {/* 메인 텍스트 */}
                <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-4">
                    <span className={cyanText}>404</span>
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    페이지를 찾을 수 없습니다.
                </h2>

                <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                    요청하신 페이지가 존재하지 않거나, 다른 주소로 이동되었을 수 있습니다. <br/>
                    아래 버튼을 통해 안전한 곳으로 안내해 드릴게요.
                </p>

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="w-full sm:w-auto px-8 py-3.5 border border-slate-800 hover:border-slate-600 bg-slate-900/50 text-slate-300 rounded-2xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        이전 페이지로
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full sm:w-auto px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 group"
                    >
                        <Home size={18} />
                        메인으로 돌아가기
                    </button>
                </div>

                {/* 하단 팁 / 터미널 스타일 섹션 */}
                <div className="mt-20 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm max-w-lg mx-auto text-left">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-xs font-mono text-slate-500">system_log.sh</span>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="text-slate-500 flex items-center gap-2">
                            <ChevronRight size={14} className="text-cyan-500" />
                            <span className="text-cyan-400/80">GET</span> <span>/requested-page</span>
                        </div>
                        <div className="text-red-400 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>Error: Status 404 (Not Found)</span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-2">
                            <ChevronRight size={14} className="text-cyan-500" />
                            <span>Searching for alternatives...</span>
                        </div>
                        <div className="pt-2 flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">#projects</span>
                            <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">#blog</span>
                            <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors">#contact</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 푸터 스타일 카피라이트 */}
            <div className="absolute bottom-8 text-slate-600 text-xs">
                © 2024 Jin Developer. Lost in cyberspace?
            </div>
        </div>
    );
};

export default App;