import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
            <p className="text-7xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</p>
            <h1 className="text-2xl font-bold mb-2">프로젝트를 찾을 수 없습니다</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                삭제되었거나 존재하지 않는 프로젝트입니다.
            </p>
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--accent)' }}
            >
                <ChevronLeft size={16} />
                프로젝트 목록으로
            </Link>
        </div>
    )
}
