import AdminListEditor from "../_components/AdminListEditor";
import { getAwards } from "@/lib/content";

export const instant = false;

export default async function AdminAwardsPage() {
  const awards = await getAwards();

  return (
    <AdminListEditor
      table="awards"
      title="Awards"
      items={awards}
      fields={[
        { name: "title", label: "Title" },
        { name: "organization", label: "Organization" },
        { name: "year", label: "Year" },
        { name: "description", label: "Description (optional)", type: "textarea" },
        { name: "image", label: "Image URL (optional)" },
      ]}
    />
  );
}
