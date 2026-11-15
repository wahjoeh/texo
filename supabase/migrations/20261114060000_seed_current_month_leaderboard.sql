with month_window as (
  select
    date_trunc('month', timezone('Asia/Jakarta', now()))::date as month_start,
    date_trunc('month', timezone('Asia/Jakarta', now()))::date::timestamp at time zone 'Asia/Jakarta' as month_start_at,
    now() as generated_at
)
insert into public.monthly_leaderboard_demo (
  month_start, slot, username, full_test_score, taken_at
)
select
  month_window.month_start,
  series.slot::smallint,
  'Demo Player ' || lpad(series.slot::text, 2, '0'),
  (310 + floor(random() * 368))::integer,
  month_window.month_start_at + random() * (month_window.generated_at - month_window.month_start_at)
from month_window
cross join generate_series(1, 10) as series(slot)
on conflict (month_start, slot) do nothing;
