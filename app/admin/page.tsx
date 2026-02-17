// app/admin/page.tsx
import { createClient } from "@/app/_utils/supabase/server";
import { redirect } from "next/navigation";
import AdminPage from "@/app/_components/clientPage/adminClient";

export default async function AdminPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    if (!user || profile?.role !== 'admin') {
        redirect('/'); // 관리자 아니면 홈으로
    }

    // 2. 초기 데이터 병렬 페칭 (Parallel Data Fetching)
    const [usersRes, postsRes, statsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('posts').select('*').is('deleted_at', null).order('created_at', { ascending: false }),
        // 통계용 쿼리 (예시: 전체 조회수 합계 등)
        supabase.from('posts').select('views').is('deleted_at', null)
    ]);

    return (
        <AdminPage
            initialUsers={usersRes.data || []}
            initialPosts={postsRes.data || []}
            adminInfo={user}
        />
    );
}