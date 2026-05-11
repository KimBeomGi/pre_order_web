"use client";

import { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalFullScreenProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalFullScreen({
  isOpen,
  onClose,
  children,
}: ModalFullScreenProps) {
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden touch-none">
      {/* 닫기 버튼 - 최상단 맨 왼쪽으로 이동 */}
      <button
        onClick={onClose}
        className="absolute top-[0.5em] left-[0.5em] text-[#FFFFFF] z-[210] font-light hover:text-gray-300 transition-colors cursor-pointer"
      >
        <IoClose className="text-[1.875em]" />
      </button>

      {/* 내용 */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );

}
