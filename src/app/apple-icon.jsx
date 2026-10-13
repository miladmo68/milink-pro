import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "nodejs";

/** Apple touch icon matching the canonical crawler/browser icon. */
export default async function AppleIcon() {
  const file = await readFile(join(process.cwd(), "public", "logo-test.png"));
  const brandMark = file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  );

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#071325",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <img
        alt=""
        height="156"
        src={brandMark}
        style={{ objectFit: "contain" }}
        width="120"
      />
    </div>,
    size,
  );
}
