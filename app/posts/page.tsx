// app/page.tsx
import { createClient } from "@/app/_utils/supabase/server";
import Posts from "@/app/_components/postsClient";

export default async function Home() {
    const supabase = await createClient()

    // 1. 데이터 가져오기 (병렬로 처리하면 더 빠름)
    const [projectsRes, postsRes, userRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.auth.getUser() // ★ 유저 정보 가져오기
    ]);

    return (
        <main>
            {/* ★ 2. initialUser 라는 이름으로 넘겨줍니다 */}
            <Posts
                posts={postsRes.data || []}
                user={userRes.data.user}

            />
        </main>
    )
}