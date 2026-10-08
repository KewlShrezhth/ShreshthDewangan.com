"use server";

import { put, del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Please choose a JPEG, PNG, WebP, GIF, or AVIF image." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image is too large (max 8MB)." };
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: blob.url };
}

export async function deleteUploadedImage(url: string) {
  await requireAdmin();
  if (!url.includes(".public.blob.vercel-storage.com/")) return;
  await del(url).catch(() => {});
}
