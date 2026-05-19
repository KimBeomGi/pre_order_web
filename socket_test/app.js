const express = require('express');
const http = require('http'); // 소켓을 얹기 위해 필요해요
const StompServer = require('stomp-broker-js');

const app = express();
const port = 4000;

// 1. 일반 웹 서버 (브라우저 확인용)
app.get('/', (req, res) => {
  res.send('<h1>STOMP 서버 작동 중!</h1>');
});

// 2. HTTP 서버 생성 (Express를 감싸줍니다)
const server = http.createServer(app);

const roomCounts = {};
const sessionMap = {}; // sessionId -> channel(topic) 매핑 저장

// 3. STOMP 서버 설정 (이게 핵심!)
const stompServer = new StompServer({
  server: server,
  path: '/ws-stomp', // Next.js가 찾아올 통로 이름
  debug: (cmd, extra) => {
    console.log(`[STOMP Debug] ${cmd} ${extra || ''}`);
  }        // 터미널에 메시지 흐름을 보여줍니다
});

// 4. 메시지 중계 로그 확인 (이벤트 리스너 방식으로 변경)

// 1. 구독(SUBSCRIBE) 이벤트 리스너
stompServer.on('subscribe', (msg) => {
  try {
    if (msg && msg.topic) {
      const channel = msg.topic;
      const sessionId = msg.sessionId;

      console.log(`[구독 발생] 세션[${sessionId}]이 [${channel}] 경로를 구독함`);

      // 세션이 어떤 채널을 구독 중인지 기억
      sessionMap[sessionId] = channel;

      if (!roomCounts[channel]) {
        roomCounts[channel] = 0;
      }
      roomCounts[channel] += 1;

      console.log(`[구독+] ${channel} 방에 ${roomCounts[channel]}명`);

      stompServer.send(channel, {}, JSON.stringify({
        type: "PRESENCE_COUNT",
        roomMembers: roomCounts[channel]
      }));
    }
  } catch (error) {
    console.log('[구독 로그 에러]', error);
  }
});

// 2. 메시지 전송(SEND) 이벤트 리스너
stompServer.on('send', (msg) => {
  try {
    if (msg) {
      const destination = msg.topic || 'unknown';
      const body = msg.body || '';
      console.log(`[메시지 전송] 경로: ${destination} -> 내용: ${body}`);
    }
  } catch (error) {
    console.log('[송신 로그 에러]');
  }
});

// 3. 구독 취소(UNSUBSCRIBE) 이벤트 리스너
stompServer.on("unsubscribe", (msg) => {
  try {
    if (msg && msg.topic) {
      const channel = msg.topic;
      const sessionId = msg.sessionId;

      if (roomCounts[channel] > 0) {
        roomCounts[channel] -= 1;
      }

      delete sessionMap[sessionId]; // 매핑 삭제

      console.log(`[구독 취소] ${channel} 방에 ${roomCounts[channel]}명`);
      stompServer.send(channel, {}, JSON.stringify({
        type: "PRESENCE_COUNT",
        roomMembers: roomCounts[channel]
      }));
    }
  } catch (error) {
    console.log('[구독 취소 에러]');
  }
});

// 4. 연결 종료(DISCONNECTED) 이벤트 리스너
// ★중요: 탭을 닫거나 새로고침하면 이 이벤트가 발생합니다.
stompServer.on("disconnected", (sessionId) => {
  try {
    // 1. 해당 세션이 어느 방에 있었는지 찾기
    const channel = sessionMap[sessionId];

    if (channel) {
      console.log(`[연결 종료] 세션[${sessionId}]이 [${channel}]에서 나감`);

      // 2. 인원수 감소
      if (roomCounts[channel] > 0) {
        roomCounts[channel] -= 1;
      }

      // 3. 매핑 데이터 삭제
      delete sessionMap[sessionId];

      console.log(`[연결 종료-] ${channel} 방에 ${roomCounts[channel]}명`);

      // 4. 남은 사람들에게 알림
      stompServer.send(channel, {}, JSON.stringify({
        type: "PRESENCE_COUNT",
        roomMembers: roomCounts[channel]
      }));
    }
  } catch (error) {
    console.log('[연결 종료 에러]', error);
  }
});

// 5. 실행 (app.listen 대신 server.listen을 씁니다)
server.listen(port, () => {
  console.log(`🚀 STOMP 브로커가 http://localhost:${port} 에서 대기 중!`);
  console.log(`🔌 Next.js 연결 엔드포인트: ws://localhost:${port}/ws-stomp`);
});