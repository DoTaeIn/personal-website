import { createClient } from '@/app/_utils/supabase/server'
import Projects from '@/app/_components/clientPage/projectsClient'

export default async function Home() {
    const supabase = await createClient()
    const [{ data: projects, error }, { data: { user } }] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.auth.getUser(),
    ])

    if (error) console.error('DB Error:', error)

    return (
        <main>
            <Projects projects={projects || []} isOwner={!!user} />
        </main>
    )
}
