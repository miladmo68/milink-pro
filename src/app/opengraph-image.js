import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt =
  "MILINK — Web Design, E-Commerce, SEO, UI/UX & Branding in Toronto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public", "Logo-Navy.png")
  );
  const logoData = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          background:
            "linear-gradient(135deg, #0a1322 0%, #0d1829 45%, #142441 100%)",
          padding: 80,
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Subtle grid texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(#0060FF0F 1px, transparent 1px), linear-gradient(90deg, #0060FF0F 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            display: "flex",
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 540,
            height: 540,
            background:
              "radial-gradient(circle, #0060FF47 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 480,
            height: 480,
            background:
              "radial-gradient(circle, #0060FF2E 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo (navy file, inverted to white for dark bg) */}
        <img
          src={logoData}
          width={380}
          height={206}
          style={{
            filter: "brightness(0) invert(1)",
            marginBottom: 12,
          }}
        />

        {/* Brand wordmark — MI white, LINK accent blue */}
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>MI</span>
          <span style={{ color: "#0060FF" }}>LINK</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.62)",
            letterSpacing: "0.45em",
            marginTop: 28,
            textTransform: "uppercase",
          }}
        >
          Digital Agency
        </div>

        {/* Bottom accent line + url */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 2,
              background: "rgba(0,96,255,0.6)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.3em",
              display: "flex",
            }}
          >
            MILINK.CA
          </div>
          <div
            style={{
              width: 80,
              height: 2,
              background: "rgba(0,96,255,0.6)",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
