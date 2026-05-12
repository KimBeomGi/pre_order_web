// 서비스 워커
const CACHE_NAME = 'genie-order-v1';

// 캐싱할 최소한의 자산
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('push', function (event) {
  console.log('[Service Worker] 푸시 알림 수신');
  if (event.data) {
    const data = event.data.json()
    console.log('[Service Worker] 수신된 데이터:', data); 
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] 알림 클릭됨');
  event.notification.close()
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
  //   event.waitUntil(clients.openWindow('/'))
  console.log('[Service Worker] 이동할 URL:', urlToOpen);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 이미 해당 페이지가 열려 있다면 포커스만 이동
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url === urlToOpen && 'focus' in client) {
          console.log('[Service Worker] 기존 탭 포커스');
          return client.focus()
        }
      }
      // 열려 있지 않다면 새 창으로 열기
      if (clients.openWindow) {
        console.log('[Service Worker] 새 창 열기:', urlToOpen);
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API 요청, POST 요청, 크롬 확장 프로그램 요청은 캐싱 제외
  if (
    url.pathname.startsWith('/api/') || 
    event.request.method !== 'GET' ||
    url.protocol === 'chrome-extension:'
  ) {
    return;
  }

  // 2. 정적 자산 및 페이지에 대해 Stale-While-Revalidate 전략 적용
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 유효한 응답인 경우 캐시 업데이트
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 네트워크 실패 시 캐시된 응답 반환 (오프라인 지원)
        return cachedResponse;
      });

      // 캐시된 응답이 있으면 즉시 반환, 없으면 네트워크 응답 대기
      return cachedResponse || fetchPromise;
    })
  );
});