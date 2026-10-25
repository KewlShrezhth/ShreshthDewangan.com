"use server";

import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }

  if (!Object.hasOwn(ALLOWED_TYPES, file.type)) {
    return { error: "Please choose a JPEG, PNG, WebP, GIF, or AVIF image." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image is too large (max 8MB)." };
  }

  const ext = ALLOWED_TYPES[file.type];
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  return { url: blob.url };
}
