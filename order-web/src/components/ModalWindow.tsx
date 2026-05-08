"use client";

import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeTitle?: string;
  children: ReactNode;
}

export default function ModalWindow({
  isOpen,
  storeTitle,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 배경 (어둡게 처리) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 모달 창 본체 */}
      <div className="relative w-[90%] max-w-[360px] max-h-[94%] bg-[#F2F3F6] rounded-[1em] p-[1em] shadow-xl">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between pb-[1em]">
          <p className="font-bold text-[1.6em]">{storeTitle}</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="text-[1.6em] text-gray-500" />
          </button>
        </div>

        {/* 내용 섹션 (여기에 들어온 내용이 렌더링됨) */}
        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
