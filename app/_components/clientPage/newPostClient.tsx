'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { Level } from '@tiptap/extension-heading'
import { createClient } from '@/app/_utils/supabase/client'
import { CustomModal } from '@/app/_components/clientPage/customModal'
import {
    Bold, Italic, Strikethrough, Code, Link as LinkIcon,
    Heading1, Heading2, Heading3, List, ListOrdered, Quote,
    Terminal, Image as ImageIcon, Minus, Undo, Redo,
    Eye, Edit3, ArrowLeft, X, Hash, Cloud, FolderOpen,
    ChevronDown, Plus, Save,
} from 'lucide-react'

const lowlight = createLowlight(common)

interface Category {
    id: string
    name: string
}

interface BlogEditorProps {
    categories: Category[]
}

interface ToolbarBtnProps {
    icon: React.ReactNode
    tooltip: string
    active?: boolean
    onClick?: () => void
    disabled?: boolean
}

const ToolbarBtn = ({ icon, tooltip, active = false, onClick, disabled = false }: ToolbarBtnProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className="group relative p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
            background: active ? 'var(--accent-light)' : 'transparent',
            color: active ? 'var(--accent)' : 'var(--text-muted)',
            outline: active ? '1px solid var(--accent)' : 'none',
        }}
        onMouseEnter={e => {
            if (!active && !disabled) {
                e.currentTarget.style.background = 'var(--bg-subtle)'
                e.currentTarget.style.color = 'var(--accent)'
            }
        }}
        onMouseLeave={e => {
            if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
            }
        }}
    >
        {icon}
        <span
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border"
            style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
            }}
        >
            {tooltip}
        </span>
    </button>
)

const Divider = () => (
    <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
)

