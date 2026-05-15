-- ============================================
-- Revenue attribution and funnel events
-- ============================================

create table if not exists public.revenue_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  session_id text not null,
  event_type text not null check (
    event_type in (
      'quiz_started',
      'quiz_completed',
      'signup_started',
      'signup_completed',
      'paywall_viewed',
      'checkout_started',
      'checkout_completed',
      'affiliate_click'
    )
  ),
  source_page text,
  source_type text,
  goal_id text,
  peptide_id text,
  peptide_slug text,
  vendor_id text,
  vendor_slug text,
  product_slug text,
  offer_type text,
  destination_url text,
  amount_total integer,
  currency text,
  utm_params jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.revenue_events enable row level security;

create policy "Anyone can insert revenue events"
  on public.revenue_events for insert
  with check (true);

create policy "Users can view own revenue events"
  on public.revenue_events for select
  using (auth.uid() = user_id);

grant insert on public.revenue_events to anon, authenticated;
grant select on public.revenue_events to authenticated;

create index if not exists idx_revenue_events_created_at on public.revenue_events(created_at);
create index if not exists idx_revenue_events_session on public.revenue_events(session_id);
create index if not exists idx_revenue_events_type on public.revenue_events(event_type);
create index if not exists idx_revenue_events_user on public.revenue_events(user_id);
create index if not exists idx_revenue_events_source_page on public.revenue_events(source_page);
create index if not exists idx_revenue_events_product_slug on public.revenue_events(product_slug);
create index if not exists idx_revenue_events_vendor_slug on public.revenue_events(vendor_slug);
create index if not exists idx_revenue_events_peptide_slug on public.revenue_events(peptide_slug);

-- Keep legacy affiliate_events useful for the static-data affiliate router.
alter table public.affiliate_events
  add column if not exists session_id text,
  add column if not exists source_type text,
  add column if not exists vendor_slug text,
  add column if not exists peptide_slug text,
  add column if not exists destination_url text,
  add column if not exists utm_params jsonb not null default '{}'::jsonb,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

grant insert on public.affiliate_events to anon, authenticated;
grant select on public.affiliate_events to authenticated;

create index if not exists idx_affiliate_events_session on public.affiliate_events(session_id);
create index if not exists idx_affiliate_events_vendor_slug on public.affiliate_events(vendor_slug);
create index if not exists idx_affiliate_events_peptide_slug on public.affiliate_events(peptide_slug);
create index if not exists idx_affiliate_events_source_type on public.affiliate_events(source_type);

-- Denormalized checkout attribution fields for reporting without parsing metadata.
alter table public.purchases
  add column if not exists offer_type text,
  add column if not exists source_page text,
  add column if not exists quiz_session_id text,
  add column if not exists goal_id text,
  add column if not exists primary_peptide_slug text;

create index if not exists idx_purchases_offer_type on public.purchases(offer_type);
create index if not exists idx_purchases_source_page on public.purchases(source_page);
create index if not exists idx_purchases_quiz_session on public.purchases(quiz_session_id);
