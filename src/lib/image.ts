const BLOB = "https://z5bhpsarz1xapsvu.public.blob.vercel-storage.com/";

// Only blob uploads go through the optimizer; anything else (iTunes art, pasted links) renders as-is.
export const unopt = (src: string) => !src.startsWith(BLOB);
