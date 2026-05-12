-- ============================================
-- Affiliate Links and Routing
-- ============================================

-- ============================================
-- Affiliate programs
-- ============================================

create table if not exists public.affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  program_name text not null,
  partner_domain text not null,
  default_tracking_template text,
  notes text,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vendor_id, partner_domain)
);

alter table public.affiliate_programs enable row level security;

create policy "Active affiliate programs are publicly readable"
  on public.affiliate_programs for select
  using (status = 'active');

create index if not exists idx_affiliate_programs_vendor on public.affiliate_programs(vendor_id);
create index if not exists idx_affiliate_programs_status on public.affiliate_programs(status);

-- ============================================
-- Affiliate links
-- ============================================

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  affiliate_program_id uuid not null references public.affiliate_programs(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  peptide_id uuid references public.peptides(id) on delete cascade,
  link_name text,
  destination_url text not null,
  link_type text not null default 'vendor_default' check (link_type in ('vendor_default', 'product_deep_link', 'campaign', 'landing_page')),
  shopper_region text,
  source_page text,
  route_context text,
  priority int not null default 100,
  is_default boolean not null default false,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'archived')),
  last_verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_links enable row level security;

create policy "Active affiliate links are publicly readable"
  on public.affiliate_links for select
  using (status = 'active');

create index if not exists idx_affiliate_links_vendor on public.affiliate_links(vendor_id);
create index if not exists idx_affiliate_links_peptide on public.affiliate_links(peptide_id);
create index if not exists idx_affiliate_links_region on public.affiliate_links(shopper_region);
create index if not exists idx_affiliate_links_source_page on public.affiliate_links(source_page);
create index if not exists idx_affiliate_links_priority on public.affiliate_links(priority);
create index if not exists idx_affiliate_links_status on public.affiliate_links(status);

-- ============================================
-- Affiliate link overrides
-- ============================================

create table if not exists public.affiliate_link_overrides (
  id uuid primary key default gen_random_uuid(),
  affiliate_program_id uuid not null references public.affiliate_programs(id) on delete cascade,
  base_affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  peptide_id uuid references public.peptides(id) on delete cascade,
  shopper_region text,
  source_page text,
  route_context text,
  override_url text not null,
  priority int not null default 10,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'archived')),
  last_verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_link_overrides enable row level security;

create policy "Active affiliate link overrides are publicly readable"
  on public.affiliate_link_overrides for select
  using (status = 'active');

create index if not exists idx_affiliate_link_overrides_vendor on public.affiliate_link_overrides(vendor_id);
create index if not exists idx_affiliate_link_overrides_peptide on public.affiliate_link_overrides(peptide_id);
create index if not exists idx_affiliate_link_overrides_region on public.affiliate_link_overrides(shopper_region);
create index if not exists idx_affiliate_link_overrides_source_page on public.affiliate_link_overrides(source_page);
create index if not exists idx_affiliate_link_overrides_priority on public.affiliate_link_overrides(priority);
create index if not exists idx_affiliate_link_overrides_status on public.affiliate_link_overrides(status);

-- ============================================
-- Affiliate event attribution expansion
-- ============================================

alter table public.affiliate_events
  add column if not exists affiliate_program_id uuid references public.affiliate_programs(id) on delete set null,
  add column if not exists affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  add column if not exists shopper_region text,
  add column if not exists route_context text,
  add column if not exists destination_url text;

create index if not exists idx_affiliate_events_program on public.affiliate_events(affiliate_program_id);
create index if not exists idx_affiliate_events_link on public.affiliate_events(affiliate_link_id);

-- ============================================
-- Seed affiliate programs
-- ============================================

insert into public.affiliate_programs (
  vendor_id,
  program_name,
  partner_domain,
  default_tracking_template,
  notes,
  status,
  published_at
)
select
  v.id,
  'Amino Club Affiliate Program',
  'aminoclub.com',
  'utm_source=affiliate_marketing&code=PEPTIDEPROS',
  'Base affiliate program for Amino Club. Supports vendor-level and peptide-level deep links.',
  'active',
  now()
