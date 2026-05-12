import PageMenuList from "@/components/pages/PageMenuList";

export default function Menupage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  return (
    <div>
      <PageMenuList params={params} />
    </div>
  );
}
