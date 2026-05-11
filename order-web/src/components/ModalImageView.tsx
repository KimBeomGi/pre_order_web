"use client";
import { IoClose } from "react-icons/io5";

export default function ModalImageView() {
  return (
    // 검은 색으로 화면 전체를 뒤덮기
    <div>
      {/* 상단 위쪽에 X 표시 */}
      <button
        onClick={() => {}}
        className="hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoClose className="text-[1.6em] text-gray-500" />
      </button>
      {/* 매개변수로 받은 이미지들을 캐러셀 처럼 되게 되어야함 */}
      {/* 근데 배민이나 쿠팡이츠처럼 확대도 되어야함 이건 폰에서 자체적으로 되는거낙 */}
      <div>
        <div>
          <div></div>
        </div>
      </div>
      {/* 하단 아래에 현재페이지 / 총 페이지 로 있어야함 예) 3/4 || 1/1  */}
      <div></div>
    </div>
  );
}
