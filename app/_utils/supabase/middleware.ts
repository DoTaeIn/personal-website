// middleware.ts (또는 해당 로직이 포함된 utils 파일)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. 유저 정보 가져오기 (세션 갱신 트리거)
    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname;

    // --- 2. 경로 그룹 정의 ---
    const authPaths = ['/account/login', '/account/register', '/account/reset-password'];
    const adminPaths = ['/admin', '/write'];
    const userPaths = ['/dashboard', '/settings', '/account/profile'];

    const isAuthRoute = authPaths.some(ap => path.startsWith(ap));
    const isAdminRoute = adminPaths.some(ap => path.startsWith(ap));
    const isUserRoute = userPaths.some(up => path.startsWith(up));

    // --- 3. 리다이렉트 로직 ---

    // Case 1: 비로그인 상태로 보호된 페이지(Admin 또는 User) 접근 시
    if (!user && (isAdminRoute || isUserRoute)) {
        const url = request.nextUrl.clone()
        url.pathname = '/account/login'
        return NextResponse.redirect(url)
    }

    // Case 2: 로그인 상태일 때 추가 권한 체크
    if (user) {
        // 이미 로그인했는데 로그인/회원가입 페이지 가려고 하면 메인으로
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // 🔥 [핵심] 관리자/글쓰기 경로 접근 시 DB에서 role 확인
        if (isAdminRoute) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role;

            // 관리자가 아닌데 관리자 페이지 접속 시 403 또는 메인으로 리다이렉트
            if (role !== 'admin') {
                // 글쓰기(/write)의 경우 editor 권한까지 허용하려면 조건을 추가하세요
                if (path.startsWith('/write') && (role === 'admin' || role === 'editor')) {
                    return response; // 통과
                }

                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return response
}