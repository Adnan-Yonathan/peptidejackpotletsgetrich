import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "revid-media";

type UploadKey =
  | "beforeImage"
  | "afterImage"
  | "beforeMotionVideo"
  | "afterMotionVideo";

const uploadKeys: UploadKey[] = [
  "beforeImage",
  "afterImage",
  "beforeMotionVideo",
  "afterMotionVideo",
];

const fileLabels: Record<UploadKey, string> = {
  beforeImage: "before-image",
  afterImage: "after-image",
  beforeMotionVideo: "before-motion",
  afterMotionVideo: "after-motion",
};

const allowedMimePrefixes: Record<UploadKey, string> = {
  beforeImage: "image/",
  afterImage: "image/",
  beforeMotionVideo: "video/",
  afterMotionVideo: "video/",
};

export const runtime = "nodejs";

function getExtension(file: File) {
  const nameExtension = file.name.split(".").pop();

  if (nameExtension && /^[a-z0-9]+$/i.test(nameExtension)) {
    return nameExtension.toLowerCase();
  }

  const mimeExtension = file.type.split("/").pop();
  return mimeExtension && /^[a-z0-9]+$/i.test(mimeExtension)
    ? mimeExtension.toLowerCase()
    : "bin";
}

async function ensurePublicBucket() {
  const supabase = createAdminClient();
  const { data } = await supabase.storage.getBucket(BUCKET);

  if (!data) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  return supabase;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = await ensurePublicBucket();
    const batchId = `${Date.now()}`;
    const uploads: Record<UploadKey, { path: string; publicUrl: string }> =
      {} as Record<UploadKey, { path: string; publicUrl: string }>;

    for (const key of uploadKeys) {
      const value = formData.get(key);

      if (!(value instanceof File) || value.size === 0) {
        return NextResponse.json(
          { error: `Missing file: ${key}` },
          { status: 400 }
        );
      }

      if (!value.type.startsWith(allowedMimePrefixes[key])) {
        return NextResponse.json(
          { error: `Invalid file type for ${key}: ${value.type || "unknown"}` },
          { status: 400 }
        );
      }

      const extension = getExtension(value);
      const path = `revid/suzette/${batchId}/${fileLabels[key]}.${extension}`;
      const buffer = Buffer.from(await value.arrayBuffer());
      const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: value.type || "application/octet-stream",
        upsert: true,
      });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploads[key] = {
        path,
        publicUrl: data.publicUrl,
      };
    }

    return NextResponse.json({
      bucket: BUCKET,
      batchId,
      uploads,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
