"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";

export const MEDIA_BUCKET = "media";
const FOLDER = "uploads";
/** Long edge after resizing. Big enough for a full-bleed hero on a 4K display. */
const MAX_EDGE = 2560;
const QUALITY = 0.86;

/**
 * Downscale and re-encode in the browser before uploading.
 *
 * A phone photo is 4–12 MB; the free Supabase tier has 1 GB of storage and
 * 5 GB of monthly egress. Re-encoding to WebP at 2560px brings a typical photo
 * to 300–700 KB, and next/image still generates the responsive sizes on
 * delivery. Transparent PNGs stay PNG so line-art keeps its alpha.
 */
async function prepare(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  const keepPng = file.type === "image/png";
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return { blob: file, ext: file.name.split(".").pop() ?? "jpg", type: file.type };

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, ext: "jpg", type: file.type };
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const type = keepPng ? "image/png" : "image/webp";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, keepPng ? undefined : QUALITY),
  );
  if (!blob) return { blob: file, ext: "jpg", type: file.type };
  return { blob, ext: keepPng ? "png" : "webp", type };
}

function safeName(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image"
  );
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file is not an image.");
  if (file.type === "image/svg+xml") throw new Error("SVG files cannot be uploaded here.");
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
    // Only Safari can read iPhone HEIC photos; elsewhere the resize step
    // cannot open them and the bucket would reject the raw file.
    throw new Error(
      "iPhone HEIC photos cannot be uploaded. Export it as JPEG first (or set the iPhone camera to “Most Compatible”).",
    );
  }

  const { blob, ext, type } = await prepare(file);
  const path = `${FOLDER}/${Date.now()}-${safeName(file.name)}.${ext}`;

  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type LibraryItem = { url: string; name: string; createdAt: string };

/** Most recent uploads first — for re-using an image instead of uploading twice. */
export async function listLibrary(): Promise<LibraryItem[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(FOLDER, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((f: { name: string }) => f.name && !f.name.startsWith("."))
    .map((f: { name: string; created_at?: string | null }) => ({
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(`${FOLDER}/${f.name}`).data.publicUrl,
      name: f.name,
      createdAt: f.created_at ?? "",
    }));
}
