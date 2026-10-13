import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const runtime = "nodejs";

/**
 * File-based metadata route for browser tabs, crawlers, and Google Search.
 * Keep the mark centered on a solid surface so the transparent source asset
 * stays legible at favicon sizes.
 */
export default async function Icon() {
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
        height="430"
        src={brandMark}
        style={{ objectFit: "contain" }}
        width="330"
      />
    </div>,
    size,
  );
}
