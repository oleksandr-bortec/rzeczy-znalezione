/**
 * Service Worker for Rzeczy Znalezione PWA
 * Version: 2.0.8 (Auto-update enabled + Lazy loading)
 */

const VERSION = '2.0.8';
const CACHE_NAME = `rzeczy-znalezione-v${VERSION}`;
const STATIC_CACHE = `static-v${VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${VERSION}`;

// Development mode - disable aggressive caching
const IS_DEVELOPMENT = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// Auto-update check interval (every 1 second for testing, 5 minutes for production)
const UPDATE_CHECK_INTERVAL = IS_DEVELOPMENT ? 1000 : 5 * 60 * 1000;

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/public.html',
    '/profile.html',
    '/admin.html',
    '/styles.css',
    '/public.css',
    '/app.js',
    '/api.js',
    '/search.js',
    '/admin.js',
    '/i18n.js',
    '/manifest.json',
    '/schema.json',
    '/favicon.svg',
    '/icons/icon-192.svg',
    '/icons/icon-512.svg',
    '/icons/badge-72.svg',
    '/images/godlo-polski.png',
    // External CDN resources
    'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
    // Note: Leaflet is lazy-loaded when map view is used
];

// API endpoints to cache with network-first strategy
const API_CACHE_URLS = [
    '/api/items',
    '/api/stats'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log(`[SW v${VERSION}] Installing service worker...`);

    // In development, skip caching and activate immediately
    if (IS_DEVELOPMENT) {
        console.log('[SW] Development mode - skipping cache');
        event.waitUntil(self.skipWaiting());
        return;
    }

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_FILES.map(url => {
                    // Handle external URLs
                    if (url.startsWith('http')) {
                        return new Request(url, { mode: 'cors' });
                    }
                    return url;
                })).catch(err => {
                    console.warn('[SW] Some assets failed to cache:', err);
                });
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
    );
});

/**
 * Activate event - clean old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => {
                            return name !== STATIC_CACHE &&
                                   name !== DYNAMIC_CACHE &&
                                   name !== CACHE_NAME;
                        })
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                // Start periodic update checks
                if (!IS_DEVELOPMENT) {
                    startPeriodicUpdateCheck();
                }
                return self.clients.claim();
            })
    );
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] SKIP_WAITING requested, activating new SW...');
        self.skipWaiting();
    }
});

/**
 * Periodic update check - checks for new SW version
 */
let updateCheckTimer = null;

function startPeriodicUpdateCheck() {
    // Clear any existing timer
    if (updateCheckTimer) {
        clearInterval(updateCheckTimer);
    }

    // Initial check
    checkForUpdates();

    // Set up periodic checks
    updateCheckTimer = setInterval(() => {
        checkForUpdates();
    }, UPDATE_CHECK_INTERVAL);

    console.log(`[SW] Update check scheduled every ${UPDATE_CHECK_INTERVAL / 1000}s`);
}

/**
 * Check for service worker updates
 */
async function checkForUpdates() {
    try {
        console.log('[SW] Checking for updates...');

        // Fetch version info from server
        const response = await fetch('/api/version', {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`[SW] Server version: ${data.version}, Current version: ${VERSION}`);

            // If server version differs, trigger update
            if (data.version && data.version !== VERSION) {
                console.log(`[SW] New version available: ${data.version} (current: ${VERSION})`);

                // Notify all clients about update
                const clients = await self.clients.matchAll();
                console.log(`[SW] Notifying ${clients.length} clients about update`);

                clients.forEach(client => {
                    client.postMessage({
                        type: 'UPDATE_AVAILABLE',
                        version: data.version,
                        currentVersion: VERSION
                    });
                });

                // Note: We don't call skipWaiting() here anymore
                // It will be called when user clicks "Update Now" button
            } else {
                console.log('[SW] Already on latest version');
            }
        }
    } catch (error) {
        console.warn('[SW] Update check failed:', error);
    }
}

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // In development mode - always use network first
    if (IS_DEVELOPMENT) {
        event.respondWith(
            fetch(request).catch(() => {
                // Fallback to cache only if network fails
                return caches.match(request);
            })
        );
        return;
    }

    // API requests - network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Static assets - cache first, network fallback
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }

    // HTML pages - network first with cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Default - stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
});

/**
 * Cache-first strategy
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network-first strategy
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
        }

        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            console.warn('[SW] Fetch failed for:', request.url, error);
            return cachedResponse || new Response('Network error', { status: 503 });
        });

    return cachedResponse || fetchPromise;
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Background sync for offline form submissions
 */
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-items') {
        event.waitUntil(syncItems());
    }
});

/**
 * Sync pending items
 */
async function syncItems() {
    try {
        const db = await openIndexedDB();
        const pendingItems = await getPendingItems(db);

        for (const item of pendingItems) {
            try {
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.data)
                });

                if (response.ok) {
                    await deletePendingItem(db, item.id);
                    console.log('[SW] Synced item:', item.id);
                }
            } catch (error) {
                console.error('[SW] Failed to sync item:', item.id, error);
            }
        }
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

/**
 * Push notifications
 */
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event.data?.text());

    const data = event.data?.json() || {
        title: 'Rzeczy Znalezione',
        body: 'Nowe powiadomienie',
        icon: '/icons/icon-192.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icons/icon-192.png',
            badge: '/icons/badge-72.png',
            tag: data.tag || 'default',
            data: data.data
        })
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    const url = event.notification.data?.url || '/';
                    return clients.openWindow(url);
                }
            })
    );
});

/**
 * IndexedDB helpers for offline storage
 */
function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RzeczyZnalezioneOffline', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pendingItems')) {
                db.createObjectStore('pendingItems', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

function getPendingItems(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pendingItems'], 'readonly');
        const store = transaction.objectStore('pendingItems');
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function deletePendingItem(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pendingItems'], 'readwrite');
        const store = transaction.objectStore('pendingItems');
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

console.log('[SW] Service worker loaded');
