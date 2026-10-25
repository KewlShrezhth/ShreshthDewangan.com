import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shreshth Dewangan";

export default async function Image() {
  let fonts: { name: string; data: Buffer; style: "normal"; weight: 400 }[] = [];
  try {
    const data = await readFile(new URL("./fonts/Anton-Regular.ttf", import.meta.url));
    fonts = [{ name: "Anton", data, style: "normal", weight: 400 }];
  } catch {}
  const family = fonts.length ? "Anton" : "sans-serif";

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
          background: "#131210",
          fontFamily: family,
          fontWeight: fonts.length ? 400 : 700,
        }}
      >
        <div style={{ display: "flex", background: "#f0b429", padding: "20px 48px", color: "#131210", fontSize: 120, letterSpacing: 4 }}>
          SHRESHTH DEWANGAN
        </div>
        <div style={{ display: "flex", marginTop: 40, color: "#b8b4ac", fontSize: 32 }}>
          shreshthdewangan.com
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
