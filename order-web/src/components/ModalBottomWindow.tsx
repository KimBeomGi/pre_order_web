"use client";

import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalBottomWindow({
  isOpen,
  onClose,
  children,
}: ModalProps) {
  // 모달이 열려있을 때 바디 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* 배경 (어둡게 처리) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 모달 창 본체 */}
      <div className="relative max-md:w-[390px] w-[98%] max-h-[94%] bg-[#FFFFFF] rounded-[1em] mb-[1em] shadow-xl">
        <div className="flex justify-center items-center my-[1em]">
          <div className="bg-[#D9D9D9] h-[4px] w-[20%]"></div>
        </div>
        {/* 헤더 섹션 */}
        {/* <div className="flex items-center justify-between pb-[1em]">
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="text-[1.6em] text-gray-500" />
          </button>
        </div> */}

        {/* 내용 섹션 (여기에 들어온 내용이 렌더링됨) */}
        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
