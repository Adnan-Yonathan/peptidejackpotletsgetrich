# Dynamic Data Schema Plan

This plan is optimized for the three main outputs that matter right now:

- custom protocol PDFs
- the protocol tracking SaaS
- blog posts and educational content

The earlier broad marketplace/SEO/vendor model is not the priority. The database should first become strong at generating structured protocol content, storing user protocol progress, and powering a blog CMS.

## Product Priorities

### 1. Protocol PDFs

The DB must support:

- protocol templates
- protocol versioning
- phase-based schedules
- structured dose events
- reusable PDF section layouts
- printable instructions, warnings, and checklists

### 2. Tracking SaaS

The DB must support:

- user protocol runs
- daily dose completion
- notes
- adherence history
- saved protocol snapshots

### 3. Blog Posts

The DB must support:

- blog posts
- section-based content
- authors
- tags
- related compounds/goals
- page-level SEO

## Existing DB

Already present in `supabase/migrations/00001_initial_schema.sql`:

- `profiles`
- `goals`
- `peptides`
- `peptide_goals`
- `vendors`
- `vendor_peptides`
- `recommendation_rules`
- `plans`
- `stacks`
- `stack_items`
- `compatibility_rules`
- `subscriptions`
- `affiliate_events`
- `waitlist_signups`

These remain useful, but they are not enough to support protocol PDFs and protocol tracking cleanly.

## Core Design Rules

- Store protocol data structurally, not just as prose.
- Keep editable template content separate from user-run snapshots.
- Use JSONB for snapshots and render payloads, not for every primary entity.
- Add `status`, `published_at`, `updated_at`, and `sort_order` where content is editorial.
- Keep vendor normalization light until protocol/content systems are stable.

## What Must Be Structured

For protocol generation, never rely only on strings like:

- `500 mcg daily`
- `2 capsules every morning`

Store both:

- `dose_value`
- `dose_unit`
- `frequency_type`
- `times_per_day`
- `phase_day`
- `route`
- `timing_label`
- `instruction_text`
- `missed_dose_text`

Plus:

- `dose_display`

That gives you both machine-usable logic and a clean printable string.

## Schema Focus

### A. Supporting Content Tables

These support protocols and blog content without trying to solve the whole marketplace first.

Tables:

- `administration_routes`
- `evidence_tiers`
- `media_assets`
- `media_asset_usages`
- `seo_pages`

Existing tables expanded:

- `goals`
- `peptides`

Add lightweight peptide detail:

- `peptide_aliases`
- `peptide_benefits`
- `peptide_cautions`
- `peptide_monitoring_items`

### B. Protocol Templates

This is the most important domain.

Tables:

- `protocol_pdf_templates`
- `protocol_templates`
- `protocol_template_versions`
- `protocol_phases`
- `protocol_phase_items`
- `protocol_dose_events`
- `protocol_instruction_blocks`
- `protocol_warning_blocks`
- `protocol_pdf_sections`

Purpose of each:

- `protocol_pdf_templates`: overall PDF layout and format definitions
- `protocol_templates`: user-facing protocol records
- `protocol_template_versions`: version control for protocol logic and content
- `protocol_phases`: ramp / active / taper / maintenance periods
- `protocol_phase_items`: protocol entries for compounds or support actions
- `protocol_dose_events`: specific structured dose records by phase/day
- `protocol_instruction_blocks`: reusable prep/timing/storage instructions
- `protocol_warning_blocks`: protocol-level warnings and caveats
- `protocol_pdf_sections`: configurable printable section blocks

### C. User Tracking SaaS

This is the second priority after template structure.

Tables:

- `protocol_saved_runs`
- `protocol_saved_run_items`
- `protocol_progress_events`
- `protocol_user_notes`

Purpose of each:

