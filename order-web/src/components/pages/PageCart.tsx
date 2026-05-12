"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function PageCart({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(false);
  const [myBasket, setMyBasket] = useState(null);
  const [memberBasket, setMemberBasket] = useState([
    {
      product_name: "바질 통밀 샌드위치",
      price: 12000,
      count: 1,
    },
  ]);
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

  return (
    <div className="w-full">
      {isEmpty ? (
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
          <div className="px-[1.5em]">
            <h2 className="font-bold text-[1.25em] mb-[0.8em]">내 메뉴</h2>
            {myBasket ? (
              ""
            ) : (
              <div>
                <p className="font-medium text-[#B4B4B4]">담은 메뉴가 없어요</p>
              </div>
            )}
          </div>
          <hr className="h-[1em] bg-[#F2F3F6] border-0 mt-[1em] mb-[2em]" />
          <div className="px-[1.5em]">
            <h2 className="font-bold text-[1.25em] mb-[0.8em]">멤버 메뉴</h2>
            {memberBasket ? (
              <ul className="">
                {memberBasket.map((value, key) => (
                  <li className="pb-[1.5em] mb-[1.5em] border-b-1 border-b-[#F3F3F3]" key={key}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3>{value.product_name}</h3>
                        <p>{value.price}</p>
                      </div>
                      <div
                        className="text-[1.25em] bg-[#D9D9D9] inline-block rounded-full p-[0.25em]"
                        onClick={() => {
                          // 여기를 클릭하면 해당 메뉴는 삭제되어야 함.
                        }}
                      >
                        <IoClose className="text-[#FFFFFF]" />
                      </div>
                    </div>
                    <div className="flex justify-end items-stretch gap-x-[0.5em]">
                      <button className="font-semibold text-[1.125em] bg-[#F2F3F6] rounded-[0.75em] px-[0.8em]">옵션변경</button>
                      <div className="text-[14px] flex items-center bg-[#F2F3F6] rounded-[0.75em] py-[0.3125em]">
                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em]`}
                          onClick={() => {}}
                        >
                          <span className={`mb-1 `}>−</span>
                        </button>

                        <div className="bg-[#FFFFFF] h-[3em] w-[3em] rounded-[0.5em] shadow-sm shadow-[0_0.125em_0.25em_rgba(0,0,0,0.25)] min-w-[2.5em] flex items-center justify-center">
                          <span className="text-[1.25em] font-semibold text-[#2D3436]">
                          </span>
                        </div>

                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em]`}
                          onClick={() => {}}
                        >
                          <span>+</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="font-medium text-[#B4B4B4]">담은 메뉴가 없어요</p>
              </div>
            )}
            <div className="">
              <p className="text-center font-semibold text-[1.125em]">
                메뉴 추가 +
              </p>
            </div>
          </div>
          <div></div>
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
