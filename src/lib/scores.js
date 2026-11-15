import { supabase } from './supabase'

const validTestTypes = new Set(['listening', 'structure', 'reading', 'full_test'])

export async function recordTestAttempt(attemptId, scores) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!attemptId) throw new Error('A test attempt ID is required.')

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) throw new Error('Sign in before saving a score.')

  const rows = scores.map(({ testType, score, correct = null, total = null, details = {} }) => {
    if (!validTestTypes.has(testType)) throw new Error(`Unsupported test type: ${testType}`)
    return {
      user_id: user.id,
      attempt_id: attemptId,
      test_type: testType,
      score: Math.round(Number(score)),
      correct: correct === null ? null : Math.round(Number(correct)),
      total: total === null ? null : Math.round(Number(total)),
      details,
      taken_at: new Date().toISOString(),
    }
  })

  const { error } = await supabase
    .from('user_test_attempts')
    .upsert(rows, {
      onConflict: 'user_id,attempt_id,test_type',
      ignoreDuplicates: true,
    })

  if (error) throw error
}
