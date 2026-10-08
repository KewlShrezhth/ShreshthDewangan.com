import AdminListEditor from "../_components/AdminListEditor";
import { getMusic } from "@/lib/content";

export const instant = false;

export default async function AdminMusicPage() {
  const music = await getMusic();

  return (
    <AdminListEditor
      table="music"
      title="Music"
      items={music}
      fields={[
        { name: "title", label: "Title" },
        { name: "artist", label: "Artist" },
        { name: "artwork", label: "Artwork URL (optional)" },
        { name: "link", label: "Link (optional)" },
        { name: "note", label: "Personal note (optional)", type: "textarea" },
      ]}
    />
  );
}
