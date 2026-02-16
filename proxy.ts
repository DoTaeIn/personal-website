import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/_utils/supabase/middleware'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    // 미들웨어가 실행될 경로 지정
    // _next/static, _next/image, favicon 등 정적 파일은 제외하고 모든 경로에서 실행
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}