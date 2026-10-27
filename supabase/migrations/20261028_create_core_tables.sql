create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  account_number text not null,
  created_at timestamptz default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  supplier_id uuid references public.suppliers(id) on delete cascade not null,
  invoice_account text,
  expected_account text,
  mismatch_flagged boolean default false,
  risk_level text default 'LOW',
  has_urgent_language boolean default false,
  verification_decision text,
  verification_notes text,
  verified_at timestamptz,
  created_at timestamptz default now()
);

alter table public.suppliers enable row level security;
alter table public.scans enable row level security;

drop policy if exists "Users see own suppliers" on public.suppliers;
create policy "Users see own suppliers" on public.suppliers
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users see own scans" on public.scans;
create policy "Users see own scans" on public.scans
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists suppliers_user_id_idx on public.suppliers(user_id);
create index if not exists scans_user_id_idx on public.scans(user_id);
