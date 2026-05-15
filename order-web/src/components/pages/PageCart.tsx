"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import ModalWindow from "../ModalWindow";
import toast from "react-hot-toast";

export default function PageCart({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const [isPayModal, setIsPayModal] = useState(false);
  const [myBasket, setMyBasket] = useState([
    {
      product_name: "두바이쫀득마라탕후루두루치기",
      id: 2012,
      price: 20000,
      count: 1,
    },
    {
      product_name: "두리안구이",
      id: 2013,
      price: 30000,
      count: 1,
    },
    {
      product_name: "맥콜",
      id: 2014,
      price: 2000,
      count: 2,
    },
    {
      product_name: "애플비니거사이다",
      id: 2015,
      price: 2000,
      count: 2,
    },
  ]);
  const [memberBasket, setMemberBasket] = useState([
    {
      product_name: "바질 통밀 샌드위치",
      id: 2016,
      price: 12000,
      count: 1,
    },
    {
      product_name: "꽁치구이",
      id: 2017,
      price: 8000,
      count: 3,
    },
  ]);
  const [reviewProductId, setReviewProductId] = useState(100);

  const handleCountChange = (where: string, index: number, delta: number) => {
    if (where === "myBasket") {
      setMyBasket((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, count: Math.max(1, item.count + delta) }
            : item,
        ),
      );
    } else if (where === "memberBasket") {
      setMemberBasket((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, count: Math.max(1, item.count + delta) }
            : item,
        ),
      );
    }
  };

  const handleMyCountChange = (index: number, delta: number) => {
    setMyBasket((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, count: Math.max(1, item.count + delta) }
          : item,
      ),
    );
  };

  const handleMemberCountChange = (index: number, delta: number) => {
    setMemberBasket((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, count: Math.max(1, item.count + delta) }
          : item,
      ),
    );
  };

  const removeItem = (where: string, index: number) => {
    if (where === "myBasket") {
      setMyBasket((prev) => prev.filter((_, i) => i !== index));
    } else if (where === "memberBasket") {
      setMemberBasket((prev) => prev.filter((_, i) => i !== index));
    }
    toast.success("메뉴를 장바구니에서 제거했어요.");
  };

  const [recommendedPairings, setRecommendedPairings] = useState([
    {
      src: "/img/menu-order/menu_img_ex1.png",
      price: 16000,
      product_name: "김밥",
      discount_rate: 0,
      id: 200,
    },
    {
      src: "/img/menu-order/menu_img_ex2.png",
      price: 16000,
      product_name: "초밥",
      discount_rate: 0.1,
      id: 201,
    },
    {
      src: "/img/menu-order/menu_img_ex3.png",
      price: 16000,
      product_name: "주먹밥",
      discount_rate: 0,
      id: 202,
    },
    {
      src: "/img/menu-order/menu_img_ex4.png",
      price: 16000,
      product_name: "장어덮밥",
      discount_rate: 0,
      id: 203,
    },
    {
      src: "/img/menu-order/menu_img_ex5.png",
      price: 16000,
      product_name: "볶음밥",
      discount_rate: 0,
      id: 204,
    },
  ]);

  return (
    <div className="w-full mb-[5em]">
      {(myBasket.length <= 0 && memberBasket.length <= 0) ? (
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
              <ul>
                {myBasket.map((value, key) => (
                  <li
                    className="pb-[1.5em] mb-[1.5em] border-b-1 border-b-[#F3F3F3]"
                    key={key}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[1.25em] font-medium">
                          {value.product_name}
                        </h3>
                        <p className="text-[1.25em] font-medium ">
                          {value.price.toLocaleString()}원
                        </p>
                      </div>
                      <div
                        className="text-[1.25em] bg-[#D9D9D9] inline-block rounded-full p-[0.25em] cursor-pointer"
                        onClick={() => removeItem("myBasket", key)}
                      >
                        <IoClose className="text-[#FFFFFF]" />
                      </div>
                    </div>
                    <div className="flex justify-end items-stretch gap-x-[0.5em]">
                      <button
                        className="font-semibold text-[1.125em] bg-[#F2F3F6] rounded-[0.75em] px-[0.8em]"
                        onClick={() => {
                          router.push(
                            `/table/${resolvedParams.store}/menu/${value.id}`,
                          );
                        }}
                      >
                        옵션변경
                      </button>
                      <div className="text-[14px] flex items-center bg-[#F2F3F6] rounded-[0.75em] py-[0.3125em]">
                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em] ${value.count <= 1 ? "invisible" : ""}`}
                          onClick={() => handleCountChange("myBasket", key, -1)}
                        >
                          <span className={`mb-1 `}>−</span>
                        </button>

                        <div className="bg-[#FFFFFF] h-[3em] w-[3em] rounded-[0.5em] shadow-sm shadow-[0_0.125em_0.25em_rgba(0,0,0,0.25)] min-w-[2.5em] flex items-center justify-center">
                          <span className="text-[1.25em] font-semibold text-[#2D3436]">
                            {value.count}
                          </span>
                        </div>

                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em]`}
                          onClick={() => handleCountChange("myBasket", key, 1)}
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
                <p className="font-medium text-[1.25em] text-[#B4B4B4]">
                  담은 메뉴가 없어요
                </p>
              </div>
            )}
          </div>
          <hr className="h-[1em] bg-[#F2F3F6] border-0 mt-[1em] mb-[2em]" />
          <div className="px-[1.5em]">
            <h2 className="font-bold text-[1.25em] mb-[0.8em]">멤버 메뉴</h2>
            {memberBasket ? (
              <ul className="">
                {memberBasket.map((value, key) => (
                  <li
                    className="pb-[1.5em] mb-[1.5em] border-b-1 border-b-[#F3F3F3]"
                    key={key}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[1.25em] font-medium">
                          {value.product_name}
                        </h3>
                        <p className="text-[1.25em] font-medium ">
                          {value.price.toLocaleString()}원
                        </p>
                      </div>
                      <div
                        className="text-[1.25em] bg-[#D9D9D9] inline-block rounded-full p-[0.25em] cursor-pointer"
                        onClick={() => {
                          removeItem("memberBasket", key);
                        }}
                      >
                        <IoClose className="text-[#FFFFFF]" />
                      </div>
                    </div>
                    <div className="flex justify-end items-stretch gap-x-[0.5em]">
                      <button
                        className="font-semibold text-[1.125em] bg-[#F2F3F6] rounded-[0.75em] px-[0.8em]"
                        onClick={() => {
                          router.push(
                            `/table/${resolvedParams.store}/menu/${value.id}`,
                          );
                        }}
                      >
                        옵션변경
                      </button>
                      <div className="text-[14px] flex items-center bg-[#F2F3F6] rounded-[0.75em] py-[0.3125em]">
                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em] ${value.count <= 1 ? "invisible" : ""}`}
                          onClick={() =>
                            handleCountChange("memberBasket", key, -1)
                          }
                        >
                          <span className={`mb-1 `}>−</span>
                        </button>

                        <div className="bg-[#FFFFFF] h-[3em] w-[3em] rounded-[0.5em] shadow-sm shadow-[0_0.125em_0.25em_rgba(0,0,0,0.25)] min-w-[2.5em] flex items-center justify-center">
                          <span className="text-[1.25em] font-semibold text-[#2D3436]">
                            {value.count}
                          </span>
                        </div>

                        <button
                          className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em]`}
                          onClick={() =>
                            handleCountChange("memberBasket", key, 1)
                          }
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
            <div className="text-center my-[1.375em]">
              <Link
                className="font-semibold text-[1.125em] text-[1.22222em]"
                href={`/table/${resolvedParams.store}/menu`}
              >
                메뉴 추가 +
              </Link>
            </div>
          </div>
          <hr className="h-[1em] bg-[#F2F3F6] border-0 mt-[1em] mb-[2em]" />
          {/* 네이버 영수증 리뷰 유도? */}
          <div className="flex justify-between items-center px-[1.5em] mb-[3em]">
            <Image
              className="w-[35px] object-contain"
              src="/img/menu-cart/review_guide_ex.png"
              width={100}
              height={100}
              alt=""
            />
            <p className="">
              네이버 영수증 리뷰 이벤트
              <br />
              <strong className="font-semibold">
                리뷰쓰고 이벤트 음료 1캔 받기
              </strong>
            </p>
            <Link
              className="bg-[#E9EEFF] font-semibold px-[1.25em] py-[0.5em] rounded-[0.5em]"
              // href="https://m.place.naver.com/my/checkin"
              href={`/table/${resolvedParams.store}/menu/${reviewProductId}`}
            >
              참여하기
            </Link>
          </div>
          <div className="w-[90%] mx-auto">
            <h2 className="text-[1.25em] font-semibold mb-[0.7em]">
              함께 먹으면 더 좋아요!
            </h2>
            <ul className="grid grid-cols-3 gap-x-[0.625em] gap-y-[1.25em]">
              {recommendedPairings.map((recommend, key) => (
                <li
                  className="col-span-1 w-full aspect-[4/3]"
                  key={key}
                  onClick={() => {
                    router.push(
                      `/table/${resolvedParams.store}/menu/${recommend.id}`,
                    );
                  }}
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
                  <p className="text-[0.75em] font-semibold">
                    {recommend.product_name}
                  </p>
                  <p className="text-[0.875em] font-semibold">
                    {(
                      recommend.price *
                      (1 - recommend.discount_rate)
                    ).toLocaleString()}
                    원
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="text-[16px] fixed left-1/2 -translate-x-1/2 py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em] active:opacity-80"
            onClick={() => {
              setIsPayModal(true);
            }}
          >
            <span className="text-[1.25em] bg-[#FFFFFF] font-semibold w-[1.5em] h-[1.5em] flex justify-center items-center rounded-[0.3em]">
              1
            </span>
            <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
              12,000원 주문하기
            </span>
          </button>
        </div>
      )}
      {isPayModal ? (
        <ModalWindow
          isOpen={isPayModal}
          onClose={() => setIsPayModal(false)}
          storeTitle=""
        >
          <OrderNotice
            store={resolvedParams.store}
            onClose={() => setIsPayModal(false)}
          />
        </ModalWindow>
      ) : (
        <></>
      )}
    </div>
  );
}

interface OrderNoticeProps {
  store: string;
  onClose: () => void;
}

export function OrderNotice({ store, onClose }: OrderNoticeProps) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-[1.25em] font-bold">이대로 주문할까요?</h2>
      <p className="py-[1em]">
        함께 주문하는 분이 있으시다면, 함께 주문을 넣어주세요.
      </p>
      <div className="flex flex-row justify-between gap-x-[1em]">
        <button
          className="w-full font-medium border border-[#171717] rounded-[0.25em] py-[0.5em] text-[#171717] bg-[#FFFFFF] active:opacity-80"
          onClick={() => {
            onClose();
          }}
        >
          닫기
        </button>
        <button
          className="w-full font-medium border-0 rounded-[0.25em] py-[0.5em] text-[#FFFFFF] bg-[#222F4A] active:opacity-80"
          onClick={() => {
            // router.push(`/table/${store}/order-in-progress`); // 후결제
            router.push(`/table/${store}/payment/check-order`); // 선결제
          }}
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
