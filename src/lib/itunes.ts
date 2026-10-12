import { cacheLife } from "next/cache";

export type TrackLookup = { preview: string | null; cover: string | null; url: string | null };

export async function findTrack(title: string, artist: string): Promise<TrackLookup | null> {
  "use cache";
  cacheLife("days");

  try {
    const params = new URLSearchParams({ term: `${title} ${artist}`, entity: "song", limit: "1" });
    const res = await fetch(`https://itunes.apple.com/search?${params}`);
    if (!res.ok) return null;
    const t = (await res.json()).results?.[0];
    if (!t) return null;
    return {
      preview: t.previewUrl ?? null,
      cover: t.artworkUrl100?.replace("100x100bb", "600x600bb") ?? null,
      url: t.trackViewUrl ?? null,
    };
  } catch {
    return null;
  }
}
