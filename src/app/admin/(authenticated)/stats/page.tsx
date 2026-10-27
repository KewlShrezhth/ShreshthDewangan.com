import AdminListEditor from "../_components/AdminListEditor";
import { getStats } from "@/lib/content";

export const instant = false;

export default async function AdminStatsPage() {
  const stats = await getStats();

  return (
    <AdminListEditor
      table="stats"
      title="Ticker stats"
      items={stats}
      fields={[
        { name: "label", label: 'Label (e.g. "BPA NATIONALS")' },
        { name: "value", label: 'Value (e.g. "15 / 65")' },
      ]}
    />
  );
}
