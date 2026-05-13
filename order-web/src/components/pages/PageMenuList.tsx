"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, use } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ModalWindow from "@/components/ModalWindow";
import ModalBottomWindow from "@/components/ModalBottomWindow";
import { getStoreData } from "@/app/api/store";
import { StoreData } from "@/types/store";

export default function PageMenuList({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const categoryRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);
  const categoryContentRef = useRef<HTMLDivElement | null>(null);
  const categoryTabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [categoryBarHeight, setCategoryBarHeight] = useState(0);
  const [isStoreNoticeModalOpen, setIsStoreNoticeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCallStaffModalOpen, setIsCallStaffModalOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState(0);
  const [selectStaffMenu, setSelectStaffMenu] = useState(0);
  const [staffMenu, setStaffMenu] = useState<string[]>(["직원호출"]);
  const isScrollingRef = useRef(false);

  const [orderDetails, setOrderDetails] = useState(2);
  const [coViewerCount, setCoViewerCount] = useState(0);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  const getAPIStoreData = async () => {
    try {
      const response = await getStoreData();
      setStoreData(response);
      setStaffMenu((prev) => [...prev, ...(response?.staff_menu ?? [])]);
    } catch (error) {
      console.log("연결에 실패했습니다.");
    }
  };

  useEffect(() => {
    getAPIStoreData();
    if (!categoryBarRef.current) return;
    setCategoryBarHeight(categoryBarRef.current.offsetHeight);
  }, []);

  const scrollToCategory = (index: number) => {
    const target = categoryRefs.current[index];
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    isScrollingRef.current = true;
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

  useEffect(() => {
    categoryToCenter(selectCategory);
  }, [selectCategory]);

  const handleCategoryByScrollPosition = () => {
    if (isScrollingRef.current) return;
    let activeIndex = 0;
    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
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
      isScrollingRef.current = false;
    };
    window.addEventListener("scroll", handleCategoryByScrollPosition);
    window.addEventListener("scrollend", handleScrollEnd);
    return () => {
      window.removeEventListener("scroll", handleCategoryByScrollPosition);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [categoryBarHeight, selectCategory]);

  async function requireCallStaff(content: { [key: string]: number }) {
    try {
      console.log(content);
    } catch (error) {
      console.error("직원 호출 실패:", error);
    }
  }

  if (!storeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="bg-[#ECEDEF] text-[15px] relative w-full">
      <div className="relative z-0">
        <img
          className="w-full h-[160px] object-cover object-center"
          src="/img/menu-order/menu_top_intro.png"
          alt=""
        />
      </div>
      <div className="relative z-0 -mt-[20px]">
        <div className="bg-[#FFFFFF] rounded-t-[20px]">
          <div className="px-[22px] pt-[30px]">
            <div className="flex flex-row justify-between text-[15px]">
              <div>
                <button
                  className="font-semibold w-fit px-[0.6em] py-[0.46667em] rounded-[0.3334em] border-[#E5E5E5] border border-solid flex flex-row justify-center items-center gap-x-[0.6em]"
                  onClick={() => {
                    setIsCallStaffModalOpen(true);
                  }}
                >
                  <img
                    className="w-[1.13334em]"
                    src="/img/chime_bell_icon.png"
                    alt=""
                  />
                  직원호출
                </button>
                <div className="flex flex-row items-center gap-[0.5em] mt-[0.8em]">
                  <ul className="flex flex-row items-center -space-x-[0.5em]">
                    <li className="flex items-center justify-center w-[1.6666667em] h-[1.6666667em] bg-[#D9D9D96E] rounded-full">
                      <img
                        className="w-[0.8em]"
                        src="/img/person_icon.png"
                        alt=""
                      />
                    </li>
                    <li className="flex items-center justify-center w-[1.6666667em] h-[1.6666667em] bg-[#D9D9D96E] rounded-full">
                      <img
                        className="w-[0.8em]"
                        src="/img/person_icon.png"
                        alt=""
                      />
                    </li>
                  </ul>
                  <p>{coViewerCount}명이 함께 주문하고 있어요!</p>
                </div>
              </div>
              <div>
                <div
                  className="relative"
                  onClick={() => {
                    console.log("주문내역");
                  }}
                >
                  <img
                    className="w-[29px]"
                    src="/img/order_details_icon.png"
                    alt=""
                  />
                  {orderDetails > 0 ? (
                    <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2  flex justify-center items-center w-[1.3333333em] h-[1.3333333em] bg-[#EF4444] text-[#FFFFFF] font-bold rounded-full">
                      <p className="leading-1">{orderDetails}</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="text-[15px] mt-[0.8em] flex flex-row justify-between">
              <div className="flex flex-row items-end justify-center gap-[0.5em]">
                <h2 className="text-[2em] font-extrabold">
                  {store}
                </h2>
                <p className="">TABLE 01</p>
              </div>
              <div className="flex flex-row gap-x-[0.5em]">
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
                </button>
              </div>
            </div>
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
                  {storeData?.notice[0].message.length > 28
                    ? storeData?.notice[0].message.slice(0, 28) + "..."
                    : storeData?.notice[0].message}
                </p>
              </div>
            </div>
          </div>
          {storeData?.is_recommend ? (
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
                    {storeData["recommend"].map((value, key) => (
                      <div
                        key={key}
                        className="w-1/3"
                        onClick={() => {
                          router.push(
                            `/table/${resolvedParams.store}/menu/${value.id}`,
                          );
                        }}
                      >
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
        <div className="text-[15px]">
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
                {storeData["categories"].map((value, key) => (
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
                setIsCategoryModalOpen(!isCategoryModalOpen);
              }}
            >
              <FaChevronDown className="text-[0.8em] text-[#848E9A]" />
            </button>
          </div>
          <div className="text-[15px]">
            <div className="flex flex-col gap-y-[1em]">
              {storeData["categories"].map((value, key) => (
                <ul key={key} className="bg-[#FFFFFF] px-[1.6em] py-[1.6em]">
                  <h4
                    className="text-[1.2em] font-bold text-[#293448]"
                    ref={(el) => {
                      categoryRefs.current[key] = el;
                    }}
                  >
                    {value}
                  </h4>
                  {storeData["menu"].map((product, menu_key) => (
                    <Fragment key={menu_key}>
                      {product.category === value ? (
                        <li
                          className={`py-[1em] border-b border-b-[#ECEDEF] last:border-b-0`}
                          onTouchStart={() => {}}
                          onClick={() => {
                            router.push(
                              `/table/${resolvedParams.store}/menu/${product.id}`,
                            );
                          }}
                        >
                          <div className="flex flex-row items-center justify-between">
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
                            <div className="w-[65%]">
                              {product.is_soldout ? (
                                <div
                                  className={`badge w-fit rounded-full text-[#FFFFFF] font-bold py-[0.125em] px-[1em] mb-[0.5em]`}
                                  style={{ backgroundColor: "#525A67" }}
                                >
                                  품절
                                </div>
                              ) : product.badge ? (
                                <div
                                  className={`badge w-fit rounded-full text-[#FFFFFF] font-bold py-[0.125em] px-[1em] mb-[0.5em]`}
                                  style={{
                                    backgroundColor: product.badge_color,
                                  }}
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
        <div className="flex flex-col text-[16px] p-[2em] gap-y-[1em] mb-[6em]">
          <h2 className="text-[1.2em] font-semibold text-[#4C5868]">
            가게 정보 · 원산지
          </h2>
          <div className="text-[#697584]">
            <p>상호명</p>
            <p>{storeData["store_info"]["store_name"]}</p>
          </div>
          <div className="text-[#697584]">
            <p>가게주소</p>
            <p>{storeData["store_info"]["store_address"]}</p>
          </div>
          <div className="text-[#697584]">
            <p>원산지</p>
            <p>{storeData["store_info"]["country_origin"].join(", ")}</p>
          </div>
        </div>
      </div>
      {isStoreNoticeModalOpen ? (
        <ModalWindow
          isOpen={isStoreNoticeModalOpen}
          onClose={() => setIsStoreNoticeModalOpen(false)}
          storeTitle="공지사항"
        >
          <StoreNotice noticeData={storeData.notice} />
        </ModalWindow>
      ) : (
        <></>
      )}
      {isCategoryModalOpen ? (
        <ModalBottomWindow
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        >
          <CategoriesContent
            categories={storeData.categories}
            selectCategory={selectCategory}
            onSelect={(index) => {
              setSelectCategory(index);
              scrollToCategory(index);
              setIsCategoryModalOpen(false);
            }}
          />
        </ModalBottomWindow>
      ) : (
        <></>
      )}
      {isCallStaffModalOpen ? (
        <ModalBottomWindow
          isOpen={isCallStaffModalOpen}
          onClose={() => setIsCallStaffModalOpen(false)}
        >
          <CallStaff
            staffMenu={staffMenu}
            selectStaffMenu={selectStaffMenu}
            onSelect={(index) => {
              setSelectStaffMenu(index);
            }}
            onClose={() => {
              setIsCallStaffModalOpen(false);
            }}
            onRequest={(data) => {
              requireCallStaff(data);
              setIsCallStaffModalOpen(false);
            }}
          />
        </ModalBottomWindow>
      ) : (
        <></>
      )}

      <button
        className="text-[16px] fixed left-1/2 -translate-x-1/2 py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em]"
        onClick={() => {
          router.push(`/table/${resolvedParams.store}/cart`);
        }}
      >
        <span className="text-[1.25em] bg-[#FFFFFF] font-semibold w-[1.5em] h-[1.5em] flex justify-center items-center rounded-[0.3em]">
          1
        </span>
        <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
          65,000원 장바구니 보기
        </span>
      </button>
    </div>
  );
}

export function StoreNotice({
  noticeData,
}: {
  noticeData: { status: string; title: string; message: string }[];
}) {
  const statusColors: { [key: string]: { bg: string; text: string } } = {
    이벤트: { bg: "#E6F7FF", text: "#0091FF" },
    안내: { bg: "#FFF7E6", text: "#FFBA40" },
    휴무: { bg: "#FFF2F0", text: "#FF4D63" },
  };

  return (
    <div className="text-[15px]">
      {noticeData.map((noticeItem, index) => {
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
  onClose,
  onRequest,
}: {
  staffMenu: string[];
  selectStaffMenu: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  onRequest: (data: { [key: string]: number }) => void;
}) {
  const [menuCount, setMenuCount] = useState<{ [key: number]: number }>(
    staffMenu.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {}),
  );

  const handleCountChange = (index: number, delta: number) => {
    setMenuCount((prev) => ({
      ...prev,
      [index]: Math.max(0, (prev[index] || 0) + delta),
    }));
  };

  const handleToggle = (index: number) => {
    const delta = menuCount[index] > 0 ? -1 : 1;
    handleCountChange(index, delta);
  };

  const handleSubmit = () => {
    const requestData = staffMenu.reduce(
      (acc, menu, index) => {
        const count = menuCount[index] || 0;
        if (count > 0) {
          acc[menu] = count;
        }
        return acc;
      },
      {} as { [key: string]: number },
    );
    onRequest(requestData);
  };

  const isRequestable = Object.values(menuCount).some((count) => count > 0);

  return (
    <div className="text-[16px] px-[1.25em] pb-[1em]">
      <h1 className="text-[1.4em] font-bold mb-[1em] text-[#293448]">
        무엇을 도와드릴까요?
      </h1>
      <ul className="grid grid-cols-1 gap-y-[0.8em] max-h-[10em] overflow-auto mb-[1em]">
        {staffMenu.map((menu, index) => (
          <li
            key={index}
            className={`flex flex-row items-center justify-between py-[0.5em] pl-[1em] pr-[0.5em] rounded-[0.666667em] transition-colors ${
              menuCount[index] > 0 ? "bg-[#E8F3FF]" : "bg-[#F2F4F6]"
            }`}
            onClick={() => {
              onSelect(index);
              if (menu === "직원호출") handleToggle(index);
            }}
          >
            <p
              className={`text-[1em] font-semibold text-left ${menuCount[index] > 0 ? "text-[#3182F6]" : "text-[#293448]"}`}
            >
              {menu}
            </p>
            {menu === "직원호출" ? (
              <div className="flex flex-row items-center w-[6em] justify-around">
                <span
                  className={`w-[1.5em] h-[1.5em] rounded-full flex items-center justify-center shadow-sm font-bold transition-colors ${
                    menuCount[index] > 0
                      ? "bg-[#3182F6] text-white"
                      : "bg-[#FFFFFF] text-[#D1D1D1]"
                  }`}
                >
                  {menuCount[index] > 0 ? "✓" : ""}
                </span>
              </div>
            ) : (
              <div
                className="flex flex-row items-center w-[6em] justify-around"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-[1.5em] h-[1.5em] bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm font-bold active:scale-95"
                  onClick={() => handleCountChange(index, -1)}
                >
                  -
                </button>
                <span className="min-w-[1em] text-center font-bold">
                  {menuCount[index] || 0}
                </span>
                <button
                  className="w-[1.5em] h-[1.5em] bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm font-bold active:scale-95"
                  onClick={() => handleCountChange(index, 1)}
                >
                  +
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="left-0 w-full flex flex-row justify-between items-center gap-x-[0.5em] text-[1.25em]">
        <button
          className="w-full font-semibold rounded-[0.625em] py-[1em] bg-[#F2F4F6]"
          onClick={() => {
            onClose();
          }}
        >
          닫기
        </button>
        <button
          className={`w-full font-semibold rounded-[0.625em] py-[1em] transition-colors ${
            isRequestable
              ? "bg-[#3182F6] text-white"
              : "bg-[#222F49B5] text-[#FFFFFFB2] opacity-50 cursor-not-allowed"
          }`}
          onClick={() => {
            if (isRequestable) handleSubmit();
          }}
          disabled={!isRequestable}
        >
          요청하기
        </button>
      </div>
    </div>
  );
}
