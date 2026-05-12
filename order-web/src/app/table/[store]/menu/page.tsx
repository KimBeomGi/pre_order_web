import PageMenuList from "@/components/pages/PageMenuList";
import { getStoreData } from "@/app/api/store";

export default async function Menupage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const storeData = await getStoreData();

  return (
    <div>
      <PageMenuList params={params} initialData={storeData} />
    </div>
  );
}
