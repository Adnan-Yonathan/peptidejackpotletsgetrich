import "server-only";

const REVID_API_BASE = "https://www.revid.ai/api/public/v3";

export type RevidClipKind = "before" | "after";

export type RevidClipUrls = {
  imageUrl: string;
  motionVideoUrl: string;
};

export type RevidBeforeAfterUrls = {
  before: RevidClipUrls;
  after: RevidClipUrls;
};

type RevidPayload = {
  workflow: "motion-transfer";
  source: {
    url: string;
  };
  media: {
    type: "moving-image";
    density: "medium";
    animation: "dynamic";
    imageModel: "good";
    videoModel: "pro";
    mediaPreset: "DEFAULT";
    useOnlyProvided: true;
    provided: Array<{
      url: string;
      title: string;
      type: "image";
    }>;
  };
  voice: {
    enabled: false;
  };
  captions: {
    enabled: false;
  };
  aspectRatio: "9 / 16";
};

export function buildMotionTransferPayload(
  kind: RevidClipKind,
  urls: RevidClipUrls
): RevidPayload {
  return {
    workflow: "motion-transfer",
    source: {
      url: urls.motionVideoUrl,
    },
    media: {
      type: "moving-image",
      density: "medium",
      animation: "dynamic",
      imageModel: "good",
      videoModel: "pro",
      mediaPreset: "DEFAULT",
      useOnlyProvided: true,
      provided: [
        {
          url: urls.imageUrl,
          title:
            kind === "before"
              ? "Suzette before transformation, full body spin"
              : "Suzette after transformation, happy spin and flex",
          type: "image",
        },
      ],
    },
    voice: {
      enabled: false,
    },
    captions: {
      enabled: false,
    },
    aspectRatio: "9 / 16",
  };
}

export function buildBeforeAfterPayloads(urls: RevidBeforeAfterUrls) {
  return {
    before: buildMotionTransferPayload("before", urls.before),
    after: buildMotionTransferPayload("after", urls.after),
  };
}

export function extractRevidPid(response: unknown): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const data = response as Record<string, unknown>;
  const candidates = [data.pid, data.projectId, data.id];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }
  }

  return null;
}

export async function callRevid(endpoint: string, init: RequestInit = {}) {
  const apiKey = process.env.REVID_API_KEY;

  if (!apiKey) {
    throw new Error("Missing REVID_API_KEY");
  }

  const headers = new Headers(init.headers);
  headers.set("key", apiKey);

  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${REVID_API_BASE}${endpoint}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Revid request failed with ${response.status}`;

    throw new Error(message);
  }

  return data;
}
