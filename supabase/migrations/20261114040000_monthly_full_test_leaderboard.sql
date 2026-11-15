create index if not exists user_test_attempts_full_test_month_idx
  on public.user_test_attempts (taken_at, user_id, score desc)
  where test_type = 'full_test';

create or replace function public.get_monthly_full_test_leaderboard()
returns table (
  rank bigint,
  username text,
  full_test_score integer,
  taken_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with month_window as (
    select
      date_trunc('month', timezone('Asia/Jakarta', now())) at time zone 'Asia/Jakarta' as month_start,
      (date_trunc('month', timezone('Asia/Jakarta', now())) + interval '1 month') at time zone 'Asia/Jakarta' as month_end
  ),
  best_per_user as (
    select distinct on (attempt.user_id)
      attempt.user_id,
      attempt.score,
      attempt.taken_at
    from public.user_test_attempts as attempt
    cross join month_window
    where attempt.test_type = 'full_test'
      and attempt.taken_at >= month_window.month_start
      and attempt.taken_at < month_window.month_end
    order by attempt.user_id, attempt.score desc, attempt.taken_at asc
  ),
  ranked as (
    select
      row_number() over (
        order by best.score desc, best.taken_at asc, profile.username asc
      ) as user_rank,
      profile.username,
      best.score,
      best.taken_at
    from best_per_user as best
    join public.usernames as profile on profile.user_id = best.user_id
  )
  select ranked.user_rank, ranked.username, ranked.score, ranked.taken_at
  from ranked
  where ranked.user_rank <= 10
  order by ranked.user_rank;
$$;

revoke all on function public.get_monthly_full_test_leaderboard() from public;
revoke all on function public.get_monthly_full_test_leaderboard() from anon;
grant execute on function public.get_monthly_full_test_leaderboard() to authenticated;
