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
  debug: true        // 터미널에 메시지 흐름을 보여줍니다
});

// 4. 메시지 중계 로그 확인 (테스트용)
stompServer.subscribe('/topic/**', (msg, headers) => {
  console.log(`[메시지 전송] 경로: ${headers.destination} -> 내용: ${msg}`);
});

// 5. 실행 (app.listen 대신 server.listen을 씁니다)
server.listen(port, () => {
  console.log(`🚀 STOMP 브로커가 http://localhost:${port} 에서 대기 중!`);
});