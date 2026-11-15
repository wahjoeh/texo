import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceRoleKey || !publishableKey) {
    return json({ error: 'Username authentication is not configured.' }, 500)
  }

  let body: { action?: string; identifier?: string; password?: string; username?: string }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const auth = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  if (body.action === 'update_username') {
    const token = request.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    if (!token) return json({ error: 'Sign in to update your username.' }, 401)

    const { data: { user }, error: authError } = await auth.auth.getUser(token)
    if (authError || !user) return json({ error: 'Your session is invalid or expired.' }, 401)

    const username = body.username?.trim().toLowerCase() ?? ''
    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      return json({ error: 'Username must be 3–24 characters using letters, numbers, or underscores.' }, 400)
    }

    const { data: oldProfile, error: profileReadError } = await admin
      .from('usernames')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle()
    if (profileReadError) return json({ error: 'Unable to load the current username.' }, 500)

    const profileWrite = oldProfile
      ? await admin.from('usernames').update({ username }).eq('user_id', user.id)
      : await admin.from('usernames').insert({ username, user_id: user.id })
    if (profileWrite.error) {
      if (profileWrite.error.code === '23505') return json({ error: 'That username is already in use.' }, 409)
      return json({ error: 'Unable to save the username.' }, 500)
    }

    const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, username },
    })
    if (metadataError) {
      if (oldProfile) {
        await admin.from('usernames').update({ username: oldProfile.username }).eq('user_id', user.id)
      } else {
        await admin.from('usernames').delete().eq('user_id', user.id)
      }
      return json({ error: 'Unable to update account profile.' }, 500)
    }

    return json({ username })
  }

  if (body.action !== 'login') return json({ error: 'Invalid action.' }, 400)
  const identifier = body.identifier?.trim() ?? ''
  const password = body.password ?? ''
  if (!identifier || identifier.length > 254 || password.length < 8 || password.length > 72) {
    return json({ error: 'Invalid username/email or password.' }, 400)
  }

  let email = identifier
  if (!identifier.includes('@')) {
    if (!/^[a-z0-9_]{3,24}$/i.test(identifier)) {
      return json({ error: 'Invalid username or password.' }, 401)
    }

    const { data: profile } = await admin
      .from('usernames')
      .select('user_id')
      .eq('username', identifier.toLowerCase())
      .maybeSingle()
    if (!profile) return json({ error: 'Invalid username or password.' }, 401)

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.user_id)
    if (userError || !userData.user.email) return json({ error: 'Invalid username or password.' }, 401)
    email = userData.user.email
  }

  const { data: signedIn, error: signInError } = await auth.auth.signInWithPassword({ email, password })
  if (signInError || !signedIn.session) {
    return json({ error: 'Invalid username/email or password. Verify your email if you just registered.' }, 401)
  }

  return json({ session: signedIn.session })
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
