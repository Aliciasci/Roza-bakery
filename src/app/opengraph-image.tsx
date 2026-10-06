import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Roza Bakery — Votre gâteau, votre histoire.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage (réseaux sociaux, messageries) avec le logo officiel. */
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "brand", "logo-roza.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 90px",
          background: "#fbf7f1",
          color: "#3a2520",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -140,
            top: -160,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "#ebcfc8",
            opacity: 0.45,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu ImageResponse */}
        <img src={logoSrc} width={420} height={420} alt="" style={{ flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 84, lineHeight: 1 }}>Votre gâteau,</span>
          <span style={{ fontSize: 84, lineHeight: 1.08, fontStyle: "italic", color: "#6a4f45" }}>votre histoire.</span>
          <span style={{ marginTop: 36, fontSize: 26, color: "#6a4f45" }}>Pâtisserie artisanale · Gâteaux sur mesure</span>
        </div>
      </div>
    ),
    size,
  );
}
