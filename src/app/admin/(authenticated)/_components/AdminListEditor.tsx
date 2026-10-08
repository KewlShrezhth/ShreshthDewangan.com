import { createListItem, deleteListItem, updateListItem } from "../../actions";
import SubmitButton from "./SubmitButton";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "list";
  placeholder?: string;
};

function FieldInput({
  field,
  defaultValue,
}: {
  field: FieldConfig;
  defaultValue?: string;
}) {
  const className =
    "w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

  if (field.type === "textarea" || field.type === "list") {
    return (
      <textarea
        name={field.name}
        defaultValue={defaultValue}
        placeholder={field.placeholder}
        rows={field.type === "list" ? 3 : 4}
        className={className}
      />
    );
  }

  return (
    <input
      type="text"
      name={field.name}
      defaultValue={defaultValue}
      placeholder={field.placeholder}
      className={className}
    />
  );
}

function valueToDefault(value: unknown): string {
  if (Array.isArray(value)) return value.join("\n");
  return value == null ? "" : String(value);
}

export default function AdminListEditor<T extends { id: number }>({
  table,
  title,
  fields,
  items,
}: {
  table:
    | "projects"
    | "photos"
    | "awards"
    | "music"
    | "movies"
    | "links"
    | "interests"
    | "education";
  title: string;
  fields: FieldConfig[];
  items: T[];
}) {
  const create = createListItem.bind(null, table);

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-tight text-ink mb-8">{title}</h1>

      <div className="space-y-6">
        {items.map((item) => {
          const update = updateListItem.bind(null, table, item.id);
          const remove = deleteListItem.bind(null, table, item.id);
          return (
            <form
              key={item.id}
              action={update}
              className="rounded-sm border border-line bg-surface p-5 shadow-soft"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
                      {field.label}
                    </label>
                    <FieldInput
                      field={field}
                      defaultValue={valueToDefault((item as Record<string, unknown>)[field.name])}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <SubmitButton
                  pendingLabel="Saving…"
                  className="rounded-sm bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift disabled:opacity-60"
                >
                  Save
                </SubmitButton>
                <SubmitButton
                  formAction={remove}
                  pendingLabel="Deleting…"
                  savedLabel="Deleted"
                  className="rounded-sm border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-faint transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-60"
                >
                  Delete
                </SubmitButton>
              </div>
            </form>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg uppercase tracking-tight text-ink mb-4">
          Add new
        </h2>
        <form action={create} className="rounded-sm border border-line border-dashed bg-surface/50 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-xs uppercase tracking-wide text-ink-faint mb-1.5">
                  {field.label}
                </label>
                <FieldInput field={field} />
              </div>
            ))}
          </div>
          <SubmitButton
            pendingLabel="Adding…"
            savedLabel="Added"
            className="mt-4 rounded-sm bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift disabled:opacity-60"
          >
            Add
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
