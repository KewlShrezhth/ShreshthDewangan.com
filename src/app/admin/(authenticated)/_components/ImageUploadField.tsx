"use client";

import { useRef, useState } from "react";
import { uploadImage } from "../../upload-actions";

export default function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    const result = await uploadImage(formData);

    if ("error" in result) {
      setStatus("error");
      setError(result.error);
      return;
    }

    setUrl(result.url);
    setStatus("idle");
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-start gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-20 w-20 rounded-sm border border-line object-cover shadow-soft"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-line text-[10px] uppercase tracking-wide text-ink-faint">
            No image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="rounded-sm border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-60"
          >
            {status === "uploading" ? "Uploading…" : url ? "Replace" : "Choose from library"}
          </button>
          {url && status !== "uploading" && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="text-xs uppercase tracking-wide text-ink-faint transition-colors hover:text-accent"
            >
              Remove
            </button>
          )}
          {error && <p className="text-xs text-accent max-w-[14rem]">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
