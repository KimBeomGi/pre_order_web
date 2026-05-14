import storeData from "@/temp_data/storeData.json";
import menuData from "@/temp_data/menuData.json";
import receiptData from "@/temp_data/receiptData.json";
import axios from "axios";
import { ReceiptData } from "@/types/store";

// 가게 메뉴 리스트 + 가게데이터
// export async function getStoreData(storeId, tableId) {
export async function getStoreData() {
  try {
    // const response = await axios.get(`해당주소/${store}/${tableId}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return response.data
    return storeData;
  } catch (error) {
    console.error("가게 데이터 불러오기 실패:", error);
    throw error;
  }
}

// 메뉴 상세
export async function getMenuData() {
  try {
    // const response = await axios.get(`해당주소/${store}/${tableId}/${menuID}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return response.data
    return menuData;
  } catch (error) {
    console.error("가게 데이터 불러오기 실패:", error);
    throw error;
  }
}

// 영수증 데이터
export async function getReceiptData(receiptId: number):Promise<ReceiptData> {
  try {
    // const response = await axios.get(`해당주소/${receiptId}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return response.data
    return receiptData;
  } catch (error) {
    console.error("가게 데이터 불러오기 실패:", error);
    throw error;
  }
}
