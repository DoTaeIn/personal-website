import { createClient } from '@/app/_utils/supabase/server'
import { redirect } from 'next/navigation'
import NewProjectClient from '@/app/_components/clientPage/newProjectClient'

export default async function NewProjectPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) redirect('/account/login')

    return <NewProjectClient />
}
