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
  const receiptDownload = useCallback(async () => {
    if (receiptContentRef.current === null) return;

    const loadingToast = toast.loading("영수증을 생성 중입니다...");

    try {
      const options = {
        cacheBust: true,
        backgroundColor: "#FFFFFF",
        pixelRatio: 2, // 고해상도 모바일 기기에서의 메모리 부족 방지
      };

      // 첫 번째 호출이 무시되는 현상 방지
      await toPng(receiptContentRef.current, options);
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 실제 데이터 생성
      const dataUrl = await toPng(receiptContentRef.current, options);

      // 다운로드 실행
      const link = document.createElement("a");
      link.download = `결제_영수증_${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss(loadingToast);
      toast.success("결제 영수증 다운로드 완료");
    } catch (err) {
      console.error("Download Error:", err);
      toast.dismiss(loadingToast);
      toast.error("다운로드 중 오류가 발생했습니다.");
    }
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
        className="recipt-content px-[1.5em] pt-[1.5em] pb-[2em]"
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
          {!isHideOrderDetail && (
            <Fragment>
              <thead className="">
                <tr className="">
                  <th className="py-[0.25em] text-left font-medium" scope="col">
                    메뉴명
                  </th>
                  <th
                    className="py-[0.25em] text-right font-medium"
                    scope="col"
                  >
                    단가
                  </th>
                  <th
                    className="py-[0.25em] text-right font-medium"
                    scope="col"
                  >
                    수량
                  </th>
                  <th
                    className="py-[0.25em] text-right font-medium"
                    scope="col"
                  >
                    금액
                  </th>
                </tr>
              </thead>
              <tbody
                className="
                border-t border-b border-[#222F4A]
                [&>tr:first-child>th]:pt-[1em] [&>tr:first-child>td]:pt-[1em]
                [&>tr:last-child>th]:pb-[1em] [&>tr:last-child>td]:pb-[1em]"
              >
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
            </Fragment>
          )}
          {orderContent.summary.order_amount !==
          orderContent.summary.final_amount ? (
            <tfoot>
              <tr>
                <th
                  className="pt-[0.5rem] text-left font-normal text-[0.75rem]"
                  scope="row"
                  colSpan={3}
                >
                  주문금액
                </th>
                <td className="pt-[0.5rem] text-right text-[0.75rem]">
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
                  className="py-[0.5rem] text-left font-semibold"
                  scope="row"
                  colSpan={3}
                >
                  결제금액
                </th>
                <td className="py-[0.5rem] text-right font-semibold">
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
