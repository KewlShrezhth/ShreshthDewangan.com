export type Award = {
  id: string;
  title: string;
  organization: string;
  year: string;
  description?: string;
  image?: string;
};

// Add awards here.
export const awards: Award[] = [
  {
    id: "award-one",
    title: "Award title",
    organization: "Organization name",
    year: "20XX",
    description: "Optional short description of the award.",
  },
];
