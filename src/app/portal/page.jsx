import ClientPortal from "./ClientPortal";

export const metadata = {
  title: "Client Portal",
  description: "Manage your MIlink website project, files, approvals and payments.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <ClientPortal />;
}
