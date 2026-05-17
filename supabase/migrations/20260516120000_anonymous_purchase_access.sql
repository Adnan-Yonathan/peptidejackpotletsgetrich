-- ============================================
-- Anonymous checkout context and purchase access
-- ============================================

create table if not exists public.checkout_contexts (
  id uuid primary key default gen_random_uuid(),
  quiz_session_id text not null unique,
  email text,
  quiz_snapshot jsonb,
  recommended_peptides jsonb,
  goal_id text,
  primary_peptide_slug text,
  source_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.checkout_contexts enable row level security;

grant select, insert, update, delete on public.checkout_contexts to service_role;

create index if not exists idx_checkout_contexts_quiz_session
  on public.checkout_contexts(quiz_session_id);
create index if not exists idx_checkout_contexts_email
  on public.checkout_contexts(email);
create index if not exists idx_checkout_contexts_created_at
  on public.checkout_contexts(created_at);

drop trigger if exists set_updated_at_checkout_contexts on public.checkout_contexts;
create trigger set_updated_at_checkout_contexts
  before update on public.checkout_contexts
  for each row execute function public.set_updated_at();

alter table public.purchases
  alter column user_id drop not null,
  add column if not exists access_token_hash text unique,
  add column if not exists access_token_created_at timestamptz,
  add column if not exists access_token_last_used_at timestamptz,
  add column if not exists quiz_snapshot jsonb,
  add column if not exists recommended_peptides jsonb;

create index if not exists idx_purchases_access_token_hash
  on public.purchases(access_token_hash);
create index if not exists idx_purchases_receipt_email
  on public.purchases(receipt_email);
create index if not exists idx_purchases_stripe_checkout_session
  on public.purchases(stripe_checkout_session_id);

