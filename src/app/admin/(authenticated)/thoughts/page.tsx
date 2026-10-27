import AdminListEditor from "../_components/AdminListEditor";
import { getThoughts } from "@/lib/content";

export const instant = false;

export default async function AdminThoughtsPage() {
  const thoughts = await getThoughts();

  return (
    <AdminListEditor
      table="thoughts"
      title="Thoughts"
      items={thoughts}
      fields={[
        { name: "title", label: "Title" },
        { name: "date", label: 'Date (e.g. "Oct 2026")' },
        { name: "body", label: "Body (blank line between paragraphs)", type: "textarea" },
        { name: "link", label: "Link (optional)" },
      ]}
    />
  );
}
