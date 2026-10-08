export type Photo = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

// Add photos here — src should point to a file in /public/photos/.
export const photos: Photo[] = [];
