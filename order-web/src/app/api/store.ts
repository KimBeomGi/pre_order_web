import axios from "axios";
import storeData from "@/temp_data/storeData.json"
import menuData from "@/temp_data/menuData.json"

export async function getStoreData() {
  try {
    // const res = await axios.get("https://api.example.com/data");
    const res = storeData
    return storeData;
  } catch (error) {
    console.error("가게 데이터 불러오기 실패:", error);
    throw error;
  }
}

export async function getMenuData() {
  try {
    // const res = await axios.get("https://api.example.com/data");
    const res = menuData
    return menuData;
  } catch (error) {
    console.error("가게 데이터 불러오기 실패:", error);
    throw error;
  }
}

