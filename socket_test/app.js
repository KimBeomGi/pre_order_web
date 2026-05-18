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

// 3. STOMP 서버 설정 (이게 핵심!)
const stompServer = new StompServer({
  server: server,
  path: '/ws-stomp', // Next.js가 찾아올 통로 이름
  debug: (cmd, extra) => {
    console.log(`[STOMP Debug] ${cmd} ${extra || ''}`);
  }        // 터미널에 메시지 흐름을 보여줍니다
});

// 4. 메시지 중계 로그 확인 (이벤트 리스너 방식으로 변경)
// 클라이언트가 어떤 경로로든 메시지를 보냈을 때(SEND) 작동합니다.
// app.js 의 4번 항목을 이 안전한 코드로 교체해 주세요!

// 1. 구독(SUBSCRIBE) 이벤트 리스너 안전화
stompServer.on('subscribe', (...args) => {
  try {
    // 들어온 인자들을 통째로 확인하기 위해 로깅
    // 만약 첫 번째 인자가 객체고 headers가 있다면 거기서 추출
    const msg = args[0];
    if (msg && msg.headers) {
      const channel = msg.headers.destination || 'unknown';
      const clientId = msg.headers.id || 'unknown';
      console.log(`[구독 발생] 클라이언트[${clientId}]가 [${channel}] 경로를 구독함`);
    } else {
      // 구조가 다르게 들어오면 안전하게 날것의 데이터를 출력
      console.log(`[구독 발생] 데이터:`, args);
    }
  } catch (error) {
    console.log('[구독 로그 에러] 로그 출력 중 에러가 났으나 서버는 죽지 않습니다.');
  }
});

// 2. 메시지 전송(SEND) 이벤트 리스너 안전화
stompServer.on('send', (...args) => {
  try {
    const msg = args[0];
    if (msg && msg.headers) {
      const destination = msg.headers.destination || 'unknown';
      const body = msg.body || '';
      console.log(`[메시지 전송] 경로: ${destination} -> 내용: ${body}`);
    } else {
      console.log(`[메시지 전송] 데이터:`, args);
    }
  } catch (error) {
    console.log('[송신 로그 에러] 로그 출력 중 에러가 났으나 서버는 죽지 않습니다.');
  }
});

// 5. 실행 (app.listen 대신 server.listen을 씁니다)
server.listen(port, () => {
  console.log(`🚀 STOMP 브로커가 http://localhost:${port} 에서 대기 중!`);
  console.log(`🔌 Next.js 연결 엔드포인트: ws://localhost:${port}/ws-stomp`);
});