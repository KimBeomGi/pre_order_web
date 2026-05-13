"use client";
import { FaCircleCheck } from "react-icons/fa6";

import HeaderView from "../HeaderView";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PagePaymentComplete() {
  const [orderContent, setOrderContent] = useState([]);
  const router = useRouter();
  return (
    <div className="bg-[#F2F4F6] h-screen">
      <HeaderView />
      <h1 className="sr-only">결제 완료</h1>
      {/* 결제완료 표시 박스 */}
      <div className="flex flex-col items-center py-[2.5em]">
        <FaCircleCheck className="fill-[#24324D] text-[2.875em] mb-[1rem]" />
        <h2 className="font-bold text-[1.5625em] text-center leading-[1.2] mb-[1rem]">
          48,000원
          <br />
          <strong className="font-bold text-[1.2em]">결제를 완료했어요</strong>
        </h2>
        <p className="text-[#5E6A76]">주문하신 메뉴를 준비하고 있어요</p>
      </div>
      {/* 주문내역 박스 */}
      <div className="relative bg-[#FFFFFF] rounded-[1em] w-[97.5%] mx-auto">
        <h2 className="">주문 내역</h2>
        <p>시그니처 치즈 쉬림프 세트 외 3개</p>
        <p>48,000원</p>

        {/* box */}
        <div className="absolute w-[1em] h-[1em] top-0 right-0 border-2 border-black border-t-0 border-l-0 rotate-45"></div>
      </div>
      {/* 네이버 리뷰 이벤트 박스 */}
      <button
        className="py-[1em] px-[1.25em] w-[97.5%] mx-auto flex flex-row justify-between rounded-[0.625em] bg-[linear-gradient(90deg,#04E668_0%,#27D69B_100%)]"
        onClick={() => {
          router.push("https://m.place.naver.com/my/checkin");
        }}
      >
        <p className="font-bold text-[1.25em] text-[#FFFFFF]">
          네이버 리뷰 이벤트 참여하기
        </p>
        <p className="font-bold text-[1.25em] text-[#FFFFFF]">→</p>
      </button>
    </div>
  );
}
