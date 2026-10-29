// Web app manifest: lets clients add the MIlink workspace to their phone home screen.
export default function manifest() {
  return {
    name: "MIlink Client Portal",
    short_name: "MIlink",
    description: "Your MIlink website project: brief, files, messages, approvals and payment.",
    start_url: "/portal",
    scope: "/",
    display: "standalone",
    background_color: "#0a1120",
    theme_color: "#0a1120",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
