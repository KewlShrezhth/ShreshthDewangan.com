export type MusicEntry = {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  link?: string;
  note?: string;
};

// Add albums/songs here.
export const music: MusicEntry[] = [
  {
    id: "music-one",
    title: "Song or album title",
    artist: "Artist name",
    note: "Optional personal note about why this one matters to you.",
  },
];
