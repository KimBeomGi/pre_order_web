"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
export default function PageCheckOrder() {
  const router = useRouter();
  const params = useParams();
  const store = params?.store as string;
  const [dots, setDots] = useState("");
  const [loadingImages, setLoadingImages] = useState([
    "/img/order-in-progress/loading_cola.png",
    "/img/order-in-progress/loading_soda.png",
    "/img/order-in-progress/loading_spoon.png",
    "/img/order-in-progress/loading_fork.png",
    "/img/order-in-progress/loading_cola.png",
    "/img/order-in-progress/loading_soda.png",
    "/img/order-in-progress/loading_spoon.png",
    "/img/order-in-progress/loading_fork.png",
  ]);

  useEffect(() => {
    // 점(.) 애니메이션 인터벌
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // 실제 데이터 전송 로직 시뮬레이션
    const processOrder = async () => {
      try {
        // 현재는 서버 전송을 시뮬레이션하기 위해 4초 대기
        await new Promise((resolve) => setTimeout(resolve, 4000));

        // 전송 성공 시 완료 페이지로 이동
        if (store) {
          // 선결제 후결제에 따라 보내는 곳이 달라야함.
          // router.push(`/table/${store}/order/complete`);
          router.push(`/table/${store}/payment/complete`); // 우선 결제 완료로 보내기
        }
      } catch (error) {
        console.error("주문 전송 중 오류 발생:", error);
        // 전송 실패 시 실패 페이지로 이동
        if (store) {
          router.push(`/table/${store}/order/fail`);
        }
      }
    };

    processOrder();

    return () => {
      clearInterval(dotInterval);
    };
  }, [router, store]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      <div className="flex flex-col items-center gap-y-12 w-full">
        <h1 className="relative text-[1.75em] font-bold text-[#222F4A]">
          주문 넣는 중
          <span className="absolute left-full bottom-0 inline-block w-[1.5em] text-left">{dots}</span>
        </h1>

        {/* 무한 롤링 배너 구역 */}
        <div className="w-full overflow-hidden whitespace-nowrap py-6">
          <div className="flex w-max animate-marquee">
            {/* 첫 번째 세트 */}
            <ul className="flex items-center">
              {loadingImages.map((photo, key) => (
                <li className="w-[80px] h-[80px] shrink-0" key={`first-${key}`}>
                  <img className="w-full h-full object-contain" src={photo} alt="" />
                </li>
              ))}
            </ul>
            {/* 복제된 두 번째 세트 (끊김 없는 연결을 위함) */}
            <ul className="flex items-center">
              {loadingImages.map((photo, key) => (
                <li className="w-[80px] h-[80px] shrink-0" key={`second-${key}`}>
                  <img className="w-full h-full object-contain" src={photo} alt="" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
