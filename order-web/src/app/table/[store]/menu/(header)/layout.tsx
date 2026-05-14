import HeaderView from "@/components/HeaderView";

export default function StoreHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="text-[1rem]">
      <HeaderView />
      {children}
    </section>
  );
}
