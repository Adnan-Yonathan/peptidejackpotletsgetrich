"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type UploadKey =
  | "beforeImage"
  | "afterImage"
  | "beforeMotionVideo"
  | "afterMotionVideo";

type UploadedAsset = {
  path: string;
  publicUrl: string;
};

type UploadResponse = {
  bucket: string;
  batchId: string;
  uploads: Record<UploadKey, UploadedAsset>;
};

type RevidClipUrls = {
  imageUrl: string;
  motionVideoUrl: string;
};

type RevidUrls = {
  before: RevidClipUrls;
  after: RevidClipUrls;
};

type RenderClip = {
  pid: string | null;
  response: unknown;
};

type RenderResponse = {
  renders: {
    before: RenderClip;
    after: RenderClip;
  };
  payloads: unknown;
};

const initialFiles: Record<UploadKey, File | null> = {
  beforeImage: null,
  afterImage: null,
  beforeMotionVideo: null,
  afterMotionVideo: null,
};

async function readJsonResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : "Request failed";
    throw new Error(message);
  }

  return data;
}

function JsonBlock({ value }: { value: unknown }) {
  if (!value) {
    return null;
  }

  return (
    <Textarea
      readOnly
      value={JSON.stringify(value, null, 2)}
      className="min-h-48 font-mono text-xs"
    />
  );
}

function PublicLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function RevidBeforeAfterGenerator() {
  const [files, setFiles] = useState(initialFiles);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);
  const [estimate, setEstimate] = useState<unknown>(null);
  const [renderResult, setRenderResult] = useState<RenderResponse | null>(null);
  const [statuses, setStatuses] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const allFilesSelected = Object.values(files).every(Boolean);
  const urls = useMemo<RevidUrls | null>(() => {
    if (!uploaded) {
      return null;
    }

    return {
      before: {
        imageUrl: uploaded.uploads.beforeImage.publicUrl,
        motionVideoUrl: uploaded.uploads.beforeMotionVideo.publicUrl,
      },
      after: {
        imageUrl: uploaded.uploads.afterImage.publicUrl,
        motionVideoUrl: uploaded.uploads.afterMotionVideo.publicUrl,
      },
    };
  }, [uploaded]);

  const pids = useMemo(
    () =>
      [
        renderResult?.renders.before.pid,
        renderResult?.renders.after.pid,
      ].filter((pid): pid is string => Boolean(pid)),
    [renderResult]
  );

  function updateFile(key: UploadKey, file: File | null) {
    setFiles((current) => ({
      ...current,
      [key]: file,
    }));
  }

  async function runAction<T>(name: string, action: () => Promise<T>) {
    setError(null);
    setActiveAction(name);

    try {
      return await action();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Something failed"
      );
      return null;
    } finally {
      setActiveAction(null);
    }
  }

  async function uploadAssets() {
    await runAction("upload", async () => {
      const formData = new FormData();

      for (const [key, file] of Object.entries(files) as Array<
        [UploadKey, File | null]
      >) {
        if (file) {
          formData.append(key, file);
        }
      }

      const data = (await readJsonResponse(
        await fetch("/api/admin/revid/upload", {
          method: "POST",
          body: formData,
        })
      )) as UploadResponse;

      setUploaded(data);
      setEstimate(null);
      setRenderResult(null);
      setStatuses({});
    });
  }

  async function estimateCredits() {
    if (!urls) {
      setError("Upload assets before estimating credits.");
      return;
    }

    await runAction("estimate", async () => {
      const data = await readJsonResponse(
        await fetch("/api/admin/revid/estimate", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(urls),
        })
      );

      setEstimate(data);
    });
  }

  async function renderBeforeAfter() {
    if (!urls) {
      setError("Upload assets before rendering.");
      return;
    }

    await runAction("render", async () => {
      const data = (await readJsonResponse(
        await fetch("/api/admin/revid/render", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(urls),
        })
      )) as RenderResponse;

      setRenderResult(data);
      setStatuses({});
    });
  }

  async function checkStatus() {
    if (!pids.length) {
      setError("Render first so there are project IDs to check.");
      return;
    }

    await runAction("status", async () => {
      const results = await Promise.all(
        pids.map(async (pid) => {
          const data = await readJsonResponse(
            await fetch(`/api/admin/revid/status?pid=${encodeURIComponent(pid)}`)
          );
          return [pid, data] as const;
        })
      );

      setStatuses(Object.fromEntries(results));
    });
  }

  const isBusy = Boolean(activeAction);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Before/After Motion Transfer</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Suzette default: before image is suzette_fat, after image is
                suzette_skinny. Each motion driver should be about 5 seconds,
                vertical 9:16, with full body visible.
              </p>
            </div>
            <Badge variant="secondary">Pro model: ~120 credits total</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="before-image">Before image</Label>
              <Input
                id="before-image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  updateFile("beforeImage", event.target.files?.[0] ?? null)
                }
              />
              <p className="text-xs text-muted-foreground">
                Use suzette_fat.png or another before reference.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="after-image">After image</Label>
              <Input
                id="after-image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  updateFile("afterImage", event.target.files?.[0] ?? null)
                }
              />
              <p className="text-xs text-muted-foreground">
                Use suzette_skinny.png or another after reference.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="before-motion">Before motion video</Label>
              <Input
                id="before-motion"
                type="file"
                accept="video/*"
                onChange={(event) =>
                  updateFile(
                    "beforeMotionVideo",
                    event.target.files?.[0] ?? null
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                One person, full-body slow 360 spin, neutral body language.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="after-motion">After motion video</Label>
              <Input
                id="after-motion"
                type="file"
                accept="video/*"
                onChange={(event) =>
                  updateFile(
                    "afterMotionVideo",
                    event.target.files?.[0] ?? null
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                One person, full-body slow spin, happy posture, ends with a
                light flex.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="font-medium">Motion driver rules</p>
            <p className="mt-1 text-muted-foreground">
              Avoid camera cuts, crowds, heavy motion blur, cropped feet/head,
              or fast dancing. Revid cloud only receives public Supabase URLs,
              not files from the local revid folder.
            </p>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={uploadAssets}
              disabled={!allFilesSelected || isBusy}
            >
              {activeAction === "upload" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload />
              )}
              Upload Assets
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={estimateCredits}
              disabled={!urls || isBusy}
            >
              {activeAction === "estimate" ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Estimate Credits
            </Button>
            <Button
              type="button"
              onClick={renderBeforeAfter}
              disabled={!urls || isBusy}
            >
              {activeAction === "render" ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Render Before/After
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={checkStatus}
              disabled={!pids.length || isBusy}
            >
              {activeAction === "status" ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploaded ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Uploaded to {uploaded.bucket}/{uploaded.batchId}
                </div>
                <div className="grid gap-2">
                  <PublicLink
                    label="Before image"
                    url={uploaded.uploads.beforeImage.publicUrl}
                  />
                  <PublicLink
                    label="After image"
                    url={uploaded.uploads.afterImage.publicUrl}
                  />
                  <PublicLink
                    label="Before motion"
                    url={uploaded.uploads.beforeMotionVideo.publicUrl}
                  />
                  <PublicLink
                    label="After motion"
                    url={uploaded.uploads.afterMotionVideo.publicUrl}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Upload assets to see the public Supabase URLs Revid will use.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Render Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderResult ? (
              <>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-medium">Before PID:</span>{" "}
                    {renderResult.renders.before.pid ?? "Not returned"}
                  </div>
                  <div>
                    <span className="font-medium">After PID:</span>{" "}
                    {renderResult.renders.after.pid ?? "Not returned"}
                  </div>
                </div>
                <JsonBlock value={statuses} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Render the clips to see project IDs and status responses.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonBlock value={estimate} />
          {!estimate ? (
            <p className="text-sm text-muted-foreground">
              Estimate credits after upload. Expected cost is around 60 credits
              per Pro motion-transfer clip.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
