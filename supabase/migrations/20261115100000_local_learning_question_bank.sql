-- Learning questions live in src/data/learningQuestions.js.
-- Keep answer attempts, but do not require each local question to be seeded in PostgreSQL.
alter table public.user_learning_answers
  drop constraint if exists user_learning_answers_question_id_fkey;

create or replace function public.record_learning_answer(
  p_question_id text,
  p_selected_option text,
  p_is_correct boolean
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_question_id is null or length(trim(p_question_id)) = 0 then
    raise exception 'Question ID is required';
  end if;
  if p_selected_option is null or p_selected_option not in ('A', 'B', 'C', 'D') then
    raise exception 'Invalid answer option';
  end if;
  if p_is_correct is null then
    raise exception 'Answer result is required';
  end if;

  insert into public.user_learning_answers as existing (
    user_id, question_id, selected_option, is_correct
  ) values (
    v_user_id, trim(p_question_id), p_selected_option, p_is_correct
  )
  on conflict (user_id, question_id) do update set
    selected_option = excluded.selected_option,
    is_correct = excluded.is_correct,
    attempt_count = existing.attempt_count + 1,
    answered_at = now()
  returning attempt_count into v_attempt_count;

  return v_attempt_count;
end;
$$;

revoke all on function public.record_learning_answer(text, text, boolean) from public, anon;
grant execute on function public.record_learning_answer(text, text, boolean) to authenticated;
