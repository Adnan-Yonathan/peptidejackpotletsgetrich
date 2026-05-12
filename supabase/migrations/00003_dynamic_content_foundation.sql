-- ============================================
-- Dynamic Content Foundation
-- Focus: Protocol PDFs, tracking SaaS, blog CMS
-- ============================================

create extension if not exists "pgcrypto";

-- ============================================
-- Updated_at helper
-- ============================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- Lookup tables
-- ============================================

create table if not exists public.administration_routes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.administration_routes enable row level security;
alter table public.evidence_tiers enable row level security;

create policy "Administration routes are publicly readable"
  on public.administration_routes for select
  using (true);

create policy "Evidence tiers are publicly readable"
  on public.evidence_tiers for select
  using (true);

insert into public.administration_routes (slug, label, description, sort_order)
values
  ('subcutaneous', 'Subcutaneous', 'Injected into subcutaneous tissue.', 1),
  ('intramuscular', 'Intramuscular', 'Injected intramuscularly.', 2),
  ('oral', 'Oral', 'Taken orally.', 3),
  ('intranasal', 'Intranasal', 'Delivered intranasally.', 4),
  ('topical', 'Topical', 'Applied topically.', 5),
  ('mixed', 'Mixed', 'Multiple routes are commonly encountered.', 6)
on conflict (slug) do nothing;

insert into public.evidence_tiers (slug, label, description, sort_order)
values
  ('tier-1', 'Tier 1', 'Strongest human evidence and/or approved-product context.', 1),
  ('tier-2', 'Tier 2', 'Moderate evidence with some human data or strong translational support.', 2),
  ('tier-3', 'Tier 3', 'Early evidence, mechanistic support, or sparse human data.', 3)
on conflict (slug) do nothing;

-- ============================================
-- Goal / peptide content expansion
-- ============================================

alter table public.goals
  add column if not exists slug text,
  add column if not exists short_label text,
  add column if not exists hero_title text,
  add column if not exists hero_description text,
  add column if not exists headline text,
  add column if not exists subheadline text,
  add column if not exists image_url text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.goals
set slug = lower(replace(name, '_', '-'))
where slug is null;

alter table public.goals
  alter column slug set not null;

create unique index if not exists idx_goals_slug on public.goals(slug);
create index if not exists idx_goals_status on public.goals(status);

alter table public.peptides
  add column if not exists subtitle text,
  add column if not exists hero_copy text,
  add column if not exists mechanism_summary text,
  add column if not exists evidence_tier_id uuid references public.evidence_tiers(id),
  add column if not exists administration_route_id uuid references public.administration_routes(id),
  add column if not exists image_url text,
  add column if not exists og_image_url text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists aliases text[] not null default '{}',
  add column if not exists featured boolean not null default false,
  add column if not exists sort_order int not null default 0,
  add column if not exists published_at timestamptz;

create index if not exists idx_peptides_evidence_tier on public.peptides(evidence_tier_id);
create index if not exists idx_peptides_featured on public.peptides(featured);

create table if not exists public.peptide_aliases (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  alias text not null,
  alias_type text not null default 'common',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (peptide_id, alias)
);

