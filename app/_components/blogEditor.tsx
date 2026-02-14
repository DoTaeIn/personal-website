'use client'
import React, { useState, useRef} from 'react';
import {
    Code,
    ChevronDown,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Type,
    List,
    Edit3,
    Check,
    AlertCircle,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {createClient} from "@/app/_utils/supabase/client";

// --- 블로그 에디터 컴포넌트 ---
const BlogEditor = ({ onBack }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Tech');
    const [content, setContent] = useState('# 여기에 내용을 입력하세요...\n\n마크다운 형식을 지원합니다.');
    const [tagInput, setTagInput] = useState(''); // 입력받는 날것의 문자열 (예: "React, Next.js")
    const [isSaving, setIsSaving] = useState(false);

    const [isPreview, setIsPreview] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const categories = ["Tech", "AI Research", "Essay", "Troubleshooting"];

    const [showExitModal, setShowExitModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isDirty, setIsDirty] = useState(false);

    const supabase = createClient();

    const textareaRef = useRef(null);
    const insertFormat = (symbol, suffix = symbol) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // 현재 커서 위치와 선택된 텍스트 범위 가져오기
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        // 선택된 텍스트가 있는지 확인
        const before = text.substring(0, start);
        const selection = text.substring(start, end); // 드래그한 텍스트
        const after = text.substring(end);

        // 새로운 텍스트 생성
        const newText = before + symbol + selection + suffix + after;

        // State 업데이트
        setContent(newText);

        // UX: 버튼 누른 후 다시 에디터로 포커스 이동 & 커서 위치 조정
        setTimeout(() => {
            textarea.focus();
            // 커서를 감싸진 텍스트 뒤쪽(혹은 내부)으로 이동
            const newCursorPos = end + symbol.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // 3. 템플릿 삽입 기능 (이미지, 리스트 등)
    const insertTemplate = (type) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(start);

        let template = '';
        let cursorOffset = 0;

        if (type === 'image') {
            template = '![이미지 설명](이미지URL)';
            cursorOffset = 2; // "이미지 설명" 부분을 드래그하고 싶다면 계산 필요
        } else if (type === 'list') {
            template = '\n- 리스트 아이템';
            cursorOffset = template.length;
        }

        setContent(before + template + after);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }, 0);
    };

    const showToastMessage = (message, type = 'error') => {
        setToast({ show: true, message, type });
        // 3초 뒤 자동 닫힘
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleSave = async () => {
        // 1) 유효성 검사 (제목이나 내용이 비었으면 막기)
        if (!title.trim()) return showToastMessage("제목을 입력해주세요!");
        if (!content.trim()) return showToastMessage("내용을 입력해주세요!");

        try {
            setIsSaving(true); // 로딩 시작

            // 2) 로그인한 유저 정보 가져오기 (보안)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                showToastMessage("로그인이 세션이 만료되었습니다. 다시 로그인해주세요.");
                return;
            }

            const tagsArray = tagInput
                .split(',')
                .map(tag => tag.trim()) // 공백 제거
                .filter(tag => tag.length > 0); // 빈 태그 제거

            // 4) DB에 저장 (posts 테이블)
            const { error } = await supabase.from('posts').insert({
                title: title,
                content: content,
                category: category,
                tags: tagsArray,      // 태그 배열 저장
                user_id: user.id      // 작성자 ID (필수!)
            });

            if (error) throw error;

            showToastMessage("성공적으로 발행되었습니다! 🎉");
            onBack(); // 저장 후 목록으로 돌아가기

        } catch (error: any) {
            console.error("저장 실패:", error);
            showToastMessage(`저장에 실패했습니다: ${error.message}`);
        } finally {
            setIsSaving(false); // 로딩 끝
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* --- [추가] 토스트 알림 메시지 디자인 --- */}
            <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'} backdrop-blur-md`}>
                    {toast.type === 'error' ? <AlertCircle size={18} className="text-rose-400"/> : <CheckCircle size={18} className="text-emerald-400"/>}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            </div>

            {/* --- [추가] 나가기 경고 모달 디자인 --- */}
            {showExitModal && (
                <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-rose-400 mb-4">
                            <div className="p-2 bg-rose-500/10 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">저장하지 않고 나가시겠습니까?</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            작성 중인 내용이 저장되지 않았습니다. 페이지를 벗어나면 모든 변경사항이 사라집니다.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                계속 작성하기
                            </button>
                            <button
                                onClick={onBack}
                                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
                            >
                                나가기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 px-6">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>돌아가기</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden sm:inline">자동 저장됨</span>
                        <button className="px-4 py-2 bg-transparent border border-slate-700 hover:border-slate-500 rounded-lg text-slate-300 text-sm font-medium transition-colors">
                            임시 저장
                        </button>
                        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-colors" onClick={handleSave}>
                            <Save size={16} />
                            발행하기
                        </button>
                    </div>
                </div>
            </nav>

            {/* 에디터 메인 영역 */}
            <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto animate-fade-in-up">

                {/* 메타데이터 입력 */}
                <div className="space-y-6 mb-8">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder-slate-600 border-none outline-none focus:ring-0 px-0"
                    />

                    <div className="flex flex-wrap gap-4 items-center relative z-20">
                        {/* 커스텀 카테고리 드롭다운 */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 text-sm font-medium rounded-full py-2.5 pl-5 pr-4 transition-all outline-none focus:ring-2 focus:ring-cyan-500/20"
                            >
                                <span>{category}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* 드롭다운 메뉴 */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-30">
                                    {categories.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setCategory(item);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors flex items-center justify-between group"
                                        >
                                            {item}
                                            {category === item && <Check size={14} className="text-cyan-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 태그 입력 */}
                        <input
                            type="text"
                            placeholder="태그 입력 (쉼표로 구분)"
                            className="flex-1 bg-transparent border-b border-slate-800 focus:border-cyan-500 text-slate-300 text-sm py-2 px-1 outline-none transition-colors placeholder-slate-600"
                        />
                    </div>
                </div>

                {/* 툴바 & 탭 */}
                <div className="sticky top-20 z-10 bg-slate-950 border border-slate-800 rounded-t-xl overflow-hidden flex justify-between items-center px-4 py-2 mt-8">
                    <div className="flex gap-1 text-slate-400">
                        {/* 4. 버튼에 onClick 핸들러 연결 */}
                        <button
                            onClick={() => insertFormat('**')}
                            className="p-2 hover:bg-slate-800 rounded transition-colors group" title="Bold"
                        >
                            <Type size={18} className="group-hover:text-cyan-400"/>
                        </button>

                        <button
                            onClick={() => insertFormat('*')}
                            className="p-2 hover:bg-slate-800 rounded transition-colors group" title="Italic"
                        >
                            <Edit3 size={18} className="group-hover:text-cyan-400"/>
                        </button>

                        <div className="w-px h-6 bg-slate-800 mx-2 self-center"></div>

                        <button
                            onClick={() => insertFormat('```\n', '\n```')}
                            className="p-2 hover:bg-slate-800 rounded transition-colors group" title="Code Block"
                        >
                            <Code size={18} className="group-hover:text-cyan-400"/>
                        </button>

                        <button
                            onClick={() => insertTemplate('image')}
                            className="p-2 hover:bg-slate-800 rounded transition-colors group" title="Image"
                        >
                            <ImageIcon size={18} className="group-hover:text-cyan-400"/>
                        </button>

                        <button
                            onClick={() => insertTemplate('list')}
                            className="p-2 hover:bg-slate-800 rounded transition-colors group" title="List"
                        >
                            <List size={18} className="group-hover:text-cyan-400"/>
                        </button>
                    </div>

                    {/* 프리뷰 버튼 (그대로 유지) */}
                    <div className="flex bg-slate-900 rounded-lg p-1">
                        <button onClick={() => setIsPreview(false)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!isPreview ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Edit</button>
                        <button onClick={() => setIsPreview(true)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${isPreview ? 'bg-cyan-900/50 text-cyan-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}>Preview</button>
                    </div>
                </div>

                {/* 편집기 / 프리뷰 영역 */}
                <div className="min-h-[500px] border-x border-b border-slate-800 rounded-b-xl bg-slate-900/30">
                    {!isPreview ? (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[600px] bg-transparent text-slate-300 p-6 outline-none resize-none font-mono text-sm leading-relaxed"
                            placeholder="여기에 글을 작성하세요..."
                        ></textarea>
                    ) : (
                        // ★ 2. 여기가 프리뷰 영역입니다!
                        <div className="w-full h-[600px] p-8 overflow-y-auto">
                            <h1 className="text-3xl font-bold mb-8 text-white">{title || "제목 없음"}</h1>

                            {/* prose: Tailwind Typography 스타일 적용 */}
                            <div className="prose prose-invert prose-cyan max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]} // 표, 링크, 체크리스트 지원
                                    components={{
                                        // 코드 블럭 커스텀 렌더링
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    {...props}
                                                    style={vscDarkPlus} // 테마 설정
                                                    language={match[1]} // 언어 감지 (js, python 등)
                                                    PreTag="div"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                // 인라인 코드 (`code`) 스타일
                                                <code {...props} className={`${className} bg-slate-800 text-cyan-400 px-1 py-0.5 rounded`}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BlogEditor;