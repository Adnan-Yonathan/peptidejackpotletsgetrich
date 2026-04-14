-- ============================================
-- PeptidePros Initial Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================
-- PROFILES (mirrors auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- GOALS
-- ============================================
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  description text,
  icon text,
  sort_order int not null default 0
);

alter table public.goals enable row level security;

create policy "Goals are publicly readable"
  on public.goals for select
  using (true);

-- Seed goals
insert into public.goals (name, display_name, description, icon, sort_order) values
  ('muscle_growth', 'Muscle Growth', 'Support lean muscle development and recovery', 'dumbbell', 1),
  ('fat_loss', 'Fat Loss', 'Support metabolic processes and body composition goals', 'flame', 2),
  ('recovery', 'Recovery', 'Support tissue repair and faster recovery between sessions', 'heart-pulse', 3),
  ('anti_aging', 'Anti-Aging', 'Support longevity, skin health, and cellular repair', 'clock', 4),
  ('cognitive', 'Cognitive Enhancement', 'Support focus, memory, and mental clarity', 'brain', 5),
  ('sleep', 'Sleep Optimization', 'Support deeper, more restorative sleep', 'moon', 6),
  ('healing', 'Injury Healing', 'Support recovery from specific injuries or chronic issues', 'bandage', 7),
  ('sexual_health', 'Sexual Health', 'Support libido, performance, and hormonal balance', 'heart', 8);

-- ============================================
-- PEPTIDES
-- ============================================
create table public.peptides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  long_description text,
  category text,
  experience_level text not null default 'beginner' check (experience_level in ('beginner', 'intermediate', 'advanced')),
  risk_level int not null default 1 check (risk_level between 1 and 5),
  typical_dose text,
  typical_cycle_weeks int,
  administration text,
  budget_tier text not null default 'mid' check (budget_tier in ('budget', 'mid', 'premium')),
  price_range_low numeric(10,2),
  price_range_high numeric(10,2),
  is_stackable boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.peptides enable row level security;

create policy "Published peptides are publicly readable"
  on public.peptides for select
  using (status = 'published');

-- ============================================
-- PEPTIDE_GOALS (join table)
-- ============================================
create table public.peptide_goals (
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  relevance_score int not null default 5 check (relevance_score between 1 and 10),
  primary key (peptide_id, goal_id)
);

alter table public.peptide_goals enable row level security;

create policy "Peptide goals are publicly readable"
  on public.peptide_goals for select
  using (true);

-- ============================================
-- VENDORS
-- ============================================
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text,
  logo_url text,
  description text,
  has_lab_testing boolean not null default false,
  has_coa boolean not null default false,
  ships_international boolean not null default false,
  shipping_speed text,
  payment_methods text[],
  refund_policy text,
  trust_score numeric(3,1) check (trust_score between 1.0 and 10.0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table public.vendors enable row level security;

create policy "Published vendors are publicly readable"
  on public.vendors for select
  using (status = 'published');

-- ============================================
-- VENDOR_PEPTIDES (pricing join table)
-- ============================================
create table public.vendor_peptides (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  price numeric(10,2) not null,
  unit text,
  url text,
  affiliate_url text,
  in_stock boolean not null default true,
  last_verified_at timestamptz,
  unique (vendor_id, peptide_id, unit)
);

alter table public.vendor_peptides enable row level security;

create policy "Vendor peptides are publicly readable"
  on public.vendor_peptides for select
  using (true);

-- ============================================
-- RECOMMENDATION_RULES
-- ============================================
create table public.recommendation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal_id uuid references public.goals(id),
  budget_tier text check (budget_tier is null or budget_tier in ('budget', 'mid', 'premium')),
  experience_level text check (experience_level is null or experience_level in ('beginner', 'intermediate', 'advanced')),
  risk_tolerance int check (risk_tolerance is null or risk_tolerance between 1 and 5),
  timeframe text check (timeframe is null or timeframe in ('short', 'medium', 'long')),
  stacking_preference text check (stacking_preference is null or stacking_preference in ('single', 'basic_stack', 'advanced_stack')),
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  priority int not null default 5,
  is_active boolean not null default true
);