create table if not exists public.peptide_benefits (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.peptide_cautions (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  title text not null,
  description text,
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.peptide_monitoring_items (
  id uuid primary key default gen_random_uuid(),
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  label text not null,
  description text,
  importance text not null default 'recommended' check (importance in ('optional', 'recommended', 'important')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.peptide_aliases enable row level security;
alter table public.peptide_benefits enable row level security;
alter table public.peptide_cautions enable row level security;
alter table public.peptide_monitoring_items enable row level security;

create policy "Peptide aliases are publicly readable"
  on public.peptide_aliases for select
  using (true);

create policy "Peptide benefits are publicly readable"
  on public.peptide_benefits for select
  using (true);

create policy "Peptide cautions are publicly readable"
  on public.peptide_cautions for select
  using (true);

create policy "Peptide monitoring items are publicly readable"
  on public.peptide_monitoring_items for select
  using (true);

-- ============================================
-- Media assets
-- ============================================

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  public_url text,
  asset_type text not null check (asset_type in ('image', 'pdf', 'video', 'other')),
  title text,
  alt_text text,
  credit text,
  width int,
  height int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_asset_usages (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  usage_type text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (media_asset_id, entity_type, entity_id, usage_type)
);

alter table public.media_assets enable row level security;
alter table public.media_asset_usages enable row level security;

create policy "Media assets are publicly readable"
  on public.media_assets for select
  using (true);

create policy "Media asset usages are publicly readable"
  on public.media_asset_usages for select
  using (true);

-- ============================================
-- Protocol templates and PDF content
-- ============================================

create table if not exists public.protocol_pdf_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  page_size text not null default 'letter',
  orientation text not null default 'portrait' check (orientation in ('portrait', 'landscape')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.protocol_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  long_description text,
  headline text,
  subheadline text,
  goal_id uuid references public.goals(id),
  pdf_template_id uuid references public.protocol_pdf_templates(id),
  hero_image_url text,
  estimated_duration_days int,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.protocol_template_versions (
  id uuid primary key default gen_random_uuid(),
  protocol_template_id uuid not null references public.protocol_templates(id) on delete cascade,
  version_label text not null,
  change_summary text,
  is_current boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (protocol_template_id, version_label)
);

create table if not exists public.protocol_phases (
  id uuid primary key default gen_random_uuid(),
  protocol_template_version_id uuid not null references public.protocol_template_versions(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  start_day int not null,
  end_day int not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (protocol_template_version_id, slug)
);

create table if not exists public.protocol_phase_items (
  id uuid primary key default gen_random_uuid(),
  protocol_phase_id uuid not null references public.protocol_phases(id) on delete cascade,
  peptide_id uuid references public.peptides(id),
  item_role text not null default 'core' check (item_role in ('core', 'support', 'optional', 'warning')),
  title text,
  summary text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_dose_events (
  id uuid primary key default gen_random_uuid(),
  protocol_phase_item_id uuid not null references public.protocol_phase_items(id) on delete cascade,
  peptide_id uuid references public.peptides(id),
  phase_day int not null,
  dose_value numeric(10,3),
  dose_unit text,
  dose_display text,
  route text,
  frequency_type text not null default 'daily' check (frequency_type in ('once', 'daily', 'twice_daily', 'three_times_daily', 'weekly', 'custom')),
  times_per_day int,
  timing_label text,
  timing_notes text,
  instruction_text text,
  missed_dose_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_instruction_blocks (
  id uuid primary key default gen_random_uuid(),
  protocol_template_version_id uuid not null references public.protocol_template_versions(id) on delete cascade,
  block_type text not null check (block_type in ('prep', 'timing', 'storage', 'general', 'faq')),
  title text,
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_warning_blocks (
  id uuid primary key default gen_random_uuid(),
  protocol_template_version_id uuid not null references public.protocol_template_versions(id) on delete cascade,
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high')),
  title text not null,
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_pdf_sections (
  id uuid primary key default gen_random_uuid(),
  protocol_pdf_template_id uuid not null references public.protocol_pdf_templates(id) on delete cascade,
  section_key text not null,
  title text,
  body text,
  config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (protocol_pdf_template_id, section_key)
);

alter table public.protocol_pdf_templates enable row level security;
alter table public.protocol_templates enable row level security;
alter table public.protocol_template_versions enable row level security;
alter table public.protocol_phases enable row level security;
alter table public.protocol_phase_items enable row level security;
alter table public.protocol_dose_events enable row level security;
alter table public.protocol_instruction_blocks enable row level security;
alter table public.protocol_warning_blocks enable row level security;
alter table public.protocol_pdf_sections enable row level security;

create policy "Published protocol PDF templates are publicly readable"
  on public.protocol_pdf_templates for select
  using (status = 'published');

create policy "Published protocol templates are publicly readable"
  on public.protocol_templates for select
  using (status = 'published');

create policy "Published protocol template versions are publicly readable"
  on public.protocol_template_versions for select
  using (
    status = 'published'
    and exists (
      select 1 from public.protocol_templates
      where protocol_templates.id = protocol_template_versions.protocol_template_id
      and protocol_templates.status = 'published'
    )
  );

create policy "Protocol phases are publicly readable"
  on public.protocol_phases for select
  using (true);

create policy "Protocol phase items are publicly readable"
  on public.protocol_phase_items for select
  using (true);

create policy "Protocol dose events are publicly readable"
  on public.protocol_dose_events for select
  using (true);

create policy "Protocol instruction blocks are publicly readable"
  on public.protocol_instruction_blocks for select
  using (true);

create policy "Protocol warning blocks are publicly readable"
  on public.protocol_warning_blocks for select
  using (true);

create policy "Protocol PDF sections are publicly readable"
  on public.protocol_pdf_sections for select
  using (true);

create index if not exists idx_protocol_templates_goal on public.protocol_templates(goal_id);
create index if not exists idx_protocol_templates_status on public.protocol_templates(status);
create index if not exists idx_protocol_template_versions_current on public.protocol_template_versions(protocol_template_id, is_current);
create index if not exists idx_protocol_dose_events_item on public.protocol_dose_events(protocol_phase_item_id);

-- ============================================
-- User protocol tracking
-- ============================================

create table if not exists public.protocol_saved_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_plan_id uuid references public.plans(id),
  protocol_template_id uuid references public.protocol_templates(id),
  protocol_template_version_id uuid references public.protocol_template_versions(id),
  name text not null default 'My Protocol',
  protocol_snapshot jsonb not null default '{}'::jsonb,
  start_date date,
  timezone text,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.protocol_saved_run_items (
  id uuid primary key default gen_random_uuid(),
  protocol_saved_run_id uuid not null references public.protocol_saved_runs(id) on delete cascade,
  protocol_phase_item_id uuid references public.protocol_phase_items(id),
  peptide_id uuid references public.peptides(id),
  title text,
  item_role text,
  active boolean not null default true,
  overrides jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_progress_events (
  id uuid primary key default gen_random_uuid(),
  protocol_saved_run_id uuid not null references public.protocol_saved_runs(id) on delete cascade,
  protocol_dose_event_id uuid references public.protocol_dose_events(id),
  protocol_saved_run_item_id uuid references public.protocol_saved_run_items(id),
  scheduled_for timestamptz,
  completed_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped', 'missed')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.protocol_user_notes (
  id uuid primary key default gen_random_uuid(),
  protocol_saved_run_id uuid not null references public.protocol_saved_runs(id) on delete cascade,
  protocol_saved_run_item_id uuid references public.protocol_saved_run_items(id),
  note_date date,
  title text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.protocol_saved_runs enable row level security;
alter table public.protocol_saved_run_items enable row level security;
alter table public.protocol_progress_events enable row level security;
alter table public.protocol_user_notes enable row level security;

create policy "Users can view own protocol runs"
  on public.protocol_saved_runs for select
  using (auth.uid() = user_id);

create policy "Users can create own protocol runs"
  on public.protocol_saved_runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own protocol runs"
  on public.protocol_saved_runs for update
  using (auth.uid() = user_id);

create policy "Users can delete own protocol runs"
  on public.protocol_saved_runs for delete
  using (auth.uid() = user_id);

create policy "Users can view own protocol run items"
  on public.protocol_saved_run_items for select
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_saved_run_items.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can manage own protocol run items"
  on public.protocol_saved_run_items for insert
  with check (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_saved_run_items.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can update own protocol run items"
  on public.protocol_saved_run_items for update
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_saved_run_items.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can delete own protocol run items"
  on public.protocol_saved_run_items for delete
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_saved_run_items.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can view own protocol progress"
  on public.protocol_progress_events for select
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_progress_events.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can create own protocol progress"
  on public.protocol_progress_events for insert
  with check (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_progress_events.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can update own protocol progress"
  on public.protocol_progress_events for update
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_progress_events.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can view own protocol notes"
  on public.protocol_user_notes for select
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_user_notes.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can create own protocol notes"
  on public.protocol_user_notes for insert
  with check (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_user_notes.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can update own protocol notes"
  on public.protocol_user_notes for update
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_user_notes.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create policy "Users can delete own protocol notes"
  on public.protocol_user_notes for delete
  using (
    exists (
      select 1 from public.protocol_saved_runs
      where protocol_saved_runs.id = protocol_user_notes.protocol_saved_run_id
      and protocol_saved_runs.user_id = auth.uid()
    )
  );

create index if not exists idx_protocol_saved_runs_user on public.protocol_saved_runs(user_id);
create index if not exists idx_protocol_saved_runs_status on public.protocol_saved_runs(status);
create index if not exists idx_protocol_progress_events_run on public.protocol_progress_events(protocol_saved_run_id);
create index if not exists idx_protocol_progress_events_scheduled on public.protocol_progress_events(scheduled_for);

-- ============================================
-- Blog CMS
-- ============================================

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  hero_title text,
  hero_description text,
  cover_image_url text,
  author_id uuid references public.authors(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_post_sections (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  section_key text,
  section_type text not null default 'rich_text',
  title text,
  body text,
  data jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_post_tags (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.content_tags(id) on delete cascade,
  primary key (blog_post_id, tag_id)
);

create table if not exists public.blog_post_related_peptides (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  peptide_id uuid not null references public.peptides(id) on delete cascade,
  primary key (blog_post_id, peptide_id)
);

create table if not exists public.blog_post_related_goals (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  primary key (blog_post_id, goal_id)
);

create table if not exists public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  route_path text not null unique,
  title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image_url text,
  canonical_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  structured_data jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.authors enable row level security;
alter table public.content_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_sections enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.blog_post_related_peptides enable row level security;
alter table public.blog_post_related_goals enable row level security;
alter table public.seo_pages enable row level security;

create policy "Authors are publicly readable"
  on public.authors for select
  using (true);

create policy "Content tags are publicly readable"
  on public.content_tags for select
  using (true);

create policy "Published blog posts are publicly readable"
  on public.blog_posts for select
  using (status = 'published');

create policy "Published blog sections are publicly readable"
  on public.blog_post_sections for select
  using (
    exists (
      select 1 from public.blog_posts
      where blog_posts.id = blog_post_sections.blog_post_id
      and blog_posts.status = 'published'
    )
  );

create policy "Published blog tags are publicly readable"
  on public.blog_post_tags for select
  using (
    exists (
      select 1 from public.blog_posts
      where blog_posts.id = blog_post_tags.blog_post_id
      and blog_posts.status = 'published'
    )
  );

create policy "Published related peptides are publicly readable"
  on public.blog_post_related_peptides for select
  using (
    exists (
      select 1 from public.blog_posts
      where blog_posts.id = blog_post_related_peptides.blog_post_id
      and blog_posts.status = 'published'
    )
  );

create policy "Published related goals are publicly readable"
  on public.blog_post_related_goals for select
  using (
    exists (
      select 1 from public.blog_posts
      where blog_posts.id = blog_post_related_goals.blog_post_id
      and blog_posts.status = 'published'
    )
  );

create policy "Published SEO pages are publicly readable"
  on public.seo_pages for select
  using (status = 'published');

create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_author on public.blog_posts(author_id);
create index if not exists idx_blog_post_sections_post on public.blog_post_sections(blog_post_id);
create index if not exists idx_seo_pages_entity on public.seo_pages(entity_type, entity_id);

-- ============================================
-- Updated_at triggers
-- ============================================

drop trigger if exists set_updated_at_administration_routes on public.administration_routes;
create trigger set_updated_at_administration_routes
  before update on public.administration_routes
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_evidence_tiers on public.evidence_tiers;
create trigger set_updated_at_evidence_tiers
  before update on public.evidence_tiers
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_goals on public.goals;
create trigger set_updated_at_goals
  before update on public.goals
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_peptides on public.peptides;
create trigger set_updated_at_peptides
  before update on public.peptides
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_media_assets on public.media_assets;
create trigger set_updated_at_media_assets
  before update on public.media_assets
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_protocol_pdf_templates on public.protocol_pdf_templates;
create trigger set_updated_at_protocol_pdf_templates
  before update on public.protocol_pdf_templates
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_protocol_templates on public.protocol_templates;
create trigger set_updated_at_protocol_templates
  before update on public.protocol_templates
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_protocol_pdf_sections on public.protocol_pdf_sections;
create trigger set_updated_at_protocol_pdf_sections
  before update on public.protocol_pdf_sections
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_protocol_saved_runs on public.protocol_saved_runs;
create trigger set_updated_at_protocol_saved_runs
  before update on public.protocol_saved_runs
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_protocol_user_notes on public.protocol_user_notes;
create trigger set_updated_at_protocol_user_notes
  before update on public.protocol_user_notes
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_authors on public.authors;
create trigger set_updated_at_authors
  before update on public.authors
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_content_tags on public.content_tags;
create trigger set_updated_at_content_tags
  before update on public.content_tags
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_blog_posts on public.blog_posts;
create trigger set_updated_at_blog_posts
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_blog_post_sections on public.blog_post_sections;
create trigger set_updated_at_blog_post_sections
  before update on public.blog_post_sections
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_seo_pages on public.seo_pages;
create trigger set_updated_at_seo_pages
  before update on public.seo_pages
  for each row execute function public.set_updated_at();
