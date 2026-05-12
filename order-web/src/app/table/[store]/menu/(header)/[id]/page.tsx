import PageMenuDetail from "@/components/pages/PageMenuDetail";

export default function Menu({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  return <PageMenuDetail params={params} />;
}
