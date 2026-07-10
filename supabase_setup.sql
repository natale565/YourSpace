-- YourSpace: Supabase setup
-- Paste into the Supabase Dashboard -> SQL Editor and run.
-- Everything is idempotent (safe to run more than once).

-- 1. Auto-create a profiles row whenever a user signs up.
--    (Onboarding does an UPDATE, so the row must exist first.)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Backfill: create profile rows for any users who signed up
--    before the trigger existed.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- 3. Row Level Security policies.
alter table public.profiles enable row level security;

-- Anyone (including logged-out visitors on the landing page)
-- can read profiles.
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can only update their own row.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 4. Usernames must be unique (case-insensitive).
create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));