alter table public.recommendation_rules enable row level security;

-- Rules are only readable via service role (admin)
-- No public policy needed

-- ============================================
-- PLANS
-- ============================================
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My Plan',
  quiz_snapshot jsonb,
  recommended_peptides jsonb,
  total_cost_estimate numeric(10,2),
  timeline_weeks int,
  is_saved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Users can view own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can create plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.plans for delete
  using (auth.uid() = user_id);

-- ============================================
-- STACKS
-- ============================================
create table public.stacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My Stack',
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stacks enable row level security;

create policy "Users can view own stacks"
  on public.stacks for select
  using (auth.uid() = user_id);

create policy "Public stacks are viewable"
  on public.stacks for select
  using (is_public = true);

create policy "Users can create stacks"
  on public.stacks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stacks"
  on public.stacks for update
  using (auth.uid() = user_id);

create policy "Users can delete own stacks"
  on public.stacks for delete
  using (auth.uid() = user_id);

-- ============================================
-- STACK_ITEMS
-- ============================================
create table public.stack_items (
  id uuid primary key default gen_random_uuid(),
  stack_id uuid not null references public.stacks(id) on delete cascade,
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  vendor_id uuid references public.vendors(id),
  quantity int not null default 1,
  sort_order int not null default 0,
  unique (stack_id, peptide_id)
);

alter table public.stack_items enable row level security;

create policy "Users can view own stack items"
  on public.stack_items for select
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_items.stack_id
      and (stacks.user_id = auth.uid() or stacks.is_public = true)
    )
  );

create policy "Users can manage own stack items"
  on public.stack_items for insert
  with check (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_items.stack_id
      and stacks.user_id = auth.uid()
    )
  );

create policy "Users can update own stack items"
  on public.stack_items for update
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_items.stack_id
      and stacks.user_id = auth.uid()
    )
  );

create policy "Users can delete own stack items"
  on public.stack_items for delete
  using (
    exists (
      select 1 from public.stacks
      where stacks.id = stack_items.stack_id
      and stacks.user_id = auth.uid()
    )
  );

-- ============================================
-- COMPATIBILITY_RULES
-- ============================================
create table public.compatibility_rules (
  id uuid primary key default gen_random_uuid(),
  peptide_a_id uuid not null references public.peptides(id) on delete cascade,
  peptide_b_id uuid not null references public.peptides(id) on delete cascade,
  compatibility text not null check (compatibility in ('synergy', 'caution', 'conflict')),
  note text
);

alter table public.compatibility_rules enable row level security;

create policy "Compatibility rules are publicly readable"
  on public.compatibility_rules for select
  using (true);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ============================================
-- AFFILIATE_EVENTS
-- ============================================
create table public.affiliate_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  peptide_id uuid references public.peptides(id),
  vendor_id uuid references public.vendors(id),
  source_page text not null,
  source_plan_id uuid references public.plans(id),
  clicked_at timestamptz not null default now(),
  ip_hash text
);

alter table public.affiliate_events enable row level security;

create policy "Anyone can insert affiliate events"
  on public.affiliate_events for insert
  with check (true);

create policy "Users can view own affiliate events"
  on public.affiliate_events for select
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
create index idx_peptides_slug on public.peptides(slug);
create index idx_peptides_status on public.peptides(status);
create index idx_peptides_category on public.peptides(category);
create index idx_vendors_slug on public.vendors(slug);
create index idx_vendors_status on public.vendors(status);
create index idx_vendor_peptides_vendor on public.vendor_peptides(vendor_id);
create index idx_vendor_peptides_peptide on public.vendor_peptides(peptide_id);
create index idx_plans_user on public.plans(user_id);
create index idx_stacks_user on public.stacks(user_id);
create index idx_stacks_share_slug on public.stacks(share_slug);
create index idx_affiliate_events_vendor on public.affiliate_events(vendor_id);
create index idx_affiliate_events_peptide on public.affiliate_events(peptide_id);
create index idx_affiliate_events_clicked on public.affiliate_events(clicked_at);
create index idx_recommendation_rules_goal on public.recommendation_rules(goal_id);
create index idx_recommendation_rules_active on public.recommendation_rules(is_active);
