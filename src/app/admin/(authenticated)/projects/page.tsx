import AdminListEditor from "../_components/AdminListEditor";
import { getProjects } from "@/lib/content";

export const instant = false;

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminListEditor
      table="projects"
      title="Projects"
      items={projects}
      fields={[
        { name: "name", label: "Name" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "stack", label: "Stack (one per line)", type: "list" },
        { name: "images", label: "Image URLs (one per line)", type: "list" },
        { name: "github", label: "GitHub URL" },
        { name: "live", label: "Live URL" },
      ]}
    />
  );
}
