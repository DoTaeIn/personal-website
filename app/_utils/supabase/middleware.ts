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

    // 유저 정보 가져오기 & 토큰 갱신
    const {
        data: { user },
    } = await supabase.auth.getUser()


    // --- 경로 보호 로직 ---
    const path = request.nextUrl.pathname;

    // 1. [수정됨] 로그인한 유저가 못 들어가는 페이지 (Auth 관련)
    // 폴더명이 'register'라면 여기서도 'register'로 맞춰야 합니다.
    const authPaths = ['/account/login', '/account/register', '/account/reset-password'];
    const isAuthRoute = authPaths.some(ap => path.startsWith(ap));

    // 2. [수정됨] 로그인 안 한 유저가 못 들어가는 페이지 (보호된 페이지)
    // ⚠️ 중요: '/account' 전체를 넣으면 로그인 페이지도 막히므로 뺐습니다.
    // 만약 '/account/profile' 같은 개인 페이지가 있다면 그것만 따로 명시하세요.
    const protectedPaths = [
        '/dashboard',
        '/posts/new',
        '/settings',
        // '/account/profile' // (예시) account 내부에 보호해야 할 페이지가 있다면 이렇게 구체적으로 적으세요.
    ];
    const isProtectedRoute = protectedPaths.some(pp => path.startsWith(pp));


    // Case 1: 비로그인 상태로 보호된 페이지 접근 -> 로그인 페이지로 이동
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/account/login' // 경로 수정됨
        // url.searchParams.set('next', path) // 로그인 후 되돌아오기 기능 필요시 주석 해제
        return NextResponse.redirect(url)
    }

    // Case 2: 로그인 상태로 Auth 페이지 접근 -> 메인으로 이동
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return response
}