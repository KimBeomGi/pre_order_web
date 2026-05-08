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
