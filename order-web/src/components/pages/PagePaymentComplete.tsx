"use client";
import { FaCircleCheck } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";

import HeaderView from "../HeaderView";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PagePaymentComplete() {
  const router = useRouter();
  const params = useParams();
  const store = params?.store as string;
  const [receiptId,setReceiptId] = useState(1000)
  const [orderContent, setOrderContent] = useState([
    {
      name: "시그니처 치즈 쉬림프 세트",
      count: 1,
      price: 10000,
    },
    {
      name: "루꼴라 크로와상 샌드위치",
      count: 1,
      price: 28000,
    },
    {
      name: "햄치즈 통밀 샌드위치",
      count: 1,
      price: 12000,
    },
  ]);
  const [openRecords, setOpenRecords] = useState(false);

  return (
    <div className="bg-[#F2F4F6] min-h-screen pb-[2em]">
      <HeaderView leftType="menu" rightType="receipt" onMenuClick={() => {router.push(`/table/${store}/menu`)}} receiptId={receiptId}/>
      <h1 className="sr-only">결제 완료</h1>
      {/* 결제완료 표시 박스 */}
      <div className="flex flex-col items-center py-[2.5em]">
        <FaCircleCheck className="fill-[#24324D] text-[2.875em] mb-[1rem]" />
        <h2 className="font-bold text-[1.5625em] text-center leading-[1.2] mb-[1rem]">
          {orderContent
            .reduce((acc, cur) => acc + cur.count * cur.price, 0)
            .toLocaleString()}
          원
          <br />
          <strong className="font-bold text-[1.2em]">결제를 완료했어요</strong>
        </h2>
        <p className="text-[#5E6A76]">주문하신 메뉴를 준비하고 있어요</p>
      </div>
      {/* 주문내역 박스 */}
      <div className="relative bg-[#FFFFFF] rounded-[1em] w-[97.5%] py-[1em] px-[1.5em] mx-auto mb-[2em]">
        <div>
          <div className="flex justify-between mb-[0.75em]">
            <h2 className="text-[1.5em] font-bold">주문 내역</h2>
            <FaChevronDown
              className={`text-[1.5em] transition-all duration-100 ${openRecords ? "-rotate-180" : ""}`}
              onClick={() => {
                setOpenRecords(!openRecords);
              }}
            />
          </div>
          <p className="font-bold">
            {orderContent[0].name} 등{" "}
            {orderContent.reduce((acc, cur) => acc + cur.count, 0)}개
          </p>
          <p className="font-bold text-[1.875em]">
            {orderContent
              .reduce((acc, cur) => acc + cur.count * cur.price, 0)
              .toLocaleString()}
            원
          </p>
        </div>
        {/* 세부내용 */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            openRecords
              ? "grid-rows-[1fr] opacity-100 mt-[1.25em]"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="pt-[1.25em] border-t border-t-[#F3F3F3] space-y-[1em]">
              {orderContent.map((value, key) => {
                return (
                  <li className="" key={key}>
                    <h3 className="font-bold">
                      {value.name} × {value.count}
                    </h3>
                    <p className="text-[#6C7A88]">
                      {(value.price * value.count).toLocaleString()}원
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* 네이버 리뷰 이벤트 박스 */}
      <button
        className="relative py-[1em] px-[1.25em] w-[97.5%] mx-auto flex flex-row justify-center rounded-[0.625em] bg-[linear-gradient(90deg,#04E668_0%,#27D69B_100%)]"
        onClick={() => {
          router.push("https://m.place.naver.com/my/checkin");
        }}
      >
        <p className="font-bold text-[1.25em] text-[#FFFFFF]">
          네이버 리뷰 이벤트 참여하기
        </p>
        <p className="absolute right-[1.25em] font-bold text-[1.25em] text-[#FFFFFF]">→</p>
      </button>
      {/* <button
        className="mt-[2em] text-[16px] mx-auto py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[97.5%] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em]"
        onClick={() => {
          router.push(`/table/${store}/menu`)
        }}
      >
        <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
          추가 주문하기
        </span>
      </button> */}
    </div>
  );
}