export default function BlogEditorPage({ categories: initialCategories }: BlogEditorProps) {
    const router = useRouter()
    const supabase = createClient()

    const [categoryList, setCategoryList] = useState<Category[]>(initialCategories)
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
    const [isPreview, setIsPreview] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [_, forceUpdate] = useState(0)

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean
        type: 'input' | 'alert'
        title: string
        message?: string
        placeholder?: string
        onConfirm: (val?: string) => void
    }>({
        isOpen: false,
        type: 'alert',
        title: '',
        onConfirm: () => {},
    })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Placeholder.configure({ placeholder: '당신의 이야기를 적어보세요...' }),
            Link.configure({ openOnClick: false, autolink: true }),
            Image.configure({ allowBase64: true }),
            CharacterCount,
            CodeBlockLowlight.configure({ lowlight }),
        ],
        onTransaction: () => forceUpdate(n => n + 1),
        editorProps: {
            attributes: {
                class: 'tiptap-preview focus:outline-none min-h-[500px]',
            },
        },
    })

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }))

    const handleAddCategoryClick = () => {
        setModalConfig({
            isOpen: true,
            type: 'input',
            title: '새 카테고리 추가',
            message: '추가할 카테고리 이름을 입력해주세요.',
            placeholder: '예: React, Diary...',
            onConfirm: (name) => { if (name) executeAddCategory(name) },
        })
    }

    const executeAddCategory = async (newCategoryName: string) => {
        if (!newCategoryName.trim()) return
        const slug = newCategoryName.trim().toLowerCase().replace(/ /g, '-')
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name: newCategoryName, slug })
                .select()
                .single()
            if (error) throw error
            if (data) {
                setCategoryList([...categoryList, data])
                setSelectedCategoryId(data.id)
            }
        } catch (err: any) {
            setModalConfig({
                isOpen: true,
                type: 'alert',
                title: '오류 발생',
                message: err.code === '23505' ? '이미 존재하는 카테고리입니다.' : '추가에 실패했습니다.',
                onConfirm: closeModal,
            })
        }
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const newTag = tagInput.trim()
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag])
                setTagInput('')
            }
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1))
        }
    }

    const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL을 입력하세요', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const imageInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const addImage = useCallback(() => {
        imageInputRef.current?.click()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return

        setIsUploading(true)
        try {
            const ext = file.name.split('.').pop()
            const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { data, error } = await supabase.storage
                .from('post-images')
                .upload(filename, file, { cacheControl: '3600', upsert: false })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(data.path)

            editor.chain().focus().setImage({ src: publicUrl }).run()
        } catch (err) {
            console.error('Image upload failed:', err)
            setModalConfig({
                isOpen: true, type: 'alert', title: '업로드 실패',
                message: '이미지 업로드에 실패했습니다.',
                onConfirm: closeModal,
            })
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }

    const toggleHeading = (level: Level) => {
        if (!editor) return
        editor.chain().focus().toggleHeading({ level }).run()
    }

    const handlePublish = async () => {
        if (!editor || isSaving) return

        if (!title.trim()) {
            setModalConfig({
                isOpen: true, type: 'alert', title: '제목 필수',
                message: '글 제목을 입력해주세요.', onConfirm: closeModal,
            })
            return
        }
        if (!selectedCategoryId) {
            setModalConfig({
                isOpen: true, type: 'alert', title: '카테고리 필수',
                message: '카테고리를 선택해주세요.', onConfirm: closeModal,
            })
            return
        }

        setIsSaving(true)
        try {
            const { error } = await supabase.from('posts').insert({
                title,
                content: editor.getHTML(),
                category_id: selectedCategoryId,
                tags,
                slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                is_published: true,
                description: editor.getText().slice(0, 150),
            })
            if (error) throw error

            setModalConfig({
                isOpen: true,
                type: 'alert',
                title: '출간 완료!',
                message: '성공적으로 블로그에 글이 등록되었습니다.',
                onConfirm: () => {
                    closeModal()
                    router.push('/posts')
                },
            })
        } catch (error) {
            console.error(error)
            setModalConfig({
                isOpen: true, type: 'alert', title: '저장 실패',
                message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                onConfirm: closeModal,
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!editor) return null

    return (
        <div
            className="min-h-screen flex flex-col font-sans"
            style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
            {/* ── Top Nav ── */}
            <header
                className="sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4"
                style={{
                    background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--bg-subtle)'
                                e.currentTarget.style.color = 'var(--text)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = 'var(--text-muted)'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-sm font-medium">새 글 작성</p>
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                <Cloud size={11} />
                                {isSaving ? '저장 중...' : '작성 중'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                            style={{
                                borderColor: 'var(--border)',
                                background: 'var(--bg-subtle)',
                                color: 'var(--text-muted)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--accent)'
                                e.currentTarget.style.color = 'var(--accent)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--border)'
                                e.currentTarget.style.color = 'var(--text-muted)'
                            }}
                        >
                            {isPreview ? <Edit3 size={15} /> : <Eye size={15} />}
                            {isPreview ? '편집하기' : '미리보기'}
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="px-5 py-2 font-bold rounded-lg text-sm text-white transition-all disabled:opacity-50"
                            style={{ background: 'var(--accent)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                        >
                            {isSaving ? '저장 중...' : '출간하기'}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">

                {/* Category + Title + Tags */}
                <section className="space-y-4">
                    {!isPreview && (
                        <div className="flex items-center gap-2">
                            <div className="relative inline-block">
                                <select
                                    value={selectedCategoryId}
                                    onChange={e => setSelectedCategoryId(e.target.value)}
                                    className="appearance-none text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none transition-all cursor-pointer min-w-[160px] border"
                                    style={{
                                        background: 'var(--bg-subtle)',
                                        borderColor: selectedCategoryId ? 'var(--accent)' : 'var(--border)',
                                        color: selectedCategoryId ? 'var(--text)' : 'var(--text-muted)',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = selectedCategoryId ? 'var(--accent)' : 'var(--border)')}
                                >
                                    <option value="" disabled>카테고리 선택</option>
                                    {categoryList.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--accent)' }}>
                                    <FolderOpen size={15} />
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                                    <ChevronDown size={13} />
                                </div>
                            </div>
                            <button
                                onClick={handleAddCategoryClick}
                                className="p-2 rounded-lg border transition-all"
                                title="새 카테고리 추가"
                                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                    e.currentTarget.style.color = 'var(--accent)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                    e.currentTarget.style.color = 'var(--text-muted)'
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    {isPreview ? (
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                            {title || '제목 없음'}
                        </h1>
                    ) : (
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl md:text-5xl font-bold focus:outline-none leading-tight"
                            style={{ color: title ? 'var(--text)' : 'var(--text-muted)' }}
                        />
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        {tags.map((tag, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border"
                                style={{
                                    background: 'var(--accent-light)',
                                    borderColor: 'var(--accent)',
                                    color: 'var(--accent)',
                                }}
                            >
                                <Hash size={12} />
                                {tag}
                                {!isPreview && (
                                    <button onClick={() => removeTag(tag)} className="ml-1 opacity-70 hover:opacity-100">
                                        <X size={11} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {!isPreview && (
                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="태그 입력 후 Enter..."
                                className="bg-transparent text-sm focus:outline-none min-w-[180px]"
                                style={{ color: 'var(--text-muted)' }}
                            />
                        )}
                    </div>
                </section>

                <div className="h-px w-full" style={{ background: 'var(--border)' }} />

                {/* ── Toolbar ── */}
                {!isPreview && (
                    <div
                        className="sticky top-[73px] z-40 rounded-xl border flex flex-wrap items-center p-1.5 gap-1"
                        style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border)',
                        }}
                    >
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={<Bold size={17} />} tooltip="굵게" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={<Italic size={17} />} tooltip="기울임" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={<Strikethrough size={17} />} tooltip="취소선" />
                        </div>
                        <Divider />
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => toggleHeading(1)} active={editor.isActive('heading', { level: 1 })} icon={<span className="font-bold text-sm">H1</span>} tooltip="제목 1" />
                            <ToolbarBtn onClick={() => toggleHeading(2)} active={editor.isActive('heading', { level: 2 })} icon={<span className="font-bold text-sm">H2</span>} tooltip="제목 2" />
                            <ToolbarBtn onClick={() => toggleHeading(3)} active={editor.isActive('heading', { level: 3 })} icon={<span className="font-bold text-sm">H3</span>} tooltip="제목 3" />
                        </div>
                        <Divider />
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={<List size={17} />} tooltip="글머리 기호" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={<ListOrdered size={17} />} tooltip="번호 매기기" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={<Quote size={17} />} tooltip="인용구" />
                        </div>
                        <Divider />
                        <div className="flex items-center gap-0.5 px-1">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} icon={<Code size={17} />} tooltip="인라인 코드" />
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={<Terminal size={17} />} tooltip="코드 블럭" />
                            <ToolbarBtn onClick={setLink} active={editor.isActive('link')} icon={<LinkIcon size={17} />} tooltip="링크" />
                            <ToolbarBtn onClick={addImage} disabled={isUploading} icon={<ImageIcon size={17} />} tooltip="이미지 업로드" />
                            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={<Minus size={17} />} tooltip="구분선" />
                        </div>
                        <div className="flex-1" />
                        <div className="flex items-center gap-0.5 px-1 border-l" style={{ borderColor: 'var(--border)' }}>
                            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<Undo size={17} />} tooltip="되돌리기" />
                            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<Redo size={17} />} tooltip="다시실행" />
                        </div>
                    </div>
                )}

                {/* Hidden image file input */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />

            {/* Upload overlay */}
            {isUploading && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div
                        className="flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                    >
                        <div
                            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                        />
                        <span className="text-sm font-medium">이미지 업로드 중...</span>
                    </div>
                </div>
            )}

            {/* ── Editor / Preview ── */}
                <div className="flex-1 min-h-[500px] pb-20">
                    {isPreview ? (
                        <div
                            className="tiptap-preview"
                            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                        />
                    ) : (
                        <EditorContent editor={editor} className="h-full" />
                    )}
                </div>
            </main>

            {/* ── Footer Status Bar ── */}
            <footer
                className="sticky bottom-0 border-t py-2 px-6"
                style={{
                    background: 'var(--bg)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="max-w-4xl mx-auto flex justify-between items-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex gap-4">
                        <span>{isPreview ? 'Preview' : 'Editor'}</span>
                        <span style={{ color: 'var(--border)' }}>|</span>
                        <span>Words: {editor.storage.characterCount.words()}</span>
                        <span>Chars: {editor.storage.characterCount.characters()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
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
    )
}