from public.vendors v
where v.slug = 'amino-club'
on conflict (vendor_id, partner_domain) do nothing;

insert into public.affiliate_programs (
  vendor_id,
  program_name,
  partner_domain,
  default_tracking_template,
  notes,
  status,
  published_at
)
select
  v.id,
  'XL Peptides Affiliate Program',
  'xlpeptides.com',
  'aff=70',
  'Base affiliate program for XL Peptides. Supports vendor-level and peptide-level deep links.',
  'active',
  now()
from public.vendors v
where v.slug = 'xl-peptides'
on conflict (vendor_id, partner_domain) do nothing;

-- ============================================
-- Seed default affiliate links
-- ============================================

insert into public.affiliate_links (
  affiliate_program_id,
  vendor_id,
  link_name,
  destination_url,
  link_type,
  priority,
  is_default,
  status,
  last_verified_at,
  notes
)
select
  ap.id,
  v.id,
  'Amino Club Default Affiliate Link',
  'https://aminoclub.com?utm_source=affiliate_marketing&code=PEPTIDEPROS',
  'vendor_default',
  100,
  true,
  'active',
  now(),
  'Default vendor-level affiliate link.'
from public.affiliate_programs ap
join public.vendors v on v.id = ap.vendor_id
where v.slug = 'amino-club'
  and not exists (
    select 1 from public.affiliate_links al
    where al.affiliate_program_id = ap.id
      and al.vendor_id = v.id
      and al.peptide_id is null
      and al.is_default = true
  );

insert into public.affiliate_links (
  affiliate_program_id,
  vendor_id,
  link_name,
  destination_url,
  link_type,
  priority,
  is_default,
  status,
  last_verified_at,
  notes
)
select
  ap.id,
  v.id,
  'XL Peptides Default Affiliate Link',
  'https://xlpeptides.com/?aff=70',
  'vendor_default',
  100,
  true,
  'active',
  now(),
  'Default vendor-level affiliate link.'
from public.affiliate_programs ap
join public.vendors v on v.id = ap.vendor_id
where v.slug = 'xl-peptides'
  and not exists (
    select 1 from public.affiliate_links al
    where al.affiliate_program_id = ap.id
      and al.vendor_id = v.id
      and al.peptide_id is null
      and al.is_default = true
  );

-- ============================================
-- Seed peptide-level affiliate overrides
-- ============================================

