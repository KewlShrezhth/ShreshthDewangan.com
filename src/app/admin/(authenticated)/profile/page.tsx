import AdminListEditor from "../_components/AdminListEditor";
import SubmitButton from "../_components/SubmitButton";
import ImageUploadField from "../_components/ImageUploadField";
import { updateAbout, updateSiteSettings } from "../../actions";
import { getAbout, getEducation, getInterests, getSiteSettings } from "@/lib/content";

export const instant = false;

export default async function AdminProfilePage() {
  const [site, about, interests, education] = await Promise.all([
    getSiteSettings(),
    getAbout(),
    getInterests(),
    getEducation(),
  ]);

  const inputClass =
    "w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink mb-8">Profile</h1>

        <form action={updateSiteSettings} className="rounded-sm border border-line bg-surface p-5 shadow-soft">
          <h2 className="font-display text-lg uppercase tracking-tight text-ink mb-4">Site</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
                Name (shown in nav &amp; footer)
              </label>
              <input type="text" name="name" defaultValue={site.name} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
                Tagline (shown under your name on the hero)
              </label>
              <input type="text" name="tagline" defaultValue={site.tagline} className={inputClass} />
            </div>
          </div>
          <SubmitButton
            pendingLabel="Saving…"
            className="mt-4 rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift disabled:opacity-60"
          >
            Save
          </SubmitButton>
        </form>
      </div>

      <form action={updateAbout} className="rounded-sm border border-line bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg uppercase tracking-tight text-ink mb-4">About</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
              Name (shown big, on the hero block)
            </label>
            <input type="text" name="name" defaultValue={about.name} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
              Bio (leave a blank line between paragraphs)
            </label>
            <textarea
              name="intro"
              defaultValue={about.intro.join("\n\n")}
              rows={6}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
              Profile photo (optional)
            </label>
            <ImageUploadField name="profileImage" defaultValue={about.profileImage ?? ""} />
          </div>
        </div>
        <SubmitButton
          pendingLabel="Saving…"
          className="mt-4 rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift disabled:opacity-60"
        >
          Save
        </SubmitButton>
      </form>

      <AdminListEditor
        table="interests"
        title="Interests"
        items={interests}
        fields={[{ name: "label", label: "Interest" }]}
      />

      <AdminListEditor
        table="education"
        title="Education"
        items={education}
        fields={[
          { name: "school", label: "School" },
          { name: "detail", label: "Degree / program, years" },
        ]}
      />
    </div>
  );
}
