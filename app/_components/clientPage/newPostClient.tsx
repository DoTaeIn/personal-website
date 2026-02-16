'use client'

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Tiptap 관련 임포트
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Level } from '@tiptap/extension-heading'; // 🔥 헤딩 타입 임포트 (중요)
import {createClient} from "@/app/_utils/supabase/client";
import {CustomModal} from "@/app/_components/clientPage/customModal";

// 아이콘 임포트
import {
    Bold, Italic, Strikethrough, Code, Link as LinkIcon,
    Heading1, Heading2, Heading3, List, ListOrdered, Quote,
    Terminal, Image as ImageIcon, Minus,
    Undo, Redo, Eye, Save,
    ArrowLeft, X, Hash, Cloud, Edit3, FolderOpen, ChevronDown, Plus
} from 'lucide-react';

// Lowlight 설정
const lowlight = createLowlight(common);

interface Category {
    id: string;
    name: string;
}

interface BlogEditorProps {
    categories: Category[]; // 서버에서 받아올 카테고리 목록
}

const ToolbarBtn = ({ icon, tooltip, active = false, onClick, disabled = false }: ToolbarBtnProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            group relative p-2 rounded-lg transition-all
            ${active
            ? 'bg-cyan-950/50 text-cyan-400 ring-1 ring-cyan-500/50'
            : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400'
        }
            ${disabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-slate-400' : ''}
        `}
    >
        {icon}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-slate-200 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
            {tooltip}
        </span>
    </button>
);

const Divider = () => (
    <div className="w-px h-6 bg-slate-700 mx-1" />
);

export default function BlogEditorPage({ categories: initialCategories }: BlogEditorProps) {
    const router = useRouter();
    const supabase = createClient();

    const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    // 이제 categories state는 필요 없고, props로 받은 categories를 바로 사용하거나
    // 초기값으로만 사용하면 됩니다. 여기선 props를 바로 씁니다.
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [_, forceUpdate] = useState(0);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'input' | 'alert';
        title: string;
        message?: string;
        placeholder?: string;
        onConfirm: (val?: string) => void;
    }>({
        isOpen: false,
        type: 'alert',
        title: '',
        onConfirm: () => {},
    });


    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3], // 사용할 헤딩 레벨 명시
                }
            }),
            Underline,
            Placeholder.configure({ placeholder: '당신의 이야기를 적어보세요...' }),
            Link.configure({ openOnClick: false, autolink: true }),
            Image.configure({ allowBase64: true }),
            CharacterCount,
            CodeBlockLowlight.configure({ lowlight }),
        ],
        onTransaction: () => {
            forceUpdate((prev) => prev + 1);
        },
        editorProps: {
            attributes: {
                // Tailwind Typography 설정
                class: `
                    prose prose-invert prose-lg max-w-none 
                    focus:outline-none 
                    text-slate-300 leading-relaxed
                    prose-h1:text-4xl prose-h1:font-bold prose-h1:text-cyan-400 prose-h1:mt-8 prose-h1:mb-4
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-cyan-200 prose-h2:mt-6 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:font-semibold prose-h3:text-cyan-100 prose-h3:mt-4 prose-h3:mb-2
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800
                    min-h-[500px]
                `.replace(/\s+/g, ' ').trim(),
            },
        },
    });

    const handleAddCategoryClick = () => {
        // 모달 열기
        setModalConfig({
            isOpen: true,
            type: 'input',
            title: '새 카테고리 추가',
            message: '추가할 카테고리의 이름을 입력해주세요.',
            placeholder: '예: React, Diary...',
            onConfirm: (name) => {
                if (name) executeAddCategory(name); // 실제 추가 로직 실행
            }
        });
    };

    const executeAddCategory = async (newCategoryName: string) => {
        if (!newCategoryName.trim()) return;
        const slug = newCategoryName.trim().toLowerCase().replace(/ /g, '-');

        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name: newCategoryName, slug: slug })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setCategoryList([...categoryList, data]);
                setSelectedCategoryId(data.id);
            }
        } catch (err) {
            // 에러 발생 시 알림 모달로 전환
            setModalConfig({
                isOpen: true,
                type: 'alert',
                title: '오류 발생',
                //@ts-expect-error NOTE: THAT IS SUPPOSE TO BE AN OBJ
                message: err.code === '23505' ? '이미 존재하는 카테고리입니다.' : '추가에 실패했습니다.',
                onConfirm: () => closeModal()
            });
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };
    const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

    // --- 핸들러 ---
    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL을 입력하세요', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('이미지 URL을 입력하세요');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    // 헤딩 토글 함수 (타입 안전하게 분리)
    const toggleHeading = (level: Level) => {
        if (!editor) return;
        editor.chain().focus().toggleHeading({ level }).run();
    };

    const handleSave = () => {
        if (!editor) return;
        const postData = {
            title,
            content: editor.getHTML(),
            tags: ['Nextjs'],
        };
        console.log("저장 데이터:", postData);
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handlePublish = async () => {
        if (!editor || isSaving) return;

        // 유효성 검사 (alert 대신 모달 사용)
        if (!title.trim()) {
            setModalConfig({
                isOpen: true, type: 'alert', title: '제목 필수',
                message: '글 제목을 입력해주세요.', onConfirm: closeModal
            });
            return;
        }
        if (!selectedCategoryId) {
            setModalConfig({
                isOpen: true, type: 'alert', title: '카테고리 필수',
                message: '카테고리를 선택해주세요.', onConfirm: closeModal
            });
            return;
        }

        setIsSaving(true);

        try {
            const { error } = await supabase.from('posts').insert({
                title,
                content: editor.getHTML(),
                category_id: selectedCategoryId,
                tags: tags,
                slug: title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
                is_published: true,
                description: editor.getText().slice(0, 150)
            });

            if (error) throw error;

            // 성공 모달 띄우기 -> 확인 누르면 이동
            setModalConfig({
                isOpen: true,
                type: 'alert',
                title: '출간 완료!',
                message: '성공적으로 블로그에 글이 등록되었습니다.',
                onConfirm: () => {
                    closeModal();
                    router.push('/blog');
                }
            });

        } catch (error) {
            console.error(error);
            setModalConfig({
                isOpen: true, type: 'alert', title: '저장 실패',
                message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                onConfirm: closeModal
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!editor) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">

            {/* --- 1. Top Navigation --- */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
                {/* ... (기존 헤더 코드) ... */}
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-500 font-medium">새 글 작성</span>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Cloud size={12} />
                                <span>{isSaving ? '저장 중...' : '작성 중'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:text-cyan-400 hover:bg-slate-800">
                            {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                            <span>{isPreview ? '편집하기' : '미리보기'}</span>
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? '저장 중...' : '출간하기'}
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 2. Main Content --- */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">

                {/* Title & Tags Input (미리보기 모드일 땐 읽기 전용처럼 보이게) */}
                <section className="space-y-4 animate-fade-in-up">
                    {/* 🔥 1. 카테고리 선택 영역 수정됨 */}
                    {!isPreview && (
                        <div className="flex items-center gap-2">
                            <div className="relative inline-block">
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-slate-800 transition-colors min-w-[160px]"
                                >
                                    <option value="" disabled>카테고리 선택</option>
                                    {/* 🔥 categoryList State 사용 */}
                                    {categoryList.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none">
                                    <FolderOpen size={16} />
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <ChevronDown size={14} />
                                </div>
                            </div>

                            {/* 🔥 추가 버튼 */}
                            <button
                                onClick={handleAddCategoryClick}
                                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                                title="새 카테고리 추가"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    )}

                    {isPreview ? (
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight border-b border-slate-800 pb-6">
                            {title || "제목 없음"}
                        </h1>
                    ) : (
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder:text-slate-600 focus:outline-none leading-tight"
                        />
                    )}

                    {/* 태그 영역은 미리보기에서도 보임 */}
                    <div className="flex flex-wrap items-center gap-2">
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-full text-cyan-400 text-sm">
                                <Hash size={14} />
                                <span>{tag}</span>
                                {!isPreview && <button onClick={() => removeTag(tag)}><X size={12} /></button>}
                            </div>
                        ))}
                        {!isPreview && (
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="태그 입력..."
                                className="bg-transparent text-slate-400 text-sm focus:outline-none min-w-[200px]"
                            />
                        )}
                    </div>
                </section>

                <div className="h-px w-full bg-slate-800/50 my-2" />

                {/* --- 3. Toolbar (미리보기 모드일 땐 숨김) --- */}
                {!isPreview && (
                    <div className="sticky top-[73px] z-40 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-wrap items-center p-1.5 gap-1 transition-all animate-in fade-in slide-in-from-top-2">
                        {/* Group 1 */}
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={<Bold size={18} />} tooltip="굵게" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={<Italic size={18} />} tooltip="기울임" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={<Strikethrough size={18} />} tooltip="취소선" />
                        </div>
                        <Divider />
                        {/* Group 2: Headings (🔥 수정된 부분) */}
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => toggleHeading(1)} active={editor.isActive('heading', { level: 1 })} icon={<span className="font-bold text-sm">H1</span>} tooltip="제목 1" />
                            <ToolbarBtn onClick={() => toggleHeading(2)} active={editor.isActive('heading', { level: 2 })} icon={<span className="font-bold text-sm">H2</span>} tooltip="제목 2" />
                            <ToolbarBtn onClick={() => toggleHeading(3)} active={editor.isActive('heading', { level: 3 })} icon={<span className="font-bold text-sm">H3</span>} tooltip="제목 3" />
                        </div>
                        <Divider />
                        {/* Group 3 */}
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={<List size={18} />} tooltip="글머리 기호" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={<ListOrdered size={18} />} tooltip="번호 매기기" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={<Quote size={18} />} tooltip="인용구" />
                        </div>
                        <Divider />
                        {/* Group 4 */}
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} icon={<Code size={18} />} tooltip="인라인 코드" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={<Terminal size={18} />} tooltip="코드 블럭" />
                            <ToolbarBtn onClick={setLink} active={editor.isActive('link')} icon={<LinkIcon size={18} />} tooltip="링크" />
                            <ToolbarBtn onClick={addImage} active={editor.isActive('image')} icon={<ImageIcon size={18} />} tooltip="이미지 업로드" />
                            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={<Minus size={18} />} tooltip="구분선" />
                        </div>
                        <div className="flex-1" />
                        {/* Group 5 */}
                        <div className="flex items-center gap-0.5 px-1 border-l border-slate-700 pl-2">
                            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<Undo size={18} />} tooltip="되돌리기" />
                            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<Redo size={18} />} tooltip="다시실행" />
                        </div>
                    </div>
                )}

                {/* --- 4. Main Editing Area OR Preview Area --- */}
                <div className="flex-1 min-h-[500px] relative pb-20">
                    {isPreview ? (
                        // 🔥 미리보기 모드: HTML 직접 렌더링 (dangerouslySetInnerHTML)
                        // prose 클래스를 똑같이 적용해서 에디터와 동일한 디자인 유지
                        <div
                            className="tiptap-preview max-w-none text-slate-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                        />
                    ) : (
                        // 편집 모드
                        <EditorContent editor={editor} className="h-full" />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="sticky bottom-0 bg-slate-950 border-t border-slate-800 py-2 px-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center text-xs text-slate-500 font-mono">
                    <div className="flex gap-4">
                        <span>{isPreview ? 'Preview Mode' : 'Markdown Mode'}</span>
                        <span className="text-slate-700">|</span>
                        <span>Words: {editor.storage.characterCount.words()}</span>
                        <span>Chars: {editor.storage.characterCount.characters()}</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </div>
                </div>
            </footer>

            <CustomModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                placeholder={modalConfig.placeholder}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
            />
        </div>
    );
}

// --- Sub Components ---
// (기존 ToolbarBtn, Divider 유지)
interface ToolbarBtnProps {
    icon: React.ReactNode;
    tooltip: string;
    active?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}
