export type LinkKind =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "email"
  | "website";

export type LinkEntry = {
  id: string;
  kind: LinkKind;
  label: string;
  url: string;
};

// GitHub must stay first. Add more links below it.
export const links: LinkEntry[] = [
  {
    id: "github",
    kind: "github",
    label: "GitHub",
    url: "https://github.com/your-username",
  },
];
