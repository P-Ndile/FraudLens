
-- FraudLens database schema alignment
-- Date: 2026-10-28
-- Purpose: Align the existing Supabase tables with
-- the Express backend's supplier and scan fields.
--
-- This migration preserves existing tables and data.
-- It assumes the original database schema already exists.

begin;

-- 1. Add supplier banking field
alter table public.suppliers
  add column if not exists account_number text;

-- 2. Add invoice scanning and verification fields
alter table public.scans
  add column if not exists supplier_id uuid,
  add column if not exists invoice_account text,
  add column if not exists expected_account text,
  add column if not exists mismatch_flagged boolean default false,
  add column if not exists risk_level text default 'LOW',
  add column if not exists has_urgent_language boolean default false,
  add column if not exists verification_decision text,
  add column if not exists verification_notes text,
  add column if not exists verified_at timestamptz;

-- 3. Link scans to suppliers
alter table public.scans
  add constraint scans_supplier_id_fkey
  foreign key (supplier_id)
  references public.suppliers(id)
  on delete cascade;

-- 4. Improve supplier scan lookup performance
create index if not exists scans_supplier_id_idx
  on public.scans(supplier_id);

commit;
