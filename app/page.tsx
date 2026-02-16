import {createClient} from "@/app/_utils/supabase/server";
import Main from "@/app/_components/clientPage/mainClient";
import {cookies} from "next/headers";
import Header from "@/app/_components/clientPage/header";

export default async function Home() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from('projects').select('*');
  const { data: posts, error: postsError } = await supabase.from('posts').select('*');
  const { data:user, error: userError } = await supabase.auth.getUser();

    if (error || postsError) {
        console.error("DB Error:", error);
        console.error("DB Error:", postsError);
    }
    console.log("프로젝트 데이터:", projects);
  return (
      <main>
          <Header user={user.user}/>
          <Main projects={projects || []} posts={posts || []}/>
      </main>
  )
}