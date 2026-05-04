export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="max-w-[400px] mx-auto">{children}</section>;
}
