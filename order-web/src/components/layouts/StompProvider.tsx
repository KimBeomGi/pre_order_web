'use client';

import { useEffect, createContext, useContext, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';

// 다른 페이지나 컴포넌트에서 소켓을 쓸 수 있도록 Context 생성 (선택사항)
const StompContext = createContext<Client | null>(null);

export default function StompProvider({ children }: { children: React.ReactNode }) {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // SSR 환경이 아닐 때만 실행되도록 useEffect 내부에서 초기화
    const client = new Client({
      brokerURL: 'ws://localhost:4000/ws-stomp', // Node.js 서버 주소
      debug: (str:string) => console.log('[STOMP]:', str),
      onConnect: () => {
        console.log('🤝 전역 STOMP 연결 성공!');
        
        // [테스트] 연결되자마자 전역 알림 채널 구독하기
        client.subscribe('/topic/global-notice', (msg:IMessage) => {
          alert(`[전역 알림] ${msg.body}`);
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <StompContext.Provider value={stompClientRef.current}>
      {children}
    </StompContext.Provider>
  );
}

// 다른 곳에서 꺼내 쓸 수 있는 훅
export const useStomp = () => useContext(StompContext);