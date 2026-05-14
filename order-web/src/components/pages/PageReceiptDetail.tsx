"use client";
import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { BsDownload } from "react-icons/bs";
import { getReceiptData } from "@/app/api/store";
import { ReceiptData } from "@/types/store";
import receiptDataSkeleton from "@/temp_data/receiptDataSkeleton.json";

import { toPng } from "html-to-image";

export default function PageReceiptDetail() {
  const params = useParams();
  const receiptId = params?.id;
  const receiptContentRef = useRef<HTMLDivElement>(null);
  const [orderContent, setOrderContent] =
    useState<ReceiptData>(receiptDataSkeleton);
  const [isHideOrderDetail, setIsHideOrderDetail] = useState(false);

  // 영수증 다운로드
  const receiptDownload = useCallback(() => {
    if (receiptContentRef.current === null) {
      return;
    }

    toPng(receiptContentRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
        toast.success("결제 영수증 다운로드");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [receiptContentRef]);

  // 영수증 데이터 받아오기
  async function handleGetReceiptData(id: number) {
    try {
      const data = await getReceiptData(id);
      setOrderContent(data);
      console.log(data);
    } catch (error) {
      toast.error("영수증 내역을 불러오는데 실패했습니다.");
    }
  }

  useEffect(() => {
    if (receiptId) {
      handleGetReceiptData(Number(receiptId));
    }
  }, [receiptId]);
  return (
    <div className="pt-[1.5em] min-h-screen">
      <h1 className="sr-only">결제 영수증</h1>
      {/* 헤더부분 주문내역 가리기 */}
      <div className="flex flex-row items-center justify-end gap-x-[0.5em] px-[1.5em]">
        <p
          className="cursor-pointer text-[1.25em] font-medium active:opacity-50 transition-opacity"
          onClick={() => {
            setIsHideOrderDetail(!isHideOrderDetail);
          }}
        >
          주문내역 가리기
        </p>
        <div
          className="cursor-pointer bg-[#E6E7EB] rounded-[0.25em] w-[1.5em] h-[1.5em] flex justify-center items-center active:opacity-50 transition-opacity"
          onClick={() => {
            receiptDownload();
          }}
        >
          <BsDownload className="inline-block text-[1em]" />
        </div>
      </div>
      {/* 주문내역 */}
      <div
        ref={receiptContentRef}
        className="recipt-content px-[1.5em] pt-[1.5em] pb-[2em] bg-[#FFFFFF]"
      >
        {/* 상단 간단 요약 */}
        <div className="mb-[1rem]">
          <h2 className="font-semibold text-[1.125rem] mb-[0.5em]">
            {orderContent.store_name}
          </h2>
          <p className="font-bold text-[1.375rem]">
            {orderContent.order_number}
          </p>
          <p className="font-bold text-[1.375rem]">
            {orderContent.summary.final_amount.toLocaleString()}원
          </p>
        </div>
        {/* 메뉴 정보 */}
        <table className="w-full text-[0.875rem] border-t-3 border-b border-[#222F4A]">
          <thead className="">
            <tr className="">
              <th className="py-[0.25em] text-left font-medium" scope="col">
                메뉴명
              </th>
              <th className="py-[0.25em] text-right font-medium" scope="col">
                단가
              </th>
              <th className="py-[0.25em] text-right font-medium" scope="col">
                수량
              </th>
              <th className="py-[0.25em] text-right font-medium" scope="col">
                금액
              </th>
            </tr>
          </thead>
          <tbody className="border-t border-b border-[#222F4A]">
            {orderContent.menus.map((menu, key) => {
              return (
                <Fragment key={key}>
                  <tr className="">
                    <th
                      className="py-[0.375em] text-left font-semibold"
                      scope="row"
                    >
                      {menu.product_name}
                    </th>
                    <td className="py-[0.375em] text-right">
                      {menu.price.toLocaleString()}
                    </td>
                    <td className="py-[0.375em] text-right">
                      {menu.count.toLocaleString()}
                    </td>
                    <td className="py-[0.375em] text-right">
                      {menu.item_total.toLocaleString()}
                    </td>
                  </tr>

                  {menu.options.length > 0 &&
                    menu.options.map((option, optionKey) => {
                      return (
                        <tr className="" key={optionKey}>
                          <th
                            className="text-left text-[#6C7A88] font-normal"
                            colSpan={4}
                          >
                            └ {option.name}
                            {option.price !== 0 &&
                              `(${option.price.toLocaleString()})`}
                          </th>
                          {/* <td className="text-right">{option.price}</td> */}
                        </tr>
                      );
                    })}
                  {menu.discounts.length > 0 &&
                    menu.discounts.map((discount, discountKey) => {
                      return (
                        <tr className="" key={discountKey}>
                          <th
                            className="text-left text-[#FF0000] font-normal"
                            colSpan={3}
                          >
                            {discount.content}
                          </th>
                          <td className="text-right font-normal text-[#FF0000]">
                            {(discount.amount * -1).toLocaleString()}
                          </td>
                          {/* <td className="text-right">{option.price}</td> */}
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}
          </tbody>
          {orderContent.summary.order_amount !==
          orderContent.summary.final_amount ? (
            <tfoot>
              <tr>
                <th
                  className="pt-[1rem] text-left font-normal text-[0.75rem]"
                  scope="row"
                  colSpan={3}
                >
                  주문금액
                </th>
                <td className="pt-[1rem] text-right text-[0.75rem]">
                  {orderContent.summary.order_amount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <th
                  className="text-left font-normal text-[0.75rem]"
                  scope="row"
                  colSpan={3}
                >
                  할인금액
                </th>
                <td className="text-right text-[0.75rem]">
                  {orderContent.summary.discount_amount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <th
                  className="py-[1rem] text-left font-semibold"
                  scope="row"
                  colSpan={3}
                >
                  결제금액
                </th>
                <td className="py-[1rem] text-right font-semibold">
                  {orderContent.summary.final_amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          ) : (
            <tfoot>
              <tr>
                <th
                  className="py-[1rem] text-left font-semibold"
                  scope="row"
                  colSpan={3}
                >
                  결제금액
                </th>
                <td className="text-right font-semibold">
                  {orderContent.summary.final_amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
        {/* 하단 가게 정보 */}
        <div className="border-b border-b-[#222F4A] py-[1em]">
          <table className="text-[0.875rem] w-full">
            <tbody className="">
              <tr>
                <th className="text-left font-normal text-[#6C7A88]">상호</th>
                <td className="text-right">
                  {orderContent.footer.company_name}
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-[#6C7A88]">대표</th>
                <td className="text-right">
                  {orderContent.footer.representative}
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-[#6C7A88]">
                  사업자등록번호
                </th>
                <td className="text-right">
                  {orderContent.footer.business_number}
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-[#6C7A88]">
                  대표번호
                </th>
                <td className="text-right">
                  {orderContent.footer.phone_number}
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-[#6C7A88]">주소</th>
                <td className="text-right">{orderContent.footer.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
