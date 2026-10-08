import AdminListEditor from "../_components/AdminListEditor";
import { getPhotos } from "@/lib/content";

export const instant = false;

export default async function AdminPhotosPage() {
  const photos = await getPhotos();

  return (
    <AdminListEditor
      table="photos"
      title="Photos"
      items={photos}
      fields={[
        { name: "src", label: "Image URL" },
        { name: "alt", label: "Alt text" },
        { name: "caption", label: "Caption (optional)" },
      ]}
    />
  );
}
