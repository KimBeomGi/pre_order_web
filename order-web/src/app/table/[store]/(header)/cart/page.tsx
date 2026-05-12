import PageCart from "@/components/pages/PageCart";

export default function Cart({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  return <PageCart params={params} />;
}
