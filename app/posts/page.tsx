// app/page.tsx
import { createClient } from "@/app/_utils/supabase/server";
import Posts from "@/app/_components/clientPage/postsClient";
import Header from "@/app/_components/clientPage/header";
import {use} from "react";

export default async function Home() {
    const supabase = await createClient();


    // 1. 데이터 병렬 가져오기
    const [postsRes, userRes] = await Promise.all([
        // posts를 가져올 때 categories 테이블과 Join하여 name을 가져옵니다.
        supabase
            .from('posts')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('is_published', true) // 출간된 글만
            .order('created_at', { ascending: false }),
        supabase.auth.getUser()
    ]);

    const formattedPosts = postsRes.data?.map(post => ({
        ...post,
        category: post.categories?.name || "General" // Join된 데이터 매핑
    })) || [];

    return (
        <main>
            <Posts
                posts={formattedPosts}
                user={userRes.data.user}
            />
        </main>
    );
}