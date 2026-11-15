create table if not exists public.user_test_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid not null,
  test_type text not null check (test_type in ('listening', 'structure', 'reading', 'full_test')),
  score integer not null,
  correct integer check (correct is null or correct >= 0),
  total integer check (total is null or total >= 0),
  details jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now(),
  primary key (user_id, attempt_id, test_type),
  check (correct is null or total is null or correct <= total)
);

create index if not exists user_test_attempts_user_taken_idx
  on public.user_test_attempts (user_id, taken_at desc);

alter table public.user_test_attempts enable row level security;

create policy "Users can read their own test attempts"
  on public.user_test_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can record their own test attempts"
  on public.user_test_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

create table if not exists public.user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  test_type text not null check (test_type in ('listening', 'structure', 'reading', 'full_test')),
  attempts_count integer not null default 0 check (attempts_count >= 0),
  best_score integer,
  average_score numeric(7, 2),
  latest_score integer,
  total_correct bigint not null default 0,
  total_questions bigint not null default 0,
  last_attempt_at timestamptz,
  primary key (user_id, test_type)
);

alter table public.user_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id);

-- Preserve the latest scores already recorded before attempt history was added.
insert into public.user_test_attempts (
  user_id, attempt_id, test_type, score, correct, total, details, taken_at
)
select
  user_id,
  gen_random_uuid(),
  test_type,
  score,
  correct,
  total,
  details || '{"source":"previous_latest_score"}'::jsonb,
  taken_at
from public.user_latest_scores
on conflict (user_id, attempt_id, test_type) do nothing;

insert into public.user_progress (
  user_id,
  test_type,
  attempts_count,
  best_score,
  average_score,
  latest_score,
  total_correct,
  total_questions,
  last_attempt_at
)
select
  user_id,
  test_type,
  count(*)::integer,
  max(score),
  avg(score),
  (array_agg(score order by taken_at desc))[1],
  coalesce(sum(correct), 0),
  coalesce(sum(total), 0),
  max(taken_at)
from public.user_test_attempts
group by user_id, test_type
on conflict (user_id, test_type) do update set
  attempts_count = excluded.attempts_count,
  best_score = excluded.best_score,
  average_score = excluded.average_score,
  latest_score = excluded.latest_score,
  total_correct = excluded.total_correct,
  total_questions = excluded.total_questions,
  last_attempt_at = excluded.last_attempt_at;

create or replace function public.handle_new_test_attempt()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_latest_scores (
    user_id, test_type, score, correct, total, details, taken_at
  ) values (
    new.user_id, new.test_type, new.score, new.correct, new.total, new.details, new.taken_at
  )
  on conflict (user_id, test_type) do update set
    score = excluded.score,
    correct = excluded.correct,
    total = excluded.total,
    details = excluded.details,
    taken_at = excluded.taken_at;

  insert into public.user_progress (
    user_id, test_type, attempts_count, best_score, average_score, latest_score,
    total_correct, total_questions, last_attempt_at
  ) values (
    new.user_id, new.test_type, 1, new.score, new.score, new.score,
    coalesce(new.correct, 0), coalesce(new.total, 0), new.taken_at
  )
  on conflict (user_id, test_type) do update set
    attempts_count = public.user_progress.attempts_count + 1,
    best_score = greatest(public.user_progress.best_score, excluded.best_score),
    average_score = round(
      ((public.user_progress.average_score * public.user_progress.attempts_count) + excluded.average_score)
      / (public.user_progress.attempts_count + 1), 2
    ),
    latest_score = excluded.latest_score,
    total_correct = public.user_progress.total_correct + excluded.total_correct,
    total_questions = public.user_progress.total_questions + excluded.total_questions,
    last_attempt_at = excluded.last_attempt_at;

  return new;
end;
$$;

create trigger on_user_test_attempt_created
  after insert on public.user_test_attempts
  for each row execute function public.handle_new_test_attempt();

-- The latest-score and progress tables are maintained from immutable attempt rows.
drop policy if exists "Users can insert their own latest scores" on public.user_latest_scores;
drop policy if exists "Users can update their own latest scores" on public.user_latest_scores;
