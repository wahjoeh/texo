create table if not exists public.learning_lessons (
  skill text not null check (skill in ('reading', 'listening', 'structure')),
  lesson_id text not null,
  title text not null,
  sort_order integer not null default 0,
  primary key (skill, lesson_id)
);

create table if not exists public.learning_questions (
  id text primary key,
  skill text not null,
  lesson_id text not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'object'),
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  foreign key (skill, lesson_id)
    references public.learning_lessons (skill, lesson_id) on delete cascade
);

create index if not exists learning_questions_skill_lesson_idx
  on public.learning_questions (skill, lesson_id, sort_order)
  where is_active;

alter table public.learning_lessons enable row level security;
alter table public.learning_questions enable row level security;

create policy "Authenticated users can read learning lessons"
  on public.learning_lessons for select to authenticated using (true);
create policy "Authenticated users can read active learning questions"
  on public.learning_questions for select to authenticated using (is_active);

grant select on public.learning_lessons to authenticated;
grant select (id, skill, lesson_id, prompt, options, sort_order, is_active)
  on public.learning_questions to authenticated;

create table if not exists public.user_learning_answers (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null references public.learning_questions (id) on delete cascade,
  selected_option text not null check (selected_option in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  attempt_count integer not null default 1 check (attempt_count > 0),
  answered_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists user_learning_answers_user_answered_idx
  on public.user_learning_answers (user_id, answered_at desc);

alter table public.user_learning_answers enable row level security;
create policy "Users can read their own learning answers"
  on public.user_learning_answers for select to authenticated
  using (auth.uid() = user_id);
grant select on public.user_learning_answers to authenticated;

create or replace function public.submit_learning_answer(
  p_question_id text,
  p_selected_option text
)
returns table (is_correct boolean, explanation text, attempts_count integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_correct boolean;
  v_explanation text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_selected_option is null or p_selected_option not in ('A', 'B', 'C', 'D') then
    raise exception 'Invalid answer option';
  end if;

  select q.correct_option = p_selected_option, q.explanation
    into v_is_correct, v_explanation
    from public.learning_questions as q
   where q.id = p_question_id and q.is_active;

  if not found then
    raise exception 'Question not found';
  end if;

  insert into public.user_learning_answers as existing (
    user_id, question_id, selected_option, is_correct
  ) values (
    v_user_id, p_question_id, p_selected_option, v_is_correct
  )
  on conflict (user_id, question_id) do update set
    selected_option = excluded.selected_option,
    is_correct = excluded.is_correct,
    attempt_count = existing.attempt_count + 1,
    answered_at = now();

  return query
  select v_is_correct, v_explanation, answer.attempt_count
    from public.user_learning_answers as answer
   where answer.user_id = v_user_id and answer.question_id = p_question_id;
end;
$$;

revoke all on function public.submit_learning_answer(text, text) from public, anon;
grant execute on function public.submit_learning_answer(text, text) to authenticated;

insert into public.learning_lessons (skill, lesson_id, title, sort_order) values
  ('reading', 'main-idea', 'Menemukan ide utama', 1),
  ('reading', 'scanning-details', 'Mencari detail dengan cepat', 2),
  ('reading', 'inference-vocabulary', 'Inferensi dan kosakata konteks', 3),
  ('listening', 'predict-context', 'Memprediksi konteks percakapan', 1),
  ('listening', 'key-details', 'Menangkap detail penting', 2),
  ('listening', 'purpose-attitude', 'Tujuan dan sikap pembicara', 3),
  ('structure', 'sentence-patterns', 'Pola dasar kalimat', 1),
  ('structure', 'subject-verb-agreement', 'Subject–verb agreement', 2),
  ('structure', 'error-identification', 'Menemukan kesalahan kalimat', 3)
on conflict (skill, lesson_id) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

insert into public.learning_questions
  (id, skill, lesson_id, prompt, options, correct_option, explanation, sort_order)
values
  ('reading-main-idea-q1', 'reading', 'main-idea',
   'Which sentence best expresses the main idea? “Urban trees lower summer temperatures. Their shade cools sidewalks, and their leaves release moisture into the air. As a result, neighborhoods with more trees are often cooler than nearby areas.”',
   '{"A":"Trees are difficult to maintain in cities.","B":"Urban trees help cool neighborhoods in more than one way.","C":"Sidewalks are warmer than nearby buildings.","D":"Most trees release moisture only in summer."}'::jsonb,
   'B', 'Kalimat B merangkum dua mekanisme yang disebutkan dan dampaknya pada suhu lingkungan; pilihan lain hanya detail atau tidak didukung teks.', 1),
  ('reading-scanning-details-q1', 'reading', 'scanning-details',
   'According to the passage, what should a reader do after locating a keyword?',
   '{"A":"Choose the answer containing the same word.","B":"Read the surrounding sentences for context.","C":"Skip the question and read the entire passage again.","D":"Look only at the first sentence."}'::jsonb,
   'B', 'Kata kunci membantu menemukan lokasi informasi. Kalimat di sekitarnya perlu dibaca untuk memastikan konteks dan parafrasanya.', 1),
  ('reading-inference-vocabulary-q1', 'reading', 'inference-vocabulary',
   'A passage says, “Unlike the fragile early models, the latest instrument remained intact after repeated impact tests.” What does “fragile” most nearly mean?',
   '{"A":"Easily broken","B":"Highly accurate","C":"Recently designed","D":"Expensive to repair"}'::jsonb,
   'A', 'Kontras dengan model terbaru yang tetap utuh setelah benturan menunjukkan bahwa fragile berarti mudah rusak atau pecah.', 1),
  ('listening-predict-context-q1', 'listening', 'predict-context',
   'A student says, “I have a presentation tomorrow, but the projector in our room is not working.” What is the most likely purpose of the conversation?',
   '{"A":"To ask for help finding a working projector","B":"To cancel the presentation permanently","C":"To explain how projectors are manufactured","D":"To invite a professor to dinner"}'::jsonb,
   'A', 'Konteks presentasi besok dan proyektor rusak paling kuat mengarah pada kebutuhan mencari bantuan atau perangkat pengganti.', 1),
  ('listening-key-details-q1', 'listening', 'key-details',
   'A woman says, “Let’s meet at two—actually, make that three. My lab ends later than I expected.” When will they meet?',
   '{"A":"At one","B":"At two","C":"At three","D":"After dinner"}'::jsonb,
   'C', 'Pembicara mengoreksi waktu awal dari pukul dua menjadi pukul tiga. Informasi terakhir adalah rencana yang berlaku.', 1),
  ('listening-purpose-attitude-q1', 'listening', 'purpose-attitude',
   'A student says, “I thought the assignment was due Friday. I wish I had checked the course page.” How does the student probably feel?',
   '{"A":"Regretful","B":"Amused","C":"Confident","D":"Impatient with the instructor"}'::jsonb,
   'A', 'Ungkapan “I wish I had checked” menunjukkan penyesalan karena tidak memeriksa informasi lebih awal.', 1),
  ('structure-sentence-patterns-q1', 'structure', 'sentence-patterns',
   'Choose the word that correctly completes the sentence: “The results of the experiment ___ published yesterday.”',
   '{"A":"was","B":"were","C":"is","D":"has"}'::jsonb,
   'B', 'Subjek utama adalah “results” (jamak). Frasa “of the experiment” hanya menjelaskan results, jadi bentuk yang tepat adalah “were”.', 1),
  ('structure-subject-verb-agreement-q1', 'structure', 'subject-verb-agreement',
   'Choose the correct verb: “The list of required courses ___ on the department website.”',
   '{"A":"appear","B":"appears","C":"are appearing","D":"have appeared"}'::jsonb,
   'B', 'Subjek utama adalah “list” (tunggal), bukan “courses”. Karena itu kata kerja present yang sesuai adalah “appears”.', 1),
  ('structure-error-identification-q1', 'structure', 'error-identification',
   'Which part contains an error? “The committee (A) have approved (B) the proposal (C) after reviewing the data (D).”',
   '{"A":"The committee","B":"have approved","C":"the proposal","D":"after reviewing the data"}'::jsonb,
   'B', '“Committee” adalah collective noun tunggal pada konteks ini, sehingga kata kerjanya seharusnya “has approved”.', 1)
on conflict (id) do update set
  skill = excluded.skill,
  lesson_id = excluded.lesson_id,
  prompt = excluded.prompt,
  options = excluded.options,
  correct_option = excluded.correct_option,
  explanation = excluded.explanation,
  sort_order = excluded.sort_order,
  is_active = true;
