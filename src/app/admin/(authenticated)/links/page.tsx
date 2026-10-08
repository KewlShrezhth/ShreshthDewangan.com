import AdminListEditor from "../_components/AdminListEditor";
import { getLinks } from "@/lib/content";

export const instant = false;

export default async function AdminLinksPage() {
  const links = await getLinks();

  return (
    <AdminListEditor
      table="links"
      title="Links"
      items={links}
      fields={[
        { name: "label", label: "Label" },
        { name: "url", label: "URL" },
        {
          name: "kind",
          label: "Icon",
          placeholder: "github, linkedin, twitter, instagram, email, or website",
        },
      ]}
    />
  );
}
