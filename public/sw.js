const CACHE_NAME = 'lingualexis-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add more static assets as needed
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline vocabulary additions, study progress, etc.
      syncOfflineData()
    );
  }
});

// Push notifications for study reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your language study session!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'study-reminder',
    actions: [
      {
        action: 'study-now',
        title: 'Study Now',
        icon: '/icons/study-icon.png'
      },
      {
        action: 'remind-later',
        title: 'Remind Me Later',
        icon: '/icons/clock-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LinguaLexis Study Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'study-now') {
    event.waitUntil(
      clients.openWindow('/?action=study')
    );
  } else if (event.action === 'remind-later') {
    // Schedule another reminder
    scheduleReminder(30 * 60 * 1000); // 30 minutes later
  } else {
    // Default click - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await syncAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getOfflineActions() {
  // This would interact with IndexedDB to get offline actions
  return [];
}

async function syncAction(action) {
  // This would sync the action with the server
  console.log('Syncing action:', action);
}

async function removeOfflineAction(actionId) {
  // This would remove the action from IndexedDB
  console.log('Removing offline action:', actionId);
}

function scheduleReminder(delay) {
  // Schedule a notification reminder
  setTimeout(() => {
    self.registration.showNotification('LinguaLexis Study Reminder', {
      body: 'Ready to continue your language learning journey?',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'study-reminder'
    });
  }, delay);
}