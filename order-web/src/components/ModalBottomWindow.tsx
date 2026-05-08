"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
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
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);

  // 모달이 열려있을 때 바디 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setDragY(0);
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    const height = typeof window !== "undefined" ? window.innerHeight : 1000;
    setDragY(height); // 화면 아래로 완전히 밀어내기
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 시간(0.3s) 후에 실제 닫기 호출
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startTimeRef.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0) {
      setDragY(diff);
    } else {
      setDragY(diff * 0.3); // 위로 드래그 시 저항감 (쫀득함)
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const duration = Date.now() - startTimeRef.current;
    const velocity = dragY / duration; // 속도 계산

    // 100px 이상 내렸거나, 빠르게 아래로 툭 던졌을 때(속도 0.5 이상)
    if (dragY > 100 || (velocity > 0.5 && dragY > 20)) {
      handleClose();
    } else {
      setDragY(0);
    }
  };

  if (!isOpen) return null;

  // 드래그 거리에 따른 배경 투명도 계산 (0px일 때 0.5, 많이 내릴수록 0에 가깝게)
  const winHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const backdropOpacity = Math.max(0, 0.5 - (dragY / winHeight));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden">
      {/* 배경 (드래그와 연동) */}
      <div
        className="absolute inset-0 bg-black backdrop-blur-[2px] transition-all duration-300"
        style={{ 
          opacity: backdropOpacity,
          pointerEvents: isClosing ? "none" : "auto" 
        }}
        onClick={handleClose}
      />

      {/* 모달 창 본체 */}
      <div
        className={`relative max-md:w-[390px] w-[98%] max-h-[94%] bg-[#FFFFFF] rounded-[1em] mb-[1em] shadow-2xl touch-none`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.127)", // 쫀득한 Spring 느낌의 베지어 곡선
        }}
      >
        {/* 드래그 핸들 영역 */}
        <div 
          className="flex justify-center items-center py-[1.2em] cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bg-[#D9D9D9] h-[4px] w-[15%] rounded-full shadow-inner"></div>
        </div>

        {/* 내용 섹션 */}
        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
