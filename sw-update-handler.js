/**
 * Service Worker Update Handler
 * Automatically handles SW updates and notifies users
 */

(function() {
    'use strict';

    // Check if Service Workers are supported
    if (!('serviceWorker' in navigator)) {
        console.log('Service Workers not supported');
        return;
    }

    let refreshing = false;

    /**
     * Register Service Worker
     */
    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // Check every hour

            // Listen for waiting worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New Service Worker found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('New Service Worker installed');
                        showUpdateNotification(registration);
                    }
                });
            });

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    /**
     * Show update notification to user
     */
    function showUpdateNotification(registration) {
        // Create notification banner
        const banner = document.createElement('div');
        banner.id = 'sw-update-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: 'Lato', sans-serif;
            animation: slideDown 0.3s ease-out;
        `;

        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-sync-alt" style="animation: spin 2s linear infinite;"></i>
                    <span><strong>Нова версія доступна!</strong> Оновіть сторінку для кращої роботи.</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="sw-update-btn" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 5px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-redo"></i> Оновити зараз
                    </button>
                    <button id="sw-dismiss-btn" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 1px solid white;
                        padding: 8px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                        Пізніше
                    </button>
                </div>
            </div>
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Append banner
        document.body.appendChild(banner);

        // Update button handler
        document.getElementById('sw-update-btn').addEventListener('click', () => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        });

        // Dismiss button handler
        document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
            banner.remove();
        });
    }

    /**
     * Listen for messages from Service Worker
     */
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            console.log(`Update available: ${event.data.version} (current: ${event.data.currentVersion})`);

            // Show console notification
            console.info(
                '%c🎉 Нова версія доступна! %c' + event.data.version,
                'background: #667eea; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;',
                'background: #764ba2; color: white; padding: 5px 10px; border-radius: 3px;'
            );
        }
    });

    /**
     * Handle controller change (new SW activated)
     */
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;

        console.log('New Service Worker activated, reloading page...');
        window.location.reload();
    });

    /**
     * Listen for SKIP_WAITING message
     */
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
    });

    /**
     * Initialize on page load
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerServiceWorker);
    } else {
        registerServiceWorker();
    }

    /**
     * Manual update check function (exposed globally)
     */
    window.checkForUpdates = async function() {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            console.log('Manually checking for updates...');
            await registration.update();
        }
    };

    /**
     * Manual cache clear function (exposed globally)
     */
    window.clearAllCaches = async function() {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('All caches cleared');

        // Unregister service worker
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
        console.log('Service Worker unregistered');

        // Reload page
        window.location.reload(true);
    };

    console.log('SW Update Handler initialized');
})();
