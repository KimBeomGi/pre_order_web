"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function Cart({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(false);
  const [myBasket, setMyBasket] = useState(null);
  const [memberBasket, setMemberBasket] = useState(null);
  const [recommendedPairings, setRecommendedPairings] = useState([
    {
      src: "/img/menu-order/menu_img_ex1.png",
      price: 16000,
      product_name: "로제쉬림프리조또",
      discount_rate: 0,
    },
    {
      src: "/img/menu-order/menu_img_ex2.png",
      price: 16000,
      product_name: "로제쉬림프리조또",
      discount_rate: 0.1,
    },
    {
      src: "/img/menu-order/menu_img_ex3.png",
      price: 16000,
      product_name: "로제쉬림프리조또",
      discount_rate: 0,
    },
    {
      src: "/img/menu-order/menu_img_ex4.png",
      price: 16000,
      product_name: "로제쉬림프리조또",
      discount_rate: 0,
    },
    {
      src: "/img/menu-order/menu_img_ex5.png",
      price: 16000,
      product_name: "로제쉬림프리조또",
      discount_rate: 0,
    },
  ]);
  // layout의 상단 장바구니 를 h1 태그로 변동
  return (
    <div className="w-full">
      {isEmpty ? (
        //장바구니가 비어있습니다.
        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center">
          <img
            className="w-[6.125em] object-contain"
            src="/img/menu-cart/empty_cart.png"
            alt=""
          />
          <h2 className="text-[#BABABA] text-[1.5625em] font-semibold my-[2em]">
            장바구니가 비어있습니다.
          </h2>
          <button
            className="bg-[#F0F0F0] font-semibold text-[1.25em] py-[0.625em] px-[2em] rounded-[0.375em]"
            onClick={() => {
              router.push(`/table/${resolvedParams.store}/menu/`);
            }}
          >
            + 더 담으러 가기
          </button>
        </div>
      ) : (
        <div>
          {/* // 내 메뉴 */}
          <div>
            <h2>내 메뉴</h2>
            {myBasket ? "" : ""}
          </div>
          {/* // 멤버 메뉴 */}
          <div>
            <h2>멤버 메뉴</h2>
            {memberBasket ? "" : ""}
            <div>
              <p>메뉴 추가 +</p>
            </div>
          </div>
          {/* // 광고 */}
          <div></div>
          {/* // 함께먹으면 더 좋아요 */}
          <div>
            <h2>함게 먹으면 더 좋아요!</h2>
            <ul className="grid grid-cols-3 gap-x-[0.625em] gap-y-[1.25em]">
              {recommendedPairings.map((recommend, key) => (
                <li
                  className="col-span-1 w-full aspect-[4/3]"
                  key={key}
                  onClick={() => {}}
                >
                  <div className="relative mb-[0.625em] w-full h-full rounded-[0.1875em] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={recommend.src}
                      alt=""
                    />
                    <div className="absolute right-[0.333333em] top-[0.333333em] text-[0.75em] w-[1.2em] h-[1.2em] bg-[#D9D9D9] flex justify-center items-center rounded-full">
                      <FaPlus className="text-[#FFFFFF]" />
                    </div>
                  </div>
                  <p className="text-[0.625em] font-semibold">
                    {recommend.product_name}
                  </p>
                  <p className="text-[0.75em] font-semibold">
                    {recommend.price * (1 - recommend.discount_rate)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {/* // 총 가격 및 갯수 */}
          <button
            className="text-[16px] fixed left-1/2 -translate-x-1/2 py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em]"
            onClick={() => {}}
          >
            <span className="text-[1.25em] bg-[#FFFFFF] font-semibold w-[1.5em] h-[1.5em] flex justify-center items-center rounded-[0.3em]">
              1
            </span>
            <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
              12,000원 장바구니 보기
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
