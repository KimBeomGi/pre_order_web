export interface StoreData {
  is_recommend: boolean;
  recommend: {
    img_src: string;
    product_name: string;
    price: number;
    discount_rate: number;
    id: number;
  }[];
  staff_menu: string[];
  categories: string[];
  store_info: {
    store_name: string;
    store_address: string;
    country_origin: string[];
  };
  notice: {
    status: string;
    title: string;
    message: string;
  }[];
  menu: {
    category: string;
    product_name: string;
    price: number;
    badge: boolean;
    badge_content: string;
    badge_color: string;
    discount_rate: number;
    description: string;
    img_src: string;
    is_soldout: boolean;
    id: number;
  }[];
}

/**
 * 영수증 전체 데이터 구조
 */
export interface ReceiptData {
  store_name: string; // 상호명 (예: 토스 카페)
  order_number: string; // 주문 번호 (예: 테-001)
  menus: ReceiptMenu[]; // 주문한 메뉴 목록
  summary: ReceiptSummary; // 결제 요약 정보
  footer: ReceiptFooter; // 하단 사업자 정보
}

/**
 * 개별 메뉴 아이템 정보
 */
export interface ReceiptMenu {
  product_name: string; // 메뉴명
  price: number; // 단가 (기본 가격)
  count: number; // 수량
  item_total: number; // 해당 항목 총 금액 (옵션 포함, 할인 전)
  discounts: ReceiptDiscount[]; // 할인 정보
  options: ReceiptOption[]; // 선택한 옵션 목록
}

/**
 * 할인 정보
 */
export interface ReceiptDiscount {
  content: string; // 할인 명칭 (예: 오픈 기념 10%, 시즌 음료 할인)
  amount: number; // 할인 금액 (양수값, UI에서 (-) 처리 필요)
}

/**
 * 메뉴 옵션 정보
 */
export interface ReceiptOption {
  name: string; // 옵션명 (예: ICE, 두배 사이즈업)
  price: number; // 옵션 추가 비용 (0원인 경우도 포함)
}

/**
 * 최종 결제 요약 정보
 */
export interface ReceiptSummary {
  order_amount: number; // 총 주문 금액 (상품가 + 옵션가 합계)
  discount_amount: number; // 총 할인 금액 합계
  final_amount: number; // 최종 결제 금액 (실제 카드 긁힌 금액)
}

/**
 * 사업자 정보 (Footer)
 */
export interface ReceiptFooter {
  company_name: string; // 상호명
  representative: string; // 대표자 성함
  business_number: string; // 사업자 등록 번호
  phone_number: string; // 대표 번호
  address: string; // 사업장 주소
}
