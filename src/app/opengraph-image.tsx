import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shreshth Dewangan";

export default async function Image() {
  let fonts: { name: string; data: Buffer; style: "normal"; weight: 700 }[] = [];
  try {
    // Cinzel Bold, SIL Open Font License (Google Fonts).
    const data = await readFile(new URL("./fonts/Cinzel-Bold.ttf", import.meta.url));
    fonts = [{ name: "Cinzel", data, style: "normal", weight: 700 }];
  } catch {}
  const family = fonts.length ? "Cinzel" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E241B",
          fontFamily: family,
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", border: "2px solid #C9A54A", borderRadius: 8, padding: "36px 64px", color: "#EDE6D3", fontSize: 76, whiteSpace: "nowrap" }}>
          Shreshth Dewangan
        </div>
        <div style={{ display: "flex", marginTop: 40, color: "#C9A54A", fontSize: 32 }}>
          shreshthdewangan.com
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
