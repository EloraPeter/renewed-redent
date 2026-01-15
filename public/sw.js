// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title || 'MochiDo Reminder 🐹';
  const options = {
    body: data.body || 'You have an upcoming event!',
    icon: '/icon-192.png',           // add your icons
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },  // optional deep link
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});