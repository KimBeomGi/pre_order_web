"use client";
import { getMenuData } from "@/app/api/store";
import { use, useEffect, useState, useMemo } from "react";
import CustomCarousel from "@/components/CustomCarousel";
import ModalFullScreen from "@/components/ModalFullScreen";

export default function MenuID({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const _store = decodeURIComponent(resolvedParams.store);
  const _id = decodeURIComponent(resolvedParams.id);
  const [menu, setMenu] = useState<Record<string, unknown>>({});
  const [mainCount, setMainCount] = useState(1);
  const [minMainCount] = useState(1);
  const [maxMainCount] = useState(10);
  const [showWhere, setShowWhere] = useState("option");
  const [imageFullIndex, setImageFullIndex] = useState(0)

  // 모달 상태
  const [isFullCarouselOpen, setIsFullCarouselOpen] = useState(false);
  const [initialCarouselIndex, setInitialCarouselIndex] = useState(0);

  const exImages = [
    "/img/menu-detail/ricotta_lemon_pasta_example.png",
    "/img/menu-detail/gimbap_example.png",
    "/img/menu-detail/woodong_example.png",
    "/img/menu-detail/napjakmandu_example.png",
  ];
  // 실제 API 데이터 구조 예시 (최소/최대 선택 개수 명시)
  const optionGroups = [
    {
      title: "맵기 선택",
      type: "radio",
      required: true,
      minSelection: 1,
      maxSelection: 1,
      items: [
        { name: "기본 레벨", price: 0 },
        { name: "1레벨 (신라면정도)", price: 0 },
        { name: "2레벨 (불닭볶음면 정도)", price: 500 },
      ],
    },
    {
      title: "기본 토핑 (필수)",
      type: "checkbox",
      required: true,
      minSelection: 2,
      maxSelection: 4,
      items: [
        { name: "숙주나물", price: 0 },
        { name: "청경채", price: 0 },
        { name: "알배기배추", price: 0 },
        { name: "양배추", price: 0 },
        { name: "버섯", price: 0 },
        { name: "건두부", price: 0 },
      ],
    },
    {
      title: "누구의 손길?",
      type: "radio",
      required: true,
      minSelection: 1,
      maxSelection: 1,
      items: [
        { name: "신입 최씨", price: 0 },
        { name: "양식 경력 2년의 홍씨", price: 0 },
        { name: "일단 다 만들줄 아는 사장님", price: 0 },
        { name: "요리만 20년 오씨", price: 2000 },
      ],
    },
    {
      title: "가게번창을 위한 후원을 해주세요. 1,000원으로 더 맛있는 재료를 준비할 수 있습니다.🐳",
      type: "radio",
      required: true,
      minSelection: 1,
      maxSelection: 1,
      items: [
        { name: "무슨소리 알아서 해!", price: 0 },
        { name: "천원쯤이야", price: 1000 },
        { name: "싫은데 난 1만원 할건데?", price: 10000 },
        { name: "난 부자니까 5만원", price: 50000 },
      ],
    },
    {
      title: "추가 선택",
      type: "checkbox",
      required: false,
      minSelection: 0,
      maxSelection: 3,
      items: [
        { name: "치즈 추가", price: 1000 },
        { name: "베이컨 추가", price: 1500 },
        { name: "면 추가", price: 2000 },
      ],
    },
    {
      title: "사이드",
      type: "checkbox",
      required: false,
      minSelection: 0,
      maxSelection: 4,
      items: [
        { name: "물만두", price: 6000 },
        { name: "감자튀김", price: 3000 },
        { name: "사이다", price: 2000 },
        { name: "공기밥", price: 1000 },
      ],
    },
  ];

  // 옵션 상태 관리
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string | { name: string; count: number }[];
  }>(() => {
    const initialState: {
      [key: string]: string | { name: string; count: number }[];
    } = {};
    optionGroups.forEach((group) => {
      if (group.type === "radio") {
        initialState[group.title] = group.items[0].name;
      } else {
        initialState[group.title] = [];
      }
    });
    return initialState;
  });

  // 총 합계 계산 (useMemo 활용)
  const totalPrice = useMemo(() => {
    let basePrice = 12000; // 기본 메뉴 가격
    let optionsPrice = 0;

    optionGroups.forEach((group) => {
      const selected = selectedOptions[group.title];
      if (group.type === "radio") {
        // 라디오 버튼일 경우
        const item = group.items.find((i) => i.name === selected);
        if (item) optionsPrice += item.price;
      } else {
        // 체크박스일 경우 (배열)
        (selected as { name: string; count: number }[]).forEach((selItem) => {
          const item = group.items.find((i) => i.name === selItem.name);
          if (item) optionsPrice += item.price * selItem.count;
        });
      }
    });

    return (basePrice + optionsPrice) * mainCount;
  }, [selectedOptions, mainCount]);

  // 필수 옵션 선택 여부 확인 (useMemo 활용)
  const isReadyToOrder = useMemo(() => {
    return optionGroups.every((group) => {
      if (!group.required) return true; // 필수 아니면 패스

      const selected = selectedOptions[group.title];
      if (group.type === "radio") {
        // 라디오는 값이 있으면 통과
        return !!selected;
      } else {
        // 체크박스는 최소 선택 개수 확인
        const selectedList = selected as { name: string; count: number }[];
        return selectedList.length >= (group.minSelection || 1);
      }
    });
  }, [selectedOptions]);

  // 라디오 변경 핸들러
  const handleRadioChange = (groupTitle: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupTitle]: value }));
  };

  // 체크박스 변경 핸들러 (객체 구조로 변경)
  const handleCheckboxChange = (
    groupTitle: string,
    value: string,
    maxSelection?: number,
  ) => {
    const currentSelections = (selectedOptions[groupTitle] || []) as {
      name: string;
      count: number;
    }[];
    const isExisting = currentSelections.some((item) => item.name === value);

    // 새로 추가하려는 경우에만 최대 개수 체크
    if (
      !isExisting &&
      maxSelection &&
      currentSelections.length >= maxSelection
    ) {
      alert(`최대 ${maxSelection}개까지 선택 가능합니다.`);
      return;
    }

    setSelectedOptions((prev) => {
      const current = (prev[groupTitle] || []) as {
        name: string;
        count: number;
      }[];
      const existingIdx = current.findIndex((item) => item.name === value);

      if (existingIdx > -1) {
        // 이미 있으면 제거
        return {
          ...prev,
          [groupTitle]: current.filter((item) => item.name !== value),
        };
      } else {
        // 새로 추가
        return {
          ...prev,
          [groupTitle]: [...current, { name: value, count: 1 }],
        };
      }
    });
  };

  // 수량 조절 핸들러 (미리 만들어두기)
  const _handleOptionCountChange = (
    groupTitle: string,
    value: string,
    delta: number,
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[groupTitle] as { name: string; count: number }[];
      return {
        ...prev,
        [groupTitle]: current.map((item) =>
          item.name === value
            ? { ...item, count: Math.max(1, item.count + delta) }
            : item,
        ),
      };
    });
  };

  const getAPIMenuData = async () => {
    try {
      const response = await getMenuData();
      setMenu(response);
    } catch (_error) {
      console.log("연결에 실패했습니다.");
    }
  };

  useEffect(() => {
    getAPIMenuData();
  }, []);

  useEffect(() => {
    if (mainCount < minMainCount) {
      setMainCount(minMainCount);
    } else if (mainCount > maxMainCount) {
      setMainCount(maxMainCount);
    }
  }, [mainCount, minMainCount, maxMainCount]);

  // menu 데이터 로깅 (사용 중임을 표시)
  useEffect(() => {
    if (menu && Object.keys(menu).length > 0) {
      console.log("Menu loaded:", menu);
    }
  }, [menu]);

  return (
    <div className="">
      {/* 상단 */}
      <div>
        {/* 캐러셀 되어야함. 또 이미지를 클릭하면 제대로 보이게 */}
        <div className="mb-[2em]">
          <CustomCarousel
            content={exImages}
            onClickItem={(index) => {
              setInitialCarouselIndex(index);
              setIsFullCarouselOpen(true);
            }}
          />
        </div>

        {/* 전체화면 모달 캐러셀 */}
        <ModalFullScreen
          isOpen={isFullCarouselOpen}
          onClose={() => setIsFullCarouselOpen(false)}
        >
          <div className="w-full max-w-4xl max-h-screen flex items-center justify-center">
            <CustomCarousel
              showIndex={false}
              content={exImages}
              initialIndex={initialCarouselIndex}
              aspectRatio="aspect-square"
              imageFit="contain"
              onIndexChange={(index) => setImageFullIndex(index)}
            />
          </div>
          <div className="absolute bottom-[2em] left-1/2 -translate-x-1/2 text-[#FFFFFF] z-[210] font-medium text-[1.125em] bg-black/30 px-[1em] py-[0.2em] rounded-full backdrop-blur-sm">
            {imageFullIndex + 1} / {exImages.length}
          </div>
        </ModalFullScreen>
        <div className="px-[1.25em]">
          <div className="mb-[1.25em]">
            <div
              className={`badge w-fit rounded-full text-[#FFFFFF] font-bold py-[0.125em] px-[1em] mb-[0.5em]`}
              // style={{ backgroundColor: product.badge_color }}
              style={{ backgroundColor: "#DA4352" }}
            >
              {/* {product.badge_content} */}
              인기
            </div>
            <h1 className="text-[1.625em] font-semibold mb-[0.625em]">
              리코타레몬파스타
            </h1>
            <p className="text-[1.25em] font-medium text-[#6C7A88]">
              상큼한 레몬과 부드러운 리코타 치즈가 어우러진 산뜻한 파스타
            </p>
          </div>
          <div className="flex justify-between items-center mb-[1em]">
            <h2 className="text-[1.5em] font-semibold">12,000원</h2>
            <div className="flex items-center bg-[#F2F3F6] rounded-[0.75em] py-[0.3125em]">
              {/* min 값 되면 작동안하게 */}
              <button
                className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em] ${minMainCount === mainCount ? "opacity-0" : ""}`}
                disabled={minMainCount >= mainCount}
                onClick={() =>
                  setMainCount(Math.max(minMainCount, mainCount - 1))
                }
              >
                <span className={`mb-1 `}>−</span>
              </button>

              <div className="bg-[#FFFFFF] h-[3em] w-[3em] rounded-[0.5em] shadow-sm shadow-[0_0.125em_0.25em_rgba(0,0,0,0.25)] min-w-[2.5em] flex items-center justify-center">
                <span className="text-[1.25em] font-semibold text-[#2D3436]">
                  {mainCount}
                </span>
              </div>

              {/* max 값 되면 작동안하게 */}
              <button
                className={`w-[2em] h-[2em] flex items-center justify-center text-[1.25em] ${maxMainCount === mainCount ? "opacity-0" : ""}`}
                disabled={maxMainCount <= mainCount}
                onClick={() =>
                  setMainCount(Math.min(maxMainCount, mainCount + 1))
                }
              >
                <span>+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 옵션 자세히보기 카테고리 */}
      <div className="grid grid-cols-12 w-full mb-[3.125em]">
        <div
          className={`w-full py-[0.625em] col-span-6 border-b-2 ${showWhere === "option" ? "border-b-[#222F4A]" : "border-b-[#B4B4B4]"}`}
          onClick={() => {
            setShowWhere("option");
          }}
        >
          <p
            className={`text-center font-bold text-[1.125em] ${showWhere === "option" ? "text-[#222F4A]" : "text-[#B4B4B4]"}`}
          >
            옵션
          </p>
        </div>
        <div
          className={`w-full py-[0.625em] col-span-6 border-b-2 ${showWhere === "detail" ? "border-b-[#222F4A]" : "border-b-[#B4B4B4]"}`}
          onClick={() => {
            setShowWhere("detail");
          }}
        >
          <p
            className={`text-center font-bold text-[1.125em] ${showWhere === "detail" ? "text-[#222F4A]" : "text-[#B4B4B4]"}`}
          >
            자세히 보기
          </p>
        </div>
      </div>
      {/* 옵션 및 자세히보기 box */}
      <div className="mb-[6em]">
        {showWhere === "option" ? (
          // 옵션
          <div className="px-[1.875em] space-y-[2em]">
            {optionGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="mb-[0.75em]">
                  <div className="flex items-center mb-[0.25em] gap-x-[0.88888889em]">
                    <h3 className="text-[1.125em] font-semibold inline-block">
                      {group.title}
                    </h3>
                    {group.required ? (
                      <span className="shrink-0 text-[0.875em] bg-[#FEF2F2] text-[#EF4444] font-semibold py-[0.25em] px-[0.625em] rounded-[0.625em]">
                        필수
                      </span>
                    ) : (
                      <span className="shrink-0 text-[0.875em] bg-[#F2F3F6] text-[#6C7A88] font-semibold py-[0.25em] px-[0.625em] rounded-[0.625em]">
                        선택
                      </span>
                    )}
                  </div>
                  {group.type === "checkbox" && group.maxSelection && (
                    <p className="text-[0.875em] text-[#6C7A88] font-medium">
                      {group.minSelection && group.minSelection > 0
                        ? `최소 ${group.minSelection}개, 최대 ${group.maxSelection}개 선택`
                        : `최대 ${group.maxSelection}개 선택`}
                    </p>
                  )}
                </div>
                <ul className="space-y-[0.3125em]">
                  {group.items.map((item, itemIdx) => {
                    const optionId = `group-${groupIdx}-item-${itemIdx}`;
                    const isSelected =
                      group.type === "radio"
                        ? selectedOptions[group.title] === item.name
                        : (
                            selectedOptions[group.title] as {
                              name: string;
                              count: number;
                            }[]
                          ).some((selected) => selected.name === item.name);

                    return (
                      <li key={optionId} className="w-full">
                        <label
                          className="w-full border border-[#B4B4B4] rounded-[0.375em] py-[0.75em] px-[1em] flex items-center justify-between"
                          htmlFor={optionId}
                        >
                          <div className="flex items-center">
                            <input
                              className="m-0 mr-[0.375em] w-[0.875em] h-[0.875em] accent-[#3182F6]"
                              type={group.type}
                              name={group.title}
                              id={optionId}
                              value={item.name}
                              checked={isSelected}
                              onChange={() =>
                                group.type === "radio"
                                  ? handleRadioChange(group.title, item.name)
                                  : handleCheckboxChange(
                                      group.title,
                                      item.name,
                                      group.maxSelection,
                                    )
                              }
                            />
                            <span
                              className={`text-[0.875em] font-bold ${
                                isSelected ? "text-[#3182F6]" : ""
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <span
                            className={`text-[0.875em] font-bold ${
                              isSelected ? "text-[#3182F6]" : ""
                            }`}
                          >
                            +{item.price.toLocaleString()}원
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : showWhere === "detail" ? (
          // 상세 정보
          <div className="">
            <img
              className="w-full object-contain"
              src="/img/menu-detail/detail_view_example.png"
              alt=""
            />
          </div>
        ) : null}
      </div>

      {/* 해당 페이지에서 필수 + 선택한 것의 총 합 가격이 누른 가격이 반영 되어야함 */}
      <button
        disabled={!isReadyToOrder}
        className={`text-[16px] fixed left-1/2 -translate-x-1/2 py-[0.46875em] bottom-[0.9375em] rounded-[0.46875em] w-[90%] max-w-[calc(400px*0.9)] flex justify-center items-center gap-x-[0.9375em] transition-colors ${
          isReadyToOrder ? "bg-[#222F4A]" : "bg-[#B4B4B4]"
        }`}
        onClick={() => {
          // 이버튼을 누르면 담기를 하면서 해당 메인 페이지인 목록으로 돌아가야하는군.
        }}
      >
        {/* 이 표시 갯수는 메인 수량 */}
        <span className="text-[1.25em] bg-[#FFFFFF] font-semibold w-[1.5em] h-[1.5em] flex justify-center items-center rounded-[0.3em]">
          {mainCount}
        </span>

        {/* 이 가격은 해당 페이지내 선택한 메뉴-옵션 + 메뉴-옵션 ... 의 가격 */}
        <span className="font-semibold text-[1.25em] text-[#FFFFFF]">
          {totalPrice.toLocaleString()}원 담기
        </span>
      </button>
    </div>
  );
}
