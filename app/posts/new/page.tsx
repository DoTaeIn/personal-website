// app/write/page.tsx
import { createClient } from "@/app/_utils/supabase/server";
import { redirect } from "next/navigation";
import BlogEditor from "@/app/_components/clientPage/newPostClient";

export default async function WritePage() {
    const supabase = await createClient();

    // 1. 유저 인증 확인 (로그인 안했으면 튕겨냄)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // 2. 카테고리 데이터 가져오기 (Server-side fetching)
    // 데이터 페칭은 서버에서 하므로 클라이언트 로딩 없이 바로 뜹니다!
    const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

    if (categoryError) {
        console.error("카테고리 로딩 에러:", categoryError);
        // 에러 처리 (필요시)
    }

    // 3. 클라이언트 컴포넌트에 데이터 전달
    return (
        <BlogEditor categories={categories || []} />
    );
}