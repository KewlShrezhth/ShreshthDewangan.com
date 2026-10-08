export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  images: string[];
  github?: string;
  live?: string;
};

// Add or edit projects here. Each entry is one project card.
export const projects: Project[] = [
  {
    id: "project-one",
    name: "Project Name",
    description:
      "One or two sentences describing what this project is and the problem it solves.",
    stack: ["Tech", "Stack", "Here"],
    images: [],
    github: undefined,
    live: undefined,
  },
];
