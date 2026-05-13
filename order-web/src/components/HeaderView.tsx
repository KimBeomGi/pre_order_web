"use client";

import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function HeaderView() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // URL에서 store 이름을 가져옴. (부모에서 안 넘겨줘도 됨)
  const store = params.store ? decodeURIComponent(params.store as string) : "";
  
  // 현재 경로에 따른 제목 결정
  const getHeaderTitle = () => {
    if (pathname.includes("/cart")) return "장바구니";
    if (pathname.includes("/order/history")) return "주문 내역";
    if (pathname.includes("/order-in-progress")) return "주문 중";
    if (pathname.includes("/check-order")) return "주문하기";
    return null; // 제목이 없으면 주문 내역 아이콘 표시
  };

  const title = getHeaderTitle();

  return (
    <div>
      <div className="relative bg-[#FFFFFF] flex flex-row justify-between items-center pl-[1em] pr-[2em] pt-[1em] pb-[1.25em]">
        {/* 뒤로가기 버튼 */}
        {/* <Link href={`/table/${store}/menu`}>
        </Link> */}
        <IoChevronBack className="text-[2em]" onClick={() => {router.back()}}/>

        {/* 제목이 있으면 출력, 없으면 주문 내역 아이콘 출력 */}
        {title ? (
          <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-medium text-[1.25em]">
            {title}
          </h1>
        ) : (
          ""
        )}
        <div className="relative inline-block">
          <img className="w-[29px]" src="/img/order_details_icon.png" alt="" />
          <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 flex justify-center items-center w-[1.3333333em] h-[1.3333333em] bg-[#EF4444] text-[#FFFFFF] font-bold rounded-full">
            <p className="leading-1">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
