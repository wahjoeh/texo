create table if not exists public.user_latest_scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  test_type text not null check (test_type in ('listening', 'structure', 'reading', 'full_test')),
  score integer not null,
  correct integer check (correct is null or correct >= 0),
  total integer check (total is null or total >= 0),
  details jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now(),
  primary key (user_id, test_type)
);

alter table public.user_latest_scores enable row level security;

create policy "Users can read their own latest scores"
  on public.user_latest_scores for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own latest scores"
  on public.user_latest_scores for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own latest scores"
  on public.user_latest_scores for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
