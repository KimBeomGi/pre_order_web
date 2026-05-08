"use client";
import { getMenuData } from "@/app/api/store";
import { use, useEffect, useState } from "react";

export default function MenuID({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const id = decodeURIComponent(resolvedParams.id);
  const [menu, setMenu] = useState({});
  const [mainCount, setMainCount] = useState(1);
  const [minMainCount, setMinMainCount] = useState(1);
  const [maxMainCount, setMaxMainCount] = useState(10);
  const [optionMinCount, setOptionMinCount] = useState({});
  const [optionMaxCount, setOptionMaxCount] = useState({});
  const [showWhere, setShowWhere] = useState("option");

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
      minSelection: 1,
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
      title: "추가 선택",
      type: "checkbox",
      required: false,
      minSelection: 0,
      maxSelection: 4,
      items: [
        { name: "치즈 추가", price: 1000 },
        { name: "베이컨 추가", price: 1500 },
        { name: "면 추가", price: 2000 },
        { name: "공기밥", price: 1000 },
      ],
    },
  ];

  // 옵션 상태 관리
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialState: { [key: string]: any } = {};
    optionGroups.forEach((group) => {
      if (group.type === "radio") {
        initialState[group.title] = group.items[0].name;
      } else {
        initialState[group.title] = [];
      }
    });
    return initialState;
  });

  // 라디오 변경 핸들러
  const handleRadioChange = (groupTitle: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupTitle]: value }));
  };

  // 체크박스 변경 핸들러 (객체 구조로 변경)
  const handleCheckboxChange = (groupTitle: string, value: string, maxSelection?: number) => {
    const currentSelections = (selectedOptions[groupTitle] || []) as { name: string; count: number }[];
    const isExisting = currentSelections.some((item) => item.name === value);

    // 새로 추가하려는 경우에만 최대 개수 체크
    if (!isExisting && maxSelection && currentSelections.length >= maxSelection) {
      alert(`최대 ${maxSelection}개까지 선택 가능합니다.`);
      return;
    }

    setSelectedOptions((prev) => {
      const current = (prev[groupTitle] || []) as { name: string; count: number }[];
      const existingIdx = current.findIndex((item) => item.name === value);

      if (existingIdx > -1) {
        // 이미 있으면 제거
        return { ...prev, [groupTitle]: current.filter((item) => item.name !== value) };
      } else {
        // 새로 추가
        return { ...prev, [groupTitle]: [...current, { name: value, count: 1 }] };
      }
    });
  };

  // 수량 조절 핸들러 (미리 만들어두기)
  const handleOptionCountChange = (groupTitle: string, value: string, delta: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupTitle] as { name: string; count: number }[];
      return {
        ...prev,
        [groupTitle]: current.map((item) =>
          item.name === value ? { ...item, count: Math.max(1, item.count + delta) } : item
        ),
      };
    });
  };

  const getAPIMenuData = async () => {
    try {
      const response = await getMenuData();
      setMenu(response);
    } catch (error) {
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
  }, [mainCount]);

  return (
    <div className="">
      {/* 상단 */}
      <div>
        {/* 캐러셀 되어야함. 또 이미지를 클릭하면 제대로 보이게 */}
        <div className="mb-[2.5em]">
          <div>
            <img
              className="w-full h-[25vh] object-cover"
              src="/img/menu-detail/ricotta_lemon_pasta_example.png"
              alt=""
              onClick={() => {
                // 이제 전체화면으로 해당 이미지 object-contain으로 해서 바탕은 검은색에 얘만 똑 보여주는 모달 그리고 당연히 그 안에서도 캐러셀 되어야함.
                // 캐러셀은 좌우로. 근데 따로 컴포넌트로 만들어서 사용하는게 더 좋겠다.
              }}
            />
          </div>
        </div>
        <div className="px-[1.25em]">
          <div className="mb-[1.25em]">
            <h1 className="text-[1.625em] font-semibold mb-[0.625em]">리코타레몬파스타</h1>
            <p className="text-[1.25em] font-medium text-[#6C7A88]">
              상큼한 레몬과 부드러운 리코타 치즈가 어우러진 산뜻한 파스타
            </p>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-[1.875em] font-semibold">12,000원</h2>
            <div className="flex items-center bg-[#F2F3F6] rounded-[0.75em] py-[0.3125em]">
              {/* min 값 되면 작동안하게 */}
              <button
                className="w-[2.5em] h-[2.5em] flex items-center justify-center text-[1.25em] text-[#6C7A88]"
                onClick={() =>
                  setMainCount(Math.max(minMainCount, mainCount - 1))
                }
              >
                <span className="mb-1">−</span>
              </button>

              <div className="bg-[#FFFFFF] h-[3.75em] w-[3.75em] rounded-[0.5em] shadow-sm shadow-[0_0.125em_0.25em_rgba(0,0,0,0.25)] min-w-[2.5em] flex items-center justify-center">
                <span className="text-[1.375em] font-semibold text-[#2D3436]">
                  {mainCount}
                </span>
              </div>

              {/* max 값 되면 작동안하게 */}
              <button
                className="w-[2.5em] h-[2.5em] flex items-center justify-center text-[1.25em] text-[#6C7A88]"
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
      <div>
        {showWhere === "option" ? (
          // 옵션
          <div className="px-[1.875em] mb-[10em] space-y-[2em]">
            {optionGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="mb-[0.75em]">
                  <div className="flex items-center mb-[0.25em]">
                    <h3 className="text-[1.125em] font-semibold inline-block mr-[0.88888889em]">
                      {group.title}
                    </h3>
                    {group.required ? (
                      <span className="bg-[#FEF2F2] text-[#EF4444] font-semibold py-[0.25em] px-[0.625em] rounded-[0.625em]">
                        필수
                      </span>
                    ) : (
                      <span className="bg-[#F2F3F6] text-[#6C7A88] font-semibold py-[0.25em] px-[0.625em] rounded-[0.625em]">
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
                        : (selectedOptions[group.title] as { name: string; count: number }[]).some(
                            (selected) => selected.name === item.name
                          );

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
                                      group.maxSelection
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
      <button className="fixed text-[1.25em] py-[0.8em] rounded-[0.5em] bg-[#222F4A] bottom-[1em] left-1/2 -translate-x-1/2 w-[380px] cursor-pointer">
        <span className="bg-[#FFFFFF] mr-[1.2em]">1</span>
        <span className="text-[#FFFFFF]">15,900원 담기</span>
      </button>
    </div>
  );
}
