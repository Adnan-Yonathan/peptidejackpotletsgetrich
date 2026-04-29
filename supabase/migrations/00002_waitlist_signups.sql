create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'coming-soon',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

create policy "Anyone can join waitlist"
  on public.waitlist_signups for insert
  with check (true);

create policy "Anyone can upsert same waitlist email"
  on public.waitlist_signups for update
  using (true)
  with check (true);

create index idx_waitlist_signups_created_at
  on public.waitlist_signups(created_at desc);
