create or replace function public.get_monthly_full_test_leaderboard()
returns table (
  rank bigint,
  username text,
  full_test_score integer,
  taken_at timestamptz,
  is_demo boolean
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  current_month_start date := date_trunc('month', timezone('Asia/Jakarta', now()))::date;
  current_month_start_at timestamptz := current_month_start::timestamp at time zone 'Asia/Jakarta';
  current_month_end_at timestamptz := (current_month_start::timestamp + interval '1 month') at time zone 'Asia/Jakarta';
  v_now timestamptz := now();
begin
  with name_pool(username) as (
    values
      ('Naya Putri'), ('Raka Pradana'), ('Alya Maharani'), ('Dimas Aditya'),
      ('Caca Anindya'), ('Rafi Nugraha'), ('Keisya Putri'), ('Rizky Mahendra'),
      ('Nadya Azzahra'), ('Farel Ramadhan'), ('Zea Prameswari'), ('Ilham Saputra'),
      ('Salsa Kirana'), ('Bima Alfarizi'), ('Tasya Amelia'), ('Jovan Pratama'),
      ('Mika Ardiansyah'), ('Luna Safitri'), ('Fikri Ramadhan'), ('Dewi Larasati')
  ), shuffled_names as (
    select row_number() over (order by random())::smallint as slot,
      name_pool.username as candidate_name
    from name_pool
  )
  insert into public.monthly_leaderboard_demo (
    month_start, slot, username, full_test_score, taken_at
  )
  select
    current_month_start,
    shuffled_names.slot,
    shuffled_names.candidate_name,
    (310 + floor(random() * 368))::integer,
    current_month_start_at + random() * (v_now - current_month_start_at)
  from shuffled_names
  where shuffled_names.slot <= 10
  on conflict (month_start, slot) do nothing;

  return query
  with best_per_user as (
    select distinct on (attempt.user_id)
      attempt.user_id,
      attempt.score,
      attempt.taken_at
    from public.user_test_attempts as attempt
    where attempt.test_type = 'full_test'
      and attempt.taken_at >= current_month_start_at
      and attempt.taken_at < current_month_end_at
    order by attempt.user_id, attempt.score desc, attempt.taken_at asc
  ),
  candidates as (
    select
      profile.username as candidate_name,
      best.score as candidate_score,
      best.taken_at as candidate_taken_at,
      false as candidate_is_demo
    from best_per_user as best
    join public.usernames as profile on profile.user_id = best.user_id

    union all

    select
      demo.username as candidate_name,
      demo.full_test_score as candidate_score,
      demo.taken_at as candidate_taken_at,
      true as candidate_is_demo
    from public.monthly_leaderboard_demo as demo
    where demo.month_start = current_month_start
  ),
  ranked as (
    select
      row_number() over (
        order by candidates.candidate_score desc, candidates.candidate_taken_at asc, candidates.candidate_name asc
      ) as user_rank,
      candidates.candidate_name,
      candidates.candidate_score,
      candidates.candidate_taken_at,
      candidates.candidate_is_demo
    from candidates
  )
  select ranked.user_rank, ranked.candidate_name, ranked.candidate_score,
    ranked.candidate_taken_at, ranked.candidate_is_demo
  from ranked
  where ranked.user_rank <= 10
  order by ranked.user_rank;
end;
$$;

revoke all on function public.get_monthly_full_test_leaderboard() from public;
revoke all on function public.get_monthly_full_test_leaderboard() from anon;
grant execute on function public.get_monthly_full_test_leaderboard() to authenticated;
