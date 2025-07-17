'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New update available
                    if (confirm('New version available! Reload to update?')) {
                      window.location.reload();
                    }
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // Handle PWA install prompt
      let deferredPrompt: any;

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button after a delay
        setTimeout(() => {
          showInstallPromotion();
        }, 60000); // Show after 1 minute
      });

      // Handle app installation
      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        hideInstallPromotion();
      });

      function showInstallPromotion() {
        if (!deferredPrompt) return;

        const installBanner = document.createElement('div');
        installBanner.id = 'install-banner';
        installBanner.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 12px 16px;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                📚
              </div>
              <div>
                <div style="font-weight: 600; font-size: 14px;">Install LinguaLexis</div>
                <div style="font-size: 12px; opacity: 0.9;">Get the full app experience with offline support</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="install-button" style="
                background: white;
                color: #4f46e5;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12px;
                cursor: pointer;
              ">Install</button>
              <button id="dismiss-button" style="
                background: transparent;
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12px;
                cursor: pointer;
              ">Later</button>
            </div>
          </div>
        `;

        document.body.appendChild(installBanner);

        // Install button handler
        document.getElementById('install-button')?.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            hideInstallPromotion();
          }
        });

        // Dismiss button handler
        document.getElementById('dismiss-button')?.addEventListener('click', () => {
          hideInstallPromotion();
        });
      }

      function hideInstallPromotion() {
        const banner = document.getElementById('install-banner');
        if (banner) {
          banner.remove();
        }
      }

      // Request notification permission for study reminders
      if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
          if (confirm('Enable notifications to get study reminders?')) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                // Set up daily study reminders
                scheduleStudyReminders();
              }
            });
          }
        }, 30000); // Ask after 30 seconds
      }

      function scheduleStudyReminders() {
        // Schedule daily study reminder (this would be better handled by the server/background sync)
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(19, 0, 0, 0); // 7 PM tomorrow

        const timeUntilReminder = tomorrow.getTime() - now.getTime();

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('LinguaLexis Study Reminder', {
              body: 'Time for your daily language practice! 📚',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              tag: 'daily-reminder',
              actions: [
                { action: 'study', title: 'Study Now' },
                { action: 'later', title: 'Remind Later' }
              ]
            });
          }
        }, timeUntilReminder);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}