import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create user's default lesions if they don't have any
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if they have lesions
        const { count } = await supabase
          .from('lesions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (count === 0) {
          const DEFAULT_LESIONS = [
            { user_id: user.id, name: 'Hombro derecho', zone: 'Supraespinoso / Labrum', color: '#3266ad' },
            { user_id: user.id, name: 'Rodilla', zone: 'Condromalacia rotuliana', color: '#9B5A1A' },
            { user_id: user.id, name: 'Pubalgia', zone: 'Región inguinal / Aductores', color: '#2D7D6F' },
          ]
          await supabase.from('lesions').insert(DEFAULT_LESIONS)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid_Auth_Code`)
}
