create table if not exists public.user_learning_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  skill text not null check (skill in ('reading', 'listening', 'structure')),
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, skill, lesson_id)
);

create index if not exists user_learning_progress_user_skill_idx
  on public.user_learning_progress (user_id, skill);

alter table public.user_learning_progress enable row level security;

create policy "Users can read their own learning progress"
  on public.user_learning_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can save their own learning progress"
  on public.user_learning_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own learning progress"
  on public.user_learning_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can reset their own learning progress"
  on public.user_learning_progress for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_learning_progress to authenticated;
