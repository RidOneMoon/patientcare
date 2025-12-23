export async function generateMetadata({ params }) {
  const { services_id } = await params;
  const title = services_id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `${title} | Care.xyz`,
    description: `Professional ${title} service.`
  };
}

export default function ServiceLayout({ children }) {
  return <>{children}</>;
}