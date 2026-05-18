import StompProvider from "@/components/layouts/StompProvider";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[400px] mx-auto relative">
      <StompProvider>{children}</StompProvider>
    </section>
  );
}
