"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CustomCarouselProps {
  content: string[]; // 이미지 URL 배열
  button?: boolean; // 버튼 표시 여부
  showIndex?: boolean; // 인덱스 표시기 표시 여부
  initialIndex?: number; // 시작 인덱스
  onIndexChange?: (index: number) => void; // 인덱스 변경 시 콜백
  onClickItem?: (index: number) => void; // 아이템 클릭 시 콜백
  aspectRatio?: string; // 종횡비 (Tailwind class)
  imageFit?: "cover" | "contain"; // 이미지 맞춤 방식
}

export default function CustomCarousel({
  content,
  button = true,
  showIndex = true,
  initialIndex = 0,
  onIndexChange,
  onClickItem,
  aspectRatio = "aspect-[4/3]",
  imageFit = "cover",
}: CustomCarouselProps) {
  // 무한 루프를 위해 앞뒤에 아이템 추가 [마지막, ...아이템들, 첫번째]
  const items = [content[content.length - 1], ...content, content[0]];
  const [currentIndex, setCurrentIndex] = useState(initialIndex + 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 실제 인덱스 계산 (부모 컴포넌트에 알림용)
  const getRealIndex = useCallback(
    (index: number) => {
      if (!content || content.length === 0) return 0;
      const len = content.length;
      const realIndex = index - 1;
      // 음수이거나 범위를 벗어나더라도 항상 0 ~ len - 1 사이의 올바른 값을 반환하도록 수정
      return ((realIndex % len) + len) % len;
    },
    [content],
  );

  useEffect(() => {
    onIndexChange?.(getRealIndex(currentIndex));
  }, [currentIndex, getRealIndex, onIndexChange]);

  // 무한 루프 점프 처리
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex <= 0) {
      setCurrentIndex(items.length - 2);
    } else if (currentIndex >= items.length - 1) {
      setCurrentIndex(1);
    }
  };

  const moveNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const movePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // 터치 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsTransitioning(false);
    
    // 터치로 애니메이션을 끊었을 때, 복제본 위치(0 또는 끝)라면 즉시 실제 위치로 순간이동시켜 빈 화면을 방지
    setCurrentIndex((prev) => {
      if (prev <= 0) return items.length - 2;
      if (prev >= items.length - 1) return 1;
      return prev;
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    setTranslateX(-diff);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      setTranslateX(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      moveNext();
    } else if (isRightSwipe) {
      movePrev();
    }
    
    setTranslateX(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full overflow-hidden group">
      {/* 캐러셀 컨테이너 */}
      <div
        ref={containerRef}
        className={`flex ${isTransitioning ? "transition-transform duration-300 ease-out" : ""}`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
        }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((src, idx) => (
          <div
            key={idx}
            className={`relative w-full shrink-0 ${aspectRatio} cursor-pointer`}
            onClick={() => onClickItem?.(getRealIndex(currentIndex))}
          >
            <img
              src={src}
              alt={`slide-${idx}`}
              className={`w-full h-full ${imageFit === "cover" ? "object-cover" : "object-contain"} select-none`}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 인덱스 표시기 (예: 1 / 4) */}
      {showIndex && (
        <div className="absolute bottom-[1em] left-[1em] bg-black/50 text-[#FFFFFF] px-[0.75em] py-[0.25em] rounded-full text-[0.875em] font-medium backdrop-blur-sm">
          {getRealIndex(currentIndex) + 1} / {content.length}
        </div>
      )}

      {/* 내비게이션 버튼 */}
      {button && content.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              movePrev();
            }}
            className="absolute left-[0.5em] top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-[#FFFFFF] p-[0.5em] rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <IoChevronBack size="1.5em" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveNext();
            }}
            className="absolute right-[0.5em] top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-[#FFFFFF] p-[0.5em] rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <IoChevronForward size="1.5em" />
          </button>
        </>
      )}

    </div>
  );
}
