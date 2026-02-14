import {createClient} from "@/app/_utils/supabase/server";
import Projects from "@/app/_components/projectsClient";

export default async function Home() {
    // 1. 서버에서 미리 데이터 땡겨오기 (엄청 빠름)
    const supabase = await createClient()
    const { data: projects, error } = await supabase.from('projects').select('*')

    if (error) {
        console.error("DB Error:", error);
    }

    // 2. 클라이언트 컴포넌트에 데이터 '배달'
    return (
        <main>
            <Projects projects={projects || []} />
        </main>
    )
}