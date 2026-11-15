create or replace function public.handle_auth_user_username()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_username text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'username', '')));
begin
  if normalized_username = '' then
    return new;
  end if;

  if normalized_username !~ '^[a-z0-9_]{3,24}$' then
    raise exception 'Username must be 3-24 characters using letters, numbers, or underscores.';
  end if;

  insert into public.usernames (username, user_id)
  values (normalized_username, new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_username on auth.users;
create trigger on_auth_user_created_username
after insert on auth.users
for each row execute function public.handle_auth_user_username();
