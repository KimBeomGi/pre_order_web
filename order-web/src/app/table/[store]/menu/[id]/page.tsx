"use client";
import {
  PushNotificationManager,
  InstallPrompt,
} from "@/components/PWAInitializer";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useCounterStore } from "@/store/userCounterStore";

export default function MenuID({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const store = decodeURIComponent(resolvedParams.store);
  const id = decodeURIComponent(resolvedParams.id);


  return (
    <div className="">
      <div>
        <h1>{store}</h1>
        <h2>메뉴 id {id}</h2>
      </div>
    </div>
  );
}
