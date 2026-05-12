import HeaderView from "@/components/HeaderView";

export default function StoreHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="text-[16px]">
      <HeaderView />
      {children}
    </section>
  );
}
