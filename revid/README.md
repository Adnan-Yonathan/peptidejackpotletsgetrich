# Revid Workspace

This folder is for repeatable AI influencer transformation video work.

## Folder Map

- `prompts/` - reusable prompt recipes and character notes.
- `payloads/` - Revid API JSON payload templates.
- `assets/reference-images/` - source/reference images that are safe to keep in git.
- `assets/generated-images/` - generated OpenAI/GPT Image outputs. Gitignored.
- `assets/generated-videos/` - generated source clips or Revid intermediate videos. Gitignored.
- `outputs/` - final downloaded/exported videos. Gitignored.
- `run-logs/` - JSON responses, render IDs, and experiment notes. Gitignored.

## Environment

Keep secrets in `.env.local`.

Expected variables:

```env
REVID_API_KEY=
OPENAI_API_KEY=
```

## Recommended Flow

1. Generate before/after character stills outside Revid.
2. Upload those images to public HTTPS URLs.
3. Create or reuse Revid consistent character IDs.
4. Render before and after shots separately.
5. Assemble the final transformation video with custom media and captions.

Revid requires public `http(s)` URLs for media references. Local files and base64 blobs should be uploaded before they are used in payloads.
