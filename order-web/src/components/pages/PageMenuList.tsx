"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, use } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ModalWindow from "@/components/ModalWindow";
import ModalBottomWindow from "@/components/ModalBottomWindow";
import { getStoreData } from "@/app/api/store";
import storeDataSkeleton from "@/temp_data/storeDataSkeleton.json";
import { StoreData, StoreMenuListData } from "@/types/store";
import toast from "react-hot-toast";
import {useAuthStore} from "@/store/useAuthStore"

export default function PageMenuList({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const roomMembers = useAuthStore((state) => state.roomMembers)
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const router = useRouter();
  const categoryRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);
  const categoryContentRef = useRef<HTMLDivElement | null>(null);
  const categoryTabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [categoryBarHeight, setCategoryBarHeight] = useState(0);
  const [isStoreNoticeModalOpen, setIsStoreNoticeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCallStaffModalOpen, setIsCallStaffModalOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState(0);
  const [selectStaffMenu, setSelectStaffMenu] = useState(0);
  const [staffMenu, setStaffMenu] = useState<string[]>(["직원호출"]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [orderDetails, setOrderDetails] = useState(2);
  // const [coViewerCount, setCoViewerCount] = useState(0);
  const [storeData, setStoreData] = useState<StoreData>(storeDataSkeleton);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const [searchMenuList, setSearchMenuList] = useState<StoreMenuListData[]>([]);

  async function handleGetStoreData() {
    try {
      const response = await getStoreData();
      setStoreData(response);
      setStaffMenu([...staffMenu, ...response.staff_menu]);
    } catch (error) {}
  }
  useEffect(() => {
    handleGetStoreData();
  }, []);

  useEffect(() => {
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
      toast.success("호출했어요");
    } catch (error) {
      toast.error("호출에 실패했어요");
    }
  }

  useEffect(() => {
    if (isSearchOpen && categoryBarRef.current) {
      // categoryBarRef가 sticky 상태여서, categoryBarRef위에있으면 찾아가지만, 아래에 있으면 움직이지 않음
      const targetTop =
        categoryBarRef.current.getBoundingClientRect().top + window.scrollY;

      isScrollingRef.current = true;
      window.scrollTo({
        top: targetTop,
        behavior: "auto",
      });
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }

    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchValue) {
      const wholeMenuList = storeData.menu;
      const filteredMenuList = wholeMenuList.filter((menu) =>
        menu.product_name.includes(searchValue),
      );
      console.log(filteredMenuList);
      setSearchMenuList(filteredMenuList);
    } else {
      setSearchMenuList([]);
    }
  }, [searchValue]);

  return (
    <div className="bg-[#ECEDEF] text-[0.9375rem] relative w-full mb-[6rem]">
      <div className="relative z-0">
        <img
          className="w-full h-[10rem] object-cover object-center"
          src="/img/menu-order/menu_top_intro.png"
          alt=""
        />
      </div>
      <div className="relative -mt-[1.25rem]">
        <div className="bg-[#FFFFFF] rounded-t-[1.25rem]">
          <div className="px-[1.375rem] pt-[1.875rem]">
            <div className="flex flex-row justify-between text-[0.9375rem]">
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
                    {[...Array(Math.min(roomMembers, 3))].map((_, roomMembersKey) => {
                      return(
                        <li key={roomMembersKey} className="flex items-center justify-center w-[1.6666667em] h-[1.6666667em] bg-[#D9D9D96E] rounded-full">
                          <img
                            className="w-[0.8em]"
                            src="/img/person_icon.png"
                            alt=""
                          />
                        </li>

                      )
                    })}
                    {/* <li className="flex items-center justify-center w-[1.6666667em] h-[1.6666667em] bg-[#D9D9D96E] rounded-full">
                      <img
                        className="w-[0.8em]"
                        src="/img/person_icon.png"
                        alt=""
                      />
                    </li> */}
                  </ul>
                  <p>
                    {roomMembers > 1 ? `${roomMembers}명이 함께 주문하고 있어요!` : "혼자 주문 하고 있어요!"}
                  </p>
                </div>
              </div>
              <div>
                <div
                  className="relative active:opacity-50"
                  onClick={() => {
                    console.log("주문내역");
                    router.push(`/table/${store}/order/history`);
                  }}
                >
                  <img
                    className="w-[1.8125rem]"
                    src="/img/order_details_icon.png"
                    alt=""
                  />
                  {orderDetails > 0 ? (
                    <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2  flex justify-center items-cente text-[0.9375rem] w-[1.3333333em] h-[1.3333333em] bg-[#EF4444] text-[#FFFFFF] font-bold rounded-full">
                      <p className="leading-5">{orderDetails}</p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="text-[0.9375rem] mt-[0.8em] flex flex-row justify-between">
              <div className="flex flex-row items-end justify-center gap-[0.5em]">
                <h2 className="text-[2em] font-extrabold">{store}</h2>
                <p className="">TABLE 01</p>
              </div>
              {/* 다국어 지원을 위함 */}
              <div className="flex flex-row gap-x-[0.5em]">
                <button
                  className="font-semibold w-fit px-[0.6em] py-[0.46667em] rounded-[0.3334em] border-[#E5E5E5] border border-solid flex flex-row justify-center items-center gap-x-[0.6em] rounded-[0.3333em] active:opacity-50"
                  onClick={() => {
                    toast("다국어 선택 작업 예정", {
                      icon: '🐳'
                    })
                  }}
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
                className="text-[0.875rem] bg-[#F2F3F6] rounded-[1.53333em] flex flex-row gap-x-[0.5em] py-[0.66667em] px-[1em] mt-[1.8em]"
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
            <div className="text-[0.9375rem]">
              <div className="flex flex-row items-center gap-x-[0.6em] ml-[1em] mb-[1em]">
                <span className="font-bold text-[1.125rem] text-[#2A5BAD]">
                  추천메뉴
                </span>
                <span className="px-[0.3333em] bg-[#FDBB03] font-bold w-fit text-[#FFFFFF]">
                  PICK
                </span>
              </div>
              <div className="w-full px-[0.9375rem] overflow-hidden">
                <div className=" w-full overflow-x-scroll no-scrollbar">
                  <ul className="flex flex-row gap-x-[0.3333em] ">
                    {storeData["recommend"].map((value, key) => (
                      <li
                        key={key}
                        className="shrink-0 w-[33.333%] relative rounded-[0.3125rem] overflow-hidden active:opacity-80"
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
                        <div className={`absolute top-0 left-0 p-[0.125rem] w-full h-full bg-[#00000033]`}>
                          <p className="font-semibold text-[#FFFFFF] text-[0.75rem]">
                            {value.product_name}
                          </p>
                          <p className="font-semibold text-[#FFFFFF] text-[0.75rem]">
                            {value.price.toLocaleString()}원
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* 카테고리바+메뉴리스트 */}
        <div className="text-[0.9375rem]">
          {/* 카테고리바 */}
          <div
            ref={categoryBarRef}
            className={`h-[3.125rem] flex flex-row items-center justify-between px-[1em] py-[0.625rem] bg-[#FFFFFF] sticky top-0 ${isSearchOpen ? "z-[110]" : "z-30"}`}
          >
            {/* 검색창 */}
            <div className="flex flex-row items-center">
              <div
                className={`transition-all duration-150 flex flex-row items-center text-[1rem] px-[0.75em] py-[0.3125em] bg-[#F5F5F5] rounded-[0.625em] h-[29px] w-[2.5rem] ${isSearchOpen && "w-[20.625rem]"}`}
                onClick={() => {
                  setIsSearchOpen(true);
                }}
              >
                <button className="active:scale-95">
                  <FaMagnifyingGlass className="text-[#373737]" />
                </button>
                <input
                  ref={searchInputRef}
                  className={`focus:outline-0 invisible ${isSearchOpen && "pl-[0.5em] visible"}`}
                  type="text"
                  value={searchValue ?? ""}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  placeholder="어떤 메뉴를 찾으시나요?"
                />
              </div>
              {isSearchOpen && (
                <button
                  className={`text-[1rem] text-nowrap w-[2.5rem]`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchValue("");
                  }}
                >
                  취소
                </button>
              )}
            </div>
            <div
              ref={categoryContentRef}
              className={`overflow-x-auto overflow-y-hidden no-scrollbar`}
            >
              <div className="flex flex-row">
                {storeData["categories"].map((value, key) => (
                  <div
                    className={`shrink-0 text-[1.125rem] border-b-2 px-[0.55556em] ${selectCategory === key ? "border-[#293448]" : "border-[#ECEDEF]"}`}
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
              className={`bg-[#F2F3F6] rounded-full p-[0.4em] ${isSearchOpen && "hidden"}`}
              onClick={() => {
                setIsCategoryModalOpen(!isCategoryModalOpen);
              }}
            >
              <FaChevronDown className="text-[0.8em] text-[#848E9A]" />
            </button>
          </div>
          {/* 메뉴리스트 */}
          <div className="relative text-[0.9375rem]">
            <ul className="flex flex-col gap-y-[1em]">
              {storeData["categories"].map((value, key) => (
                <li className="bg-[#FFFFFF] py-[1.6em]" key={key}>
                  <h4
                    className="text-[1.2em] px-[1.6em] font-bold text-[#293448]"
                    ref={(el) => {
                      categoryRefs.current[key] = el;
                    }}
                  >
                    {value}
                  </h4>
                  <ul className="">
                    {storeData["menu"]
                      .filter((product) => product.category === value)
                      .map((product, menu_idx, filteredMenu) => {
                        const isLast = menu_idx === filteredMenu.length - 1;
                        return (
                          <li
                            key={product.id}
                            className={`pt-[1em] rounded-[1em] transition-colors duration-75 ${activeMenuId === product.id ? "bg-[#F2F3F6]" : ""}`}
                            onTouchStart={() => setActiveMenuId(product.id)}
                            onTouchEnd={() => setActiveMenuId(null)}
                            onTouchCancel={() => setActiveMenuId(null)}
                            onClick={() => {
                              router.push(
                                `/table/${resolvedParams.store}/menu/${product.id}`,
                              );
                            }}
                          >
                            <div
                              className={`mx-[1.6em] pb-[1em] ${isLast ? "" : "border-b border-b-[#ECEDEF]"} flex flex-row items-center justify-between`}
                            >
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
                        );
                      })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col text-[16px] p-[2em] gap-y-[1em]">
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
        className={`text-[16px] fixed left-1/2 -translate-x-1/2 py-[0.46875em] bottom-[1em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] bg-[#222F4A] flex justify-center items-center gap-x-[0.9375em] z-30 active:opacity-80`}
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
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[100] w-full h-full bg-[#00000080] overflow-y-auto"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchValue("");
          }}
        >
          <ul
            className={`max-w-[400px] py-[3.125rem] mx-auto ${searchMenuList.length > 0 && "bg-[#FFFFFF]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {searchMenuList.map((product, menu_idx) => {
              const isLast = menu_idx === searchMenuList.length - 1;
              return (
                <li
                  key={product.id}
                  className={`pt-[1em] rounded-[1em] transition-colors duration-75 ${activeMenuId === product.id ? "bg-[#F2F3F6]" : ""}`}
                  onTouchStart={() => setActiveMenuId(product.id)}
                  onTouchEnd={() => setActiveMenuId(null)}
                  onTouchCancel={() => setActiveMenuId(null)}
                  onClick={() => {
                    router.push(
                      `/table/${resolvedParams.store}/menu/${product.id}`,
                    );
                    // setIsSearchOpen(false);
                  }}
                >
                  <div
                    className={`mx-[1.6em] pb-[1em] ${isLast ? "" : "border-b border-b-[#ECEDEF]"} flex flex-row items-center justify-between`}
                  >
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
              );
            })}
          </ul>
        </div>
      )}
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
    <div className="text-[0.9375rem]">
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
