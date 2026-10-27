-- Run once in the Supabase SQL Editor. Never put service-role keys in the frontend.
create table if not exists public.business_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null, business_name text not null,
 business_type text not null, employees text not null,
 plan_preference text not null check (plan_preference in ('business','team')),
 created_at timestamptz not null default now()
);
create table if not exists public.suppliers (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, contact text not null default '', phone text not null default '',
 bank text not null default '', account text not null default '',
 status text not null default 'Pending' check (status in ('Pending','Verified')),
 created_at timestamptz not null default now()
);
create table if not exists public.scans (
 id text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 supplier text not null, date text, risk text, status text, scenario text,
 bank text, account text, phone text,
 created_at timestamptz not null default now()
);
create index if not exists suppliers_user_id_idx on public.suppliers(user_id);
create index if not exists scans_user_id_idx on public.scans(user_id);
alter table public.business_profiles enable row level security;
alter table public.suppliers enable row level security;
alter table public.scans enable row level security;
create policy "Own profile select" on public.business_profiles for select to authenticated using (user_id=auth.uid());
create policy "Own profile update" on public.business_profiles for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "Own suppliers" on public.suppliers for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "Own scans" on public.scans for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
-- The trigger runs with elevated privileges to create profile after email/password signup.
create or replace function public.create_business_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.business_profiles(user_id,full_name,business_name,business_type,employees,plan_preference)
 values(new.id,
 coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'New user'),
 coalesce(nullif(new.raw_user_meta_data->>'business_name',''),'Unnamed business'),
 coalesce(new.raw_user_meta_data->>'business_type','other'),
 coalesce(new.raw_user_meta_data->>'employees','1-10'),
 case when new.raw_user_meta_data->>'plan_preference'='team' then 'team' else 'business' end);
 return new;
end;$$;
drop trigger if exists on_business_user_created on auth.users;
create trigger on_business_user_created after insert on auth.users
for each row execute function public.create_business_profile();
