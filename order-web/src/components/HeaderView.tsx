"use client";

import Link from "next/link";
import { IoChevronBack, IoMenu } from "react-icons/io5";
import { useParams, usePathname, useRouter } from "next/navigation";

interface HeaderViewProps {
  title?: string;
  // 좌측 버튼 타입 (뒤로가기, 햄버거메뉴, 숨김)
  leftType?: "back" | "menu" | "none";
  // 우측 버튼 타입 (주문내역, 영수증, 숨김)
  rightType?: "order" | "receipt" | "none";
  // 이미지 4번처럼 좌측에 타이틀이 붙어야 하는 경우
  isTitleLeft?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void; // 햄버거 메뉴 클릭 핸들러
  receiptId?: number;
}

export default function HeaderView({
  title: propTitle,
  leftType = "back",
  rightType = "order",
  isTitleLeft = false,
  onBack,
  onMenuClick,
  receiptId
}: HeaderViewProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const store = params.store ? decodeURIComponent(params.store as string) : "";

  // 경로별 타이틀 매핑
  const TITLE_MAP: Record<string, string | null> = {
    "/cart": "장바구니",
    "/order/history": "주문 내역",
    "/order-in-progress": "주문 중",
    "/payment/check-order": "주문하기",
  };

  const getHeaderTitle = () => {
    if (propTitle) return propTitle;
    const matchedKey = Object.keys(TITLE_MAP).find((path) =>
      pathname.includes(path),
    );
    return matchedKey ? TITLE_MAP[matchedKey] : null;
  };

  const title = getHeaderTitle();

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F2F4F6]">
      <div className="relative flex flex-row justify-between items-center h-[60px] px-[1em]">
        {/* 좌측 */}
        <div className="flex items-center gap-2 min-w-[2.5em]">
          {leftType === "back" && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center active:opacity-50 transition-opacity"
              aria-label="뒤로가기"
            >
              <IoChevronBack className="text-[2em] text-[#24324D]" />
            </button>
          )}

          {leftType === "menu" && (
            <button
              onClick={onMenuClick}
              className="flex items-center justify-center active:opacity-50 transition-opacity"
              aria-label="메뉴"
            >
              <IoMenu className="text-[2em] text-[#8B95A1]" />{" "}
              <span className="ml-[0.375em] text-[#8B95A1] font-medium text-[1.375em]">메뉴판</span>
            </button>
          )}

          {/* 이미지 4번처럼 좌측 아이콘 바로 옆에 타이틀이 붙는 경우 */}
          {isTitleLeft && title && (
            <h1 className="font-bold text-[1.25em] text-[#8B95A1] whitespace-nowrap">
              {title}
            </h1>
          )}
        </div>

        {/* 중앙 */}
        {/* 좌측 정렬이 아닐 때만 중앙에 타이틀 표시 */}
        {!isTitleLeft && title && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-bold text-[1.25em] text-[#24324D] whitespace-nowrap">
              {title}
            </h1>
          </div>
        )}

        {/* 우측 */}
        <div className="min-w-[2.5em] flex justify-end items-center">
          {rightType === "order" && (
            <Link
              href={`/table/${store}/order/history`}
              className="relative inline-block active:opacity-50 transition-opacity"
            >
              <img
                className="w-[29px]"
                src="/img/order_details_icon.png"
                alt="주문내역"
              />
              <div className="absolute -right-1 -bottom-1 flex justify-center items-center w-[1.4em] h-[1.4em] bg-[#EF4444] text-[#FFFFFF] text-[10px] font-bold rounded-full border-[1.5px] border-white">
                <span className="leading-none">3</span>
              </div>
            </Link>
          )}

          {rightType === "receipt" && (
            <Link
              href={`/receipt/${receiptId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block active:opacity-50 transition-opacity"
            >
              <img
                className="w-[24px]"
                src="/img/receipt_icon.png"
                alt="영수증"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
