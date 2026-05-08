'use client'
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function storeHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  return (
    <section className="text-[16px]">
      <div className="bg-[#FFFFFF] flex flex-row justify-between items-center pl-[1em] pr-[2em] pt-[1em] pb-[1.25em]">
        <IoChevronBack  className="text-[2em]" onClick={() => {router.back()}} />
        <div
          className="relative inline-block"
        >
          <img className="w-[29px]" src="/img/order_details_icon.png" alt="" />
          <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2  flex justify-center items-center w-[1.3333333em] h-[1.3333333em] bg-[#EF4444] text-[#FFFFFF] font-bold rounded-full">
            <p className="leading-1">3</p>
          </div>
          {/* {orderDetails > 0 ? (
            <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2  flex justify-center items-center w-[1.3333333em] h-[1.3333333em] bg-[#EF4444] text-[#FFFFFF] font-bold rounded-full">
              <p className="leading-1">{orderDetails}</p>
            </div>
          ) : (
            ""
          )} */}
        </div>
      </div>

      {children}
    </section>
  );
}
