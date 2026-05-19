'use client';

import { useEffect, createContext, useContext, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, useSearchParams } from 'next/navigation';

// 다른 페이지나 컴포넌트에서 소켓을 쓸 수 있도록 Context 생성 (선택사항)
const StompContext = createContext<Client | null>(null);

export default function StompProvider({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const searchParams  = useSearchParams()
  const tid = searchParams.get('tableid')

  const store = params?.store as string
  
  const tokenId = useAuthStore((state) => state.tokenId)
  const roomMembers = useAuthStore((state) => state.roomMembers)
  const { setTokenId , setRoomMembers} = useAuthStore();

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    setTokenId(Math.floor(Math.random() * (100000000 -1 + 1)) + 1)

    // SSR 환경이 아닐 때만 실행되도록 useEffect 내부에서 초기화
    const client = new Client({
      brokerURL: 'ws://192.168.0.196:4000/ws-stomp', // Node.js 서버 주소
      debug: (str:string) => console.log('[STOMP]:', str),
      onConnect: () => {
        console.log('🤝 전역 STOMP 연결 성공!');
        
        client.subscribe(`/topic/${store}`, (msg:IMessage) => {
          const data = JSON.parse(msg.body)
          // 입장한 방의 인원수
          const roomMembers = data.roomMembers;
          setRoomMembers(Math.max(roomMembers, 0))
          // alert(`멤버수 ${roomMembers}`)
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