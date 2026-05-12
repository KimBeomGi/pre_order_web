'use client'
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function CartHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  return (
    <section className="text-[16px]">
      <div className="relative bg-[#FFFFFF] flex flex-row justify-between items-center pl-[1em] pr-[2em] pt-[1em] pb-[1.25em]">
        <IoChevronBack  className="text-[2em]" onClick={() => {router.back()}} />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-medium text-[1.25em]">장바구니</h1>   
      </div>

      {children}
    </section>
  );
}
