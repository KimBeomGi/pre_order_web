"use client";

import { getOrderHistory } from "@/app/api/store";
import HeaderView from "../HeaderView";
import { useEffect, useReducer, useState } from "react";
import orderHistoryDataSkeleton from "@/temp_data/orderHistoryDataSkeleton.json";
import { useRouter } from "next/navigation";
import { RootOrderData } from "@/types/store";

export default function PageOrderHistory() {
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState<RootOrderData>(
    orderHistoryDataSkeleton,
  );
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  async function handleGetOrderHistory() {
    try {
      const response = await getOrderHistory();
      setOrderHistory(response);
      handleTotal(response);
    } catch (error) {}
  }

  function handleTotal(data: RootOrderData) {
    let itemCount = 0;
    let amountCount = 0;
    data.history.forEach((order) => {
      const orderItemCount = order.menus.reduce(
        (acc, curr) => acc + curr.count,
        0,
      );
      const orderAmountCount = order.menus.reduce(
        (acc, curr) => acc + curr.item_total,
        0,
      );
      itemCount += orderItemCount;
      amountCount += orderAmountCount;
    });
    setTotalCount(itemCount);
    setTotalAmount(amountCount);
  }

  useEffect(() => {
    handleGetOrderHistory();
  }, []);

  return (
    <div className="">
      <HeaderView rightType="none" />
      <div className="py-[2em]">
        <h2 className="px-[1rem] text-[1.875rem] font-bold">
          총 {totalCount}개 {totalAmount.toLocaleString()}원
        </h2>
        <ul className="mb-[2em]">
          {orderHistory.history.map((order, orderKey) => {
            const totalCount = order.menus.reduce(
              (acc, ord) => acc + ord.count,
              0,
            );
            const date = new Date(order.order_time);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const formattedTime = `${hours}:${minutes}`;

            return (
              <li
                className="px-[1rem] py-[1rem] border-b border-b-[#F3F3F3] last:border-b-0"
                key={orderKey}
              >
                <div className="flex flex-row justify-between items-center mb-[1em]">
                  <h3 className="text-[1.25rem] font-bold">
                    {orderKey === 0
                      ? `최근 주문 내역 (${totalCount.toLocaleString()}개)`
                      : `이전 주문 내역 (${totalCount.toLocaleString()}개)`}
                  </h3>
                  <p className="">{formattedTime}</p>
                </div>
                <ul className="space-y-[0.5em]">
                  {order.menus.map((menu, menuKey) => {
                    const options: string[] = [];
                    menu.options.forEach((option) => {
                      options.push(
                        `${option.name}(+${option.price.toLocaleString()}원)`,
                      );
                    });

                    return (
                      <li className="" key={menuKey}>
                        <h4 className="text-[1.125rem] font-semibold">
                          {menu.product_name} × {menu.count}
                        </h4>
                        {options.length > 0 && (
                          <p className="text-[0.875rem] text-[#6C7A88]">
                            {options.join(", ")}
                          </p>
                        )}
                        <p className="text-[#6C7A88]">
                          {menu.item_total.toLocaleString()}원
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        {/* <button
          className="text-[16px] mx-auto py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em]"
          onClick={() => {
            // router.push(``);
            router.push(`/order-in-progress`) ; //임시로 바로 결제 완료 했다치고 order-in-progress로 이동 
          }}
        >
          <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
            결제하기
          </span>
        </button> */}
      </div>
    </div>
  );
}
