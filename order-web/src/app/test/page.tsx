"use client";
import {
  PushNotificationManager,
  InstallPrompt,
} from "@/components/PWAInitializer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCounterStore } from '@/store/userCounterStore';


export default function Test() {
  const count = useCounterStore((state) => state.count)
  const { incrementOne, incrementNum, decrementOne,decrementNum,clearNum } = useCounterStore();
  const plusNum = 3
  const minusNum = 2

  return (
    <div className="">
      <div>
        <h1 className="text-3xl">1개씩</h1>
        <h2>{count}</h2>
        <button className="border-2 border-gray-700 p-1" onClick={() => {incrementOne()}}>+1</button>
        <button className="border-2 border-gray-700 p-1" onClick={() => {decrementOne()}}>-1</button>
        <button className="border-2 border-gray-700 p-1" onClick={() => {incrementNum(plusNum)}}>+{plusNum}</button>
        <button className="border-2 border-gray-700 p-1" onClick={() => {decrementNum(minusNum)}}>-{minusNum}</button>
      </div>
      <div>
        <button className="border-2 border-gray-700 py-4 px-8" onClick={() => {clearNum()}}>숫자 초기화</button>
      </div>
      <PushNotificationManager/>
      <InstallPrompt/>
    </div>
  )
}