- `protocol_saved_runs`: one user’s live protocol instance
- `protocol_saved_run_items`: active items in that user’s run, with overrides
- `protocol_progress_events`: completion / skipped / missed dose events
- `protocol_user_notes`: freeform journaling attached to protocol runs

Key rule:

- `protocol_saved_runs.protocol_snapshot` should store the rendered protocol state at time of creation so historical runs stay stable even if templates change later.

### D. Blog CMS

This is the third priority.

Tables:

- `authors`
- `content_tags`
- `blog_posts`
- `blog_post_sections`
- `blog_post_tags`
- `blog_post_related_peptides`
- `blog_post_related_goals`

Purpose:

- section-based editing instead of one giant content field
- support richer layouts later without changing the table shape
- allow related content widgets and internal linking

## What Is Deliberately Deferred

These are not the first priority right now:

- full vendor product normalization
- affiliate attribution expansion
- vendor ranking systems
- broad programmatic SEO page families
- quiz/rule admin overhaul

They can come later once protocol and content systems are operating cleanly.

## Static File Mapping

### Immediate move targets

`src/data/peptides.ts`

- `peptides`
- `peptide_aliases`
- `peptide_benefits`
- `peptide_cautions`
- `peptide_monitoring_items`

`src/data/goals.ts`

- `goals`

`src/data/blog.ts`

- `blog_posts`
- `blog_post_sections`
- `seo_pages`

`src/data/guides.ts`

- can either become `blog_posts` with taxonomy separation, or a later `guides` table

### Not first migration targets

`src/data/vendors.ts`

- leave mostly static for now unless protocol PDFs need vendor content

`src/data/vendor-listings.ts`

- leave static for now

`src/data/affiliate-links.ts`

- leave static for now

## Migration Sequence

### `00003_dynamic_content_foundation.sql`

Scope:

- expand `goals`
- expand `peptides`
- add `administration_routes`
- add `evidence_tiers`
- add `media_assets`
- add `seo_pages`
- add all protocol template tables
- add all protocol tracking tables
- add blog CMS tables

### `00004_protocol_seed_and_import.sql`

Scope:

- import initial protocol templates
- backfill peptide metadata from `src/data/peptides.ts`
- seed route and evidence lookup data further if needed

### `00005_blog_seed_and_import.sql`

Scope:

- import authors
- import blog posts
- import section content
- attach related goals and peptides

### `00006_vendor_support.sql`

Scope:

- only add vendor/product support that is actually needed in protocols, plans, or outbound actions

### `00007_vendor_normalization.sql`

Scope:

- full vendor product normalization if and when the vendor system becomes a primary focus again

## App Build Order

1. Build protocol template loader from DB.
2. Build PDF payload generator from `protocol_*` tables.
3. Build saved-run creation and progress write paths.
4. Build protocol tracking UI from `protocol_saved_runs` and `protocol_progress_events`.
5. Move blog rendering to `blog_posts` and `blog_post_sections`.
6. Backfill peptide content from static TS.
7. Add admin CRUD for protocols and blog posts.

## Admin / CMS Requirements

The first admin surfaces should be:

- protocol templates
- protocol phases
- protocol dose events
- PDF sections
- blog posts
- blog post sections
- peptide metadata

If those screens do not exist, the DB will still be technically dynamic but operationally hard to use.

## Most Important Implementation Detail

There are two different layers of protocol data and they should not be mixed:

- template layer
- user run layer

Template layer:

- reusable
- editable
- versioned
- shared across users

User run layer:

- personalized
- snapshot-based
- tracks adherence
- must remain historically stable

That separation is the main thing that keeps PDFs, tracking, and future edits from breaking each other.

## Current Deliverables in Repo

This plan now matches:

- [supabase/migrations/00003_dynamic_content_foundation.sql](/abs/path/C:/Users/alemi/peptidejackpotletsgetrich/supabase/migrations/00003_dynamic_content_foundation.sql:1)

Next best step after this:

- write an import script for initial protocol/blog/peptide content
