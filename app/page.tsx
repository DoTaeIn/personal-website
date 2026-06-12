import { createClient } from "@/app/_utils/supabase/server";
import Main from "@/app/_components/clientPage/mainClient";

export default async function Home() {
    const supabase = await createClient();
    const { data: projects, error } = await supabase.from('projects').select('*');
    const { data: posts, error: postsError } = await supabase.from('posts').select('*');

    if (error || postsError) {
        console.error("DB Error:", error);
        console.error("DB Error:", postsError);
    }

    return (
        <main>
            <Main projects={projects || []} posts={posts || []} />
        </main>
    );
}
