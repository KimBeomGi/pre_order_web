"use client";
import { BsDownload } from "react-icons/bs";

export default function PageReceiptDetail() {
  return (
    <div>
      <div className="flex flex-row items-center justify-end gap-x-[0.5em]">
        <p className="text-[1.25em] font-medium">주문내역 가리기</p>
        <div className="bg-[#E6E7EB] rounded-[0.25em] w-[1.5em] h-[1.5em] flex justify-center items-center">
          <BsDownload
            className="inline-block text-[1em]"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
