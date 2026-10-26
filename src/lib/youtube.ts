import { cacheLife } from "next/cache";

export const CHANNEL_ID = "UCqVfF_Kmhy-6ry1jRjxofdg";
export const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;
export const SUBSCRIBE_URL = `${CHANNEL_URL}?sub_confirmation=1`;

export type Video = { id: string; title: string; publishedAt: string; thumb: string; isShort: boolean };
export type Channel = { title: string; avatar: string | null; videos: Video[] };

const API = "https://www.googleapis.com/youtube/v3";

function seconds(iso: string): number {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : Infinity;
}

async function get(path: string, params: Record<string, string>, key: string) {
  const res = await fetch(`${API}/${path}?${new URLSearchParams({ ...params, key })}`);
  if (!res.ok) throw new Error(`youtube ${path} ${res.status}`);
  return res.json();
}

type Item = {
  id: string;
  status?: { privacyStatus?: string };
  contentDetails: { duration: string };
  snippet: {
    title: string;
    description?: string;
    publishedAt: string;
    thumbnails: Record<string, { url: string }>;
  };
};

// Server-only: the key never reaches the client. Returns null on any failure so the page shows a plain link.
export async function getChannel(): Promise<Channel | null> {
  "use cache";
  cacheLife("hours");

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const ch = (await get("channels", { part: "snippet,contentDetails", id: CHANNEL_ID }, key)).items?.[0];
    if (!ch) return null;
    const uploads = ch.contentDetails?.relatedPlaylists?.uploads ?? "UU" + CHANNEL_ID.slice(2);
    const list = await get("playlistItems", { part: "contentDetails", playlistId: uploads, maxResults: "25" }, key);
    const ids = (list.items ?? []).map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId);
    if (ids.length === 0) return null;
    const vids = await get("videos", { part: "snippet,contentDetails,status", id: ids.join(",") }, key);

    const videos: Video[] = ((vids.items ?? []) as Item[])
      .filter((v) => v.status?.privacyStatus === "public")
      .map((v) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        thumb: (v.snippet.thumbnails.high ?? v.snippet.thumbnails.medium ?? v.snippet.thumbnails.default).url,
        isShort:
          seconds(v.contentDetails.duration) <= 180 || /#shorts/i.test(`${v.snippet.title} ${v.snippet.description}`),
      }))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, 12);

    return {
      title: ch.snippet.title,
      avatar: ch.snippet.thumbnails?.default?.url ?? null,
      videos,
    };
  } catch {
    cacheLife("minutes"); // a short outage should not hide the row for an hour
    return null;
  }
}
