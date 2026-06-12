import Link from 'next/link'
import { FileX } from 'lucide-react'

export default function PostNotFound() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
            style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
            <div
                className="p-5 rounded-2xl border"
                style={{
                    background: 'var(--bg-subtle)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                }}
            >
                <FileX size={36} />
            </div>
            <h1 className="text-2xl font-bold">포스트를 찾을 수 없습니다</h1>
            <p style={{ color: 'var(--text-muted)' }}>삭제되었거나 존재하지 않는 글입니다.</p>
            <Link
                href="/posts"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
            >
                블로그 목록으로
            </Link>
        </div>
    )
}
