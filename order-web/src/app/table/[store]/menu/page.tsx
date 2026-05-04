"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, use } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ModalWindow from "@/components/ModalWindow";
import storeData from "@/temp_data/storeData.json";
import ModalBottomWindow from "@/components/ModalBottomWindow";

// import Image from 'next/image'

export default function Menupage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const data = storeData;
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const categoryRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);
  const categoryContentRef = useRef<HTMLDivElement | null>(null);
  const categoryTabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [categoryBarHeight, setCategoryBarHeight] = useState(0);
  const [isStoreNoticeModalOpen, setIsStoreNoticeModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState(0);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const isScrollingRef = useRef(false);

  ////////////// 카테고리 관련 코드 시작
  useEffect(() => {
    if (!categoryBarRef.current) return;

    setCategoryBarHeight(categoryBarRef.current.offsetHeight);
  }, []);

  // 카테고리바에서 카테고리를 선택하면, 해당 부분으로 이동하되, 가려지는 부분이 없도록
  const scrollToCategory = (index: number) => {
    const target = categoryRefs.current[index];
    if (!target) return;

    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    isScrollingRef.current = true; // 자동 스크롤 시작

    window.scrollTo({
      top: targetTop - categoryBarHeight,
      behavior: "smooth",
    });
  };

  const categoryToCenter = (index: number) => {
    const container = categoryContentRef.current;
    const tab = categoryTabRefs.current[index];

    if (!container || !tab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    // 스크롤이 위치해야하는곳
    const scrollLeft =
      container.scrollLeft -
      containerRect.left -
      containerRect.width / 2 +
      tabRect.left +
      tabRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  // selectCategory가 변경될 때마다 탭을 중앙으로 정렬 (스크롤 이동은 클릭 시에만 별도로 호출)
  useEffect(() => {
    categoryToCenter(selectCategory);
  }, [selectCategory]);

  // 스크롤의 위치에 따라 selectCategory가 달라지게 되어야해!
  // 스크롤 위치 찾기
  const handleCategoryByScrollPosition = () => {
    if (isScrollingRef.current) return; // 자동 스크롤 중이면 감지 생략

    let activeIndex = 0;

    // 각 카테고리 섹션의 위치를 확인
    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        // 카테고리 헤더가 카테고리 바(sticky) 바로 아래에 오거나 그보다 위에 있을 때
        if (rect.top <= categoryBarHeight + 20) {
          activeIndex = index;
        }
      }
    });

    if (activeIndex !== selectCategory) {
      setSelectCategory(activeIndex);
    }
  };

  useEffect(() => {
    const handleScrollEnd = () => {
      isScrollingRef.current = false; // 스크롤 종료 시 감지 재활성화
    };

    window.addEventListener("scroll", handleCategoryByScrollPosition);
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("scroll", handleCategoryByScrollPosition);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [categoryBarHeight, selectCategory]); // 의존성 추가

  ////////////// 카테고리 관련 코드 끝

  return (
    <div className="bg-[#ECEDEF]">
      {/* 상단 커버 이미지 */}
      <div className="relative z-0">
        <img
          className="w-full h-[160px] object-cover object-center"
          src="/img/menu-order/menu_top_intro.png"
          alt=""
        />
      </div>
      {/* 보이는 구간 */}
      <div className="relative z-10 -mt-[20px]">
        {/* 메인 */}
        <div className="bg-[#FFFFFF] rounded-t-[20px]">
          {/* 상단 공지사항 까지 */}
          <div className="px-[22px] pt-[30px]">
            <div className="flex flex-row justify-between text-[15px]">
              {/* 직원호출 버튼 */}
              <button
                className="font-semibold w-fit px-[0.6em] py-[0.46667em] rounded-[0.3334em] border-[#E5E5E5] border border-solid flex flex-row justify-center items-center gap-x-[0.6em]"
                onClick={() => {}}
              >
                <img
                  className="w-[1.13334em]"
                  src="/img/chime_bell_icon.png"
                  alt=""
                />
                직원호출
              </button>
              <p className="">테이블 : 1번 테이블</p>
            </div>
            <div className="text-[15px] mt-[0.8em] flex flex-row justify-between">
              <h2 className="text-[2em] font-extrabold">
                {/* {data["store_info"]["store_name"]} */}
                {store}
              </h2>
              <div className="flex flex-row gap-x-[0.5em]">
                <button
                  className="font-semibold w-fit px-[0.6em] py-[0.46667em] rounded-[0.3334em] border-[#E5E5E5] border border-solid flex flex-row justify-center items-center gap-x-[0.6em]"
                  onClick={() => {}}
                >
                  <img
                    className="w-[1.2em]"
                    src="/img/order_details_icon.png"
                    alt=""
                  />
                </button>
                <button
                  className="font-semibold w-fit px-[0.6em] py-[0.46667em] rounded-[0.3334em] border-[#E5E5E5] border border-solid flex flex-row justify-center items-center gap-x-[0.6em] rounded-[0.3333em]"
                  onClick={() => {}}
                >
                  <img
                    className="w-[1.46667em]"
                    src="/img/flag_icon_korea.png"
                    alt=""
                  />
                  한국어
                  <FaChevronDown className="text-[0.8em]" />
                  {/* <div className="w-[0.5em] h-[0.5em] rotate-45 border border-t-0 border-l-0"></div> */}
                </button>
              </div>
            </div>
            {/* 공지사항 */}
            <div className="pb-[1.2em]">
              <div
                className="text-[15px] bg-[#F2F3F6] rounded-[1.53333em] flex flex-row gap-x-[0.5em] py-[0.66667em] px-[1em] mt-[1.8em]"
                onClick={() => {
                  setIsStoreNoticeModalOpen(!isStoreNoticeModalOpen);
                }}
              >
                <img
                  className="w-[1.53333em] object-contain"
                  src="/img/Loudspeaker_icon.png"
                  alt=""
                />
                <p className="text-[0.93333em]">
                  {data.notice[0].message.length > 28
                    ? data.notice[0].message.slice(0, 28) + "..."
                    : data.notice[0].message}
                </p>
              </div>
            </div>
          </div>
          {/* 추천메뉴 */}
          {data.is_recommend ? (
            <div className="text-[15px]">
              <div className="flex flex-row items-center gap-x-[0.6em] ml-[1em] mb-[1em]">
                <span className="font-bold text-[1.2em] text-[#2A5BAD]">
                  추천메뉴
                </span>
                <span className="px-[0.3333em] bg-[#FDBB03] font-bold w-fit text-[#FFFFFF]">
                  PICK
                </span>
              </div>
              <div className="w-full">
                <div className="overflow-hidden w-full">
                  <div className="flex flex-row gap-x-[0.3333em]">
                    {data["recommend"].map((value, key) => (
                      <div key={key} className="w-1/3">
                        <img
                          className="w-full h-[94px] object-cover"
                          src={value.img_src}
                          alt=""
                        />
                        <p className="font-semibold text-[#000000]">
                          {value.product_name}
                        </p>
                        <p className="font-semibold text-[#B4B4B4] text-[0.86667em]">
                          {value.price.toLocaleString()}원
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* 메뉴 전체 */}
        <div className="text-[15px]">
          {/* 카테고리 및 검색 */}
          <div
            ref={categoryBarRef}
            className="flex flex-row items-center justify-between pl-[0.66667em] pr-[1em] bg-[#FFFFFF] sticky top-0 z-10"
          >
            <button
              className="text-[1.2em] text-[#373737] px-[0.66667em] py-[0.27778em] bg-[#F5F5F5] rounded-[0.55556em]"
              onClick={() => {}}
            >
              <FaMagnifyingGlass />
            </button>
            <div
              ref={categoryContentRef}
              className="overflow-x-auto overflow-y-hidden no-scrollbar"
            >
              <div className="flex flex-row">
                {data["categories"].map((value, key) => (
                  <div
                    className={`shrink-0 text-[1.2em] border-b-2  p-[0.55556em] ${selectCategory === key ? "border-[#293448]" : "border-[#ECEDEF]"}`}
                    key={key}
                    ref={(el) => {
                      categoryTabRefs.current[key] = el;
                    }}
                    onClick={() => {
                      setSelectCategory(key);
                      scrollToCategory(key);
                    }}
                  >
                    <p
                      className={`whitespace-nowrap font-bold ${selectCategory === key ? "text-[#293448]" : "text-[#B4B4B4]"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="bg-[#F2F3F6] rounded-full p-[0.4em]"
              onClick={() => {
                setIsBottomModalOpen(!isBottomModalOpen);
              }}
            >
              <FaChevronDown className="text-[0.8em] text-[#848E9A]" />
            </button>
          </div>
          {/* 각 메뉴 */}
          <div className="text-[15px]">
            <div className="flex flex-col gap-y-[1em]">
              {/* 각 카테고리 별로 가능하게 div만들어두고 그 div안에서 확인 */}
              {data["categories"].map((value, key) => (
                <ul key={key} className="bg-[#FFFFFF] px-[1.6em] py-[1.6em]">
                  <h4
                    className="text-[1.2em] font-bold text-[#293448]"
                    ref={(el) => {
                      categoryRefs.current[key] = el;
                    }}
                  >
                    {value}
                  </h4>
                  {data["menu"].map((product, menu_key) => (
                    <Fragment key={menu_key}>
                      {product.category === value ? (
                        <li
                          className="flex flex-row items-center justify-between"
                          onClick={() => {
                            router.push(
                              `/table/${resolvedParams.store}/menu/${product.id}`,
                            );
                          }}
                        >
                          <div className="w-[60%]">
                            {product.is_soldout ? (
                              <div
                                className={`badge w-fit rounded-full text-[#FFFFFF] font-bold py-[0.125em] px-[1em] mt-[1em] mb-[0.5em]`}
                                style={{ backgroundColor: "#525A67" }}
                              >
                                품절
                              </div>
                            ) : product.badge ? (
                              <div
                                className={`badge w-fit rounded-full text-[#FFFFFF] font-bold py-[0.125em] px-[1em] mt-[1em] mb-[0.5em]`}
                                style={{ backgroundColor: product.badge_color }}
                              >
                                {product.badge_content}
                              </div>
                            ) : (
                              ""
                            )}

                            <h5
                              className={`text-[1.2em] ${product.is_soldout ? "opacity-50" : ""} text-[#293448] font-semibold`}
                            >
                              {product.product_name}
                              <br />
                              {product.price.toLocaleString()}원
                            </h5>
                            <p className="text-[0.86666em] text-[#6C7A88]">
                              {product.description}
                            </p>
                          </div>
                          <div
                            className={`w-[6.66667em] h-[6.66667em] rounded-[0.5em] flex justify-center items-center relative overflow-hidden shrink-0`}
                          >
                            {product.img_src ? (
                              <img
                                className="w-full h-full object-cover"
                                src={product.img_src}
                                alt=""
                              />
                            ) : (
                              <p className="text-[1.6em]">
                                이미지<br></br>준비중
                              </p>
                            )}
                            {product.is_soldout ? (
                              <div className="absolute w-full h-full bg-[#D2D2D2B2] left-0 top-0"></div>
                            ) : (
                              ""
                            )}
                          </div>
                        </li>
                      ) : (
                        <></>
                      )}
                    </Fragment>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
        {/* 가게정보 원산지 */}
        <div className="flex flex-col text-[16px] p-[2em] gap-y-[1em]">
          <h2 className="text-[1.2em] font-semibold text-[#4C5868]">
            가게 정보 · 원산지
          </h2>
          <div className="text-[#697584]">
            <p>상호명</p>
            <p>{data["store_info"]["store_name"]}</p>
          </div>
          <div className="text-[#697584]">
            <p>가게주소</p>
            <p>{data["store_info"]["store_address"]}</p>
          </div>
          <div className="text-[#697584]">
            <p>원산지</p>
            <p>{data["store_info"]["country_origin"].join(", ")}</p>
          </div>
        </div>
      </div>
      {isStoreNoticeModalOpen ? (
        <ModalWindow
          isOpen={isStoreNoticeModalOpen}
          onClose={() => setIsStoreNoticeModalOpen(false)}
          storeTitle="공지사항"
        >
          <StoreNotice />
        </ModalWindow>
      ) : (
        <></>
      )}
      {isBottomModalOpen ? (
        <ModalBottomWindow
          isOpen={isBottomModalOpen}
          onClose={() => setIsBottomModalOpen(false)}
        >
          <CategoriesContent
            categories={data.categories}
            selectCategory={selectCategory}
            onSelect={(index) => {
              setSelectCategory(index);
              scrollToCategory(index);
              setIsBottomModalOpen(false);
            }}
          />
        </ModalBottomWindow>
      ) : (
        <></>
      )}
      {/* {isBottomModalOpen ? (
        <ModalBottomWindow
          isOpen={isBottomModalOpen}
          onClose={() => setIsBottomModalOpen(false)}
        >
          <CallStaff
            staffMenu={data.categories}
            selectStaffMenu={selectCategory}
            onSelect={(index) => {
              setSelectCategory(index);
              scrollToCategory(index);
              setIsBottomModalOpen(false);
            }}
          />
        </ModalBottomWindow>
      ) : (
        <></>
      )} */}
    </div>
  );
}

export function StoreNotice() {
  const data = storeData;

  const statusColors: { [key: string]: { bg: string; text: string } } = {
    이벤트: { bg: "#E6F7FF", text: "#0091FF" },
    안내: { bg: "#FFF7E6", text: "#FFBA40" },
    휴무: { bg: "#FFF2F0", text: "#FF4D63" },
  };

  return (
    <div className="text-[15px]">
      {data.notice.map((noticeItem, index) => {
        const currentStyle = statusColors[noticeItem.status] || {
          bg: "#F5F5F5",
          text: "#666666",
        };

        return (
          <div
            key={index}
            className="mb-4 bg-[#FFFFFF] p-[1em] space-y-[0.5em] rounded-[1em]"
          >
            <p
              className="py-[0.125em] px-[0.5em] rounded-[0.25em]"
              style={{
                backgroundColor: currentStyle.bg,
                color: currentStyle.text,
                display: "inline-block",
              }}
            >
              {noticeItem.status}
            </p>
            <p className="font-bold text-[1.2em]">{noticeItem.title}</p>
            <p className="text-[#6C7A88] break-all">{noticeItem.message}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CategoriesContent({
  categories,
  selectCategory,
  onSelect,
}: {
  categories: string[];
  selectCategory: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="text-[16px] px-[2em] pb-[1em]">
      <h1 className="text-[1.4em] font-bold mb-[1em] text-[#293448]">
        카테고리를 선택해주세요
      </h1>
      <div className="grid grid-cols-2 gap-[0.8em]">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`text-[1.1em] font-semibold py-[0.5em] text-left transition-colors ${
              selectCategory === index ? "text-[#3182F6]" : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CallStaff({
  staffMenu,
  selectStaffMenu,
  onSelect,
}: {
  staffMenu: string[];
  selectStaffMenu: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="text-[16px] px-[2em] pb-[1em]">
      <h1 className="text-[1.4em] font-bold mb-[1em] text-[#293448]">
        무엇을 도와드릴까요?
      </h1>
      <div className="grid grid-cols-2 gap-[0.8em]">
        {staffMenu.map((category, index) => (
          <button
            key={index}
            className={`text-[1.1em] font-semibold py-[0.5em] text-left transition-colors ${
              selectStaffMenu === index ? "text-[#3182F6]" : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