insert into public.affiliate_link_overrides (
  affiliate_program_id,
  vendor_id,
  peptide_id,
  override_url,
  priority,
  status,
  last_verified_at,
  notes
)
select ap.id, v.id, p.id, seed.override_url, 10, 'active', now(), 'Peptide-specific affiliate deep link'
from (
  values
    ('amino-club', 'bpc-157', 'https://www.aminoclub.com/us/products/bpc-157?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'tb-500', 'https://www.aminoclub.com/us/products/tb-500?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'cjc-1295', 'https://www.aminoclub.com/us/products/cjc-ipa-no-dac?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'tesamorelin', 'https://www.aminoclub.com/us/products/tesamorlin?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'ipamorelin', 'https://www.aminoclub.com/us/products/ipamorelin?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'aod-9604', 'https://www.aminoclub.com/us/products/aod-9604?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'pt-141', 'https://www.aminoclub.com/us/products/pt-141?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'semax', 'https://www.aminoclub.com/us/products/semax?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'selank', 'https://www.aminoclub.com/us/products/selank?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'dsip', 'https://www.aminoclub.com/us/products/dsip?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'mots-c', 'https://www.aminoclub.com/us/products/mots-c?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'epitalon', 'https://www.aminoclub.com/us/products/epithalon?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'thymosin-alpha-1', 'https://www.aminoclub.com/us/products/thymosin-alpha-1?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'ghk-cu', 'https://www.aminoclub.com/us/products/ghk-cu?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'kpv', 'https://www.aminoclub.com/us/products/kpv?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'retatrutide', 'https://www.aminoclub.com/us/products/glp-3?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'igf-1-lr3', 'https://www.aminoclub.com/us/products/igf-1-lr3?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'melanotan-1', 'https://www.aminoclub.com/us/products/melanotan-i?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('amino-club', 'melanotan-2', 'https://www.aminoclub.com/us/products/melanotan-ii?utm_source=affiliate_marketing&code=PEPTIDEPROS'),
    ('xl-peptides', 'aod-9604', 'https://xlpeptides.com/product/aod-9604/?aff=70'),
    ('xl-peptides', 'bpc-157', 'https://xlpeptides.com/product/bpc-157-5mg/?aff=70'),
    ('xl-peptides', 'cjc-1295', 'https://xlpeptides.com/product/cjc-1295-5mg/?aff=70'),
    ('xl-peptides', 'dsip', 'https://xlpeptides.com/product/dsip/?aff=70'),
    ('xl-peptides', 'epitalon', 'https://xlpeptides.com/product/epitalon-10mg/?aff=70'),
    ('xl-peptides', 'foxo4-dri', 'https://xlpeptides.com/product/foxo4-dri/?aff=70'),
    ('xl-peptides', 'ghk-cu', 'https://xlpeptides.com/product/ghk-cu-50mg/?aff=70'),
    ('xl-peptides', 'ghrp-6', 'https://xlpeptides.com/product/ghrp-6-10mg/?aff=70'),
    ('xl-peptides', 'igf-1-lr3', 'https://xlpeptides.com/product/igf-1-lr3-1mg/?aff=70'),
    ('xl-peptides', 'ipamorelin', 'https://xlpeptides.com/product/ipamorelin/?aff=70'),
    ('xl-peptides', 'kpv', 'https://xlpeptides.com/product/kpv-10mg/?aff=70'),
    ('xl-peptides', 'mots-c', 'https://xlpeptides.com/product/mots-c-10mg/?aff=70'),
    ('xl-peptides', 'melanotan-1', 'https://xlpeptides.com/product/melanotan-1-10mg/?aff=70'),
    ('xl-peptides', 'melanotan-2', 'https://xlpeptides.com/product/melanotan-2-10mg/?aff=70'),
    ('xl-peptides', 'oxytocin', 'https://xlpeptides.com/product/oxytocin-2mg/?aff=70'),
    ('xl-peptides', 'pt-141', 'https://xlpeptides.com/product/pt-141-10mg/?aff=70'),
    ('xl-peptides', 'selank', 'https://xlpeptides.com/product/selank-10mg/?aff=70'),
    ('xl-peptides', 'semax', 'https://xlpeptides.com/product/semax-10mg/?aff=70'),
    ('xl-peptides', 'elamipretide', 'https://xlpeptides.com/product/ss-31-10mg/?aff=70'),
    ('xl-peptides', 'tb-500', 'https://xlpeptides.com/product/tb-500-5mg/?aff=70'),
    ('xl-peptides', 'tesamorelin', 'https://xlpeptides.com/product/tesamorelin-5mg/?aff=70')
) as seed(vendor_slug, peptide_slug, override_url)
join public.vendors v on v.slug = seed.vendor_slug
join public.peptides p on p.slug = seed.peptide_slug
join public.affiliate_programs ap on ap.vendor_id = v.id
where not exists (
  select 1
  from public.affiliate_link_overrides alo
  where alo.affiliate_program_id = ap.id
    and alo.vendor_id = v.id
    and alo.peptide_id = p.id
    and alo.override_url = seed.override_url
);

-- ============================================
-- Updated_at triggers
-- ============================================

drop trigger if exists set_updated_at_affiliate_programs on public.affiliate_programs;
create trigger set_updated_at_affiliate_programs
  before update on public.affiliate_programs
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_affiliate_links on public.affiliate_links;
create trigger set_updated_at_affiliate_links
  before update on public.affiliate_links
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_affiliate_link_overrides on public.affiliate_link_overrides;
create trigger set_updated_at_affiliate_link_overrides
  before update on public.affiliate_link_overrides
  for each row execute function public.set_updated_at();
