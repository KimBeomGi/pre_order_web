"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "@/app/actions";
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      
      // 페이지 로드가 완전히 완료된 후에 서비스 워커를 등록하여 초기 성능 저하 방지
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        const handleLoad = () => registerServiceWorker();
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      // 중요: subscription 객체를 순수 JSON 데이터로 변환합니다.
      const serializedSub = JSON.parse(JSON.stringify(subscription));
      // 변환된 데이터를 서버 액션으로 보냅니다.
      await sendNotification(message, serializedSub);
      // await sendNotification(message, subscription);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button
            className="cursor-pointer border-2 border-black"
            onClick={unsubscribeFromPush}
          >
            Unsubscribe
          </button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="cursor-pointer border-2 border-black"
            onClick={sendTestNotification}
          >
            Send Test
          </button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button
            className="cursor-pointer border-2 border-black"
            onClick={subscribeToPush}
          >
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}

// function InstallPrompt() {
//   const [isIOS, setIsIOS] = useState(false);
//   const [isStandalone, setIsStandalone] = useState(false);
//   const [deferredPrompt, setDeferredPrompt] =
//     useState<BeforeInstallPromptEvent | null>(null);
//   function installPWA() {
//     if (deferredPrompt) {
//       alert("설치가 돼요");
//       deferredPrompt?.prompt();
//     } else {
//       alert("설치가 안돼요.");
//     }
//   }

//   useEffect(() => {
//     window.addEventListener("beforeinstallprompt", (event) => {
//       event.preventDefault();
//       setDeferredPrompt(event as BeforeInstallPromptEvent);
//     });
//     setIsIOS(
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
//     );

//     setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
//   }, []);

//   if (isStandalone) {
//     return null; // Don't show install button if already installed
//   }

//   return (
//     <div>
//       <h3 className="text-2xl">Install App</h3>
//       <button
//         className="text-[20px] w-fit pt-1.5 cursor-pointer border-2 border-gray-500"
//         onClick={() => installPWA()}
//       >
//         Add to Home Screen
//       </button>
//       {isIOS && (
//         <p>
//           To install this app on your iOS device, tap the share button
//           <span role="img" aria-label="share icon">
//             {" "}
//             ⎋{" "}
//           </span>
//           and then "Add to Home Screen"
//           <span role="img" aria-label="plus icon">
//             {" "}
//             ➕{" "}
//           </span>
//           .
//         </p>
//       )}
//     </div>
//   );
// }
export function InstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // 이때 비로소 배너가 화면에 나타남!
    });
  }, []);

  if (!deferredPrompt){
    return null; // 설치 불가능할 땐 아예 안 보임
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 shadow-xl rounded-2xl border flex justify-between items-center animate-bounce-in">
      <div>
        <p className="font-bold">앱으로 더 편하게 이용하세요</p>
        <p className="text-sm text-gray-500">
          홈 화면에 추가하고 알림을 받아보세요.
        </p>
      </div>
      <button
        onClick={() => deferredPrompt.prompt()}
        className="bg-black text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
      >
        설치하기
      </button>
    </div>
  );
}