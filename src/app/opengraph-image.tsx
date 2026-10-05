import { ImageResponse } from "next/og";

export const alt = "Roza Bakery — Votre gâteau, votre histoire.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fbf7f1",
          color: "#3a2520",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: 54, fontStyle: "italic" }}>Roza</span>
          <span style={{ fontSize: 18, letterSpacing: 10, textTransform: "uppercase" }}>Bakery</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 96, lineHeight: 1 }}>Votre gâteau,</span>
          <span style={{ fontSize: 96, lineHeight: 1.05, fontStyle: "italic", color: "#6a4f45" }}>votre histoire.</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#6a4f45" }}>
          <span>Pâtisserie artisanale</span>
          <span>·</span>
          <span>Gâteaux personnalisés</span>
          <span>·</span>
          <span>Cake design</span>
        </div>
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "#ebcfc8",
            opacity: 0.55,
          }}
        />
      </div>
    ),
    size,
  );
}
