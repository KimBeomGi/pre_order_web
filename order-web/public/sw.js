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

self.addEventListener('fetch', (event) => { })