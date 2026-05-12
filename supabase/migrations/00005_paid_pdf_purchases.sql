-- ============================================
-- Paid PDF purchases
-- ============================================

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_slug text not null,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  stripe_customer_id text,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  amount_total integer,
  currency text,
  receipt_email text,
  metadata jsonb not null default '{}'::jsonb,
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create index if not exists idx_purchases_user on public.purchases(user_id);
create index if not exists idx_purchases_product_slug on public.purchases(product_slug);
create index if not exists idx_purchases_status on public.purchases(status);

drop trigger if exists set_updated_at_purchases on public.purchases;
create trigger set_updated_at_purchases
  before update on public.purchases
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('paid-pdfs', 'paid-pdfs', false)
on conflict (id) do update set public = excluded.public;
