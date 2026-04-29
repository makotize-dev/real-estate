/**
 * 宅建士 学習ノート — Service Worker
 * オフライン時でもアプリを使えるようにするためのキャッシュ管理
 */

const CACHE_NAME = 'takken-notes-v2';

// キャッシュするローカルファイル（事前キャッシュ）
const LOCAL_ASSETS = [
    './study_notes.html',
    './exam_v6.html',
    './roadmap.html',
    './study_log.html',
    './manifest.json',
    './icon.svg',
];

// ネットワーク優先にするHTML（頻繁に更新されるページ）
const NETWORK_FIRST = [
    './study_log.html',
];

// キャッシュする外部リソース（Tailwind CDN）
const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
];

// ── インストール: アセットを事前キャッシュ ──
self.addEventListener('install', event => {
    self.skipWaiting(); // 即座にアクティベート
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // ローカルファイルは必須キャッシュ（失敗したらインストール失敗）
            return cache.addAll(LOCAL_ASSETS).catch(err => {
                console.warn('[SW] 一部ファイルのキャッシュに失敗:', err);
            });
        })
    );
});

// ── アクティベート: 古いキャッシュを削除 ──
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// ── フェッチ: キャッシュ戦略 ──
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // GETリクエスト以外は素通し
    if (request.method !== 'GET') return;

    // 外部CDN: キャッシュ優先 → なければネットワーク → ネットワーク失敗時はキャッシュ
    if (url.origin !== location.origin) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(request).then(cached => {
                    const networkFetch = fetch(request)
                        .then(response => {
                            if (response.ok) {
                                cache.put(request, response.clone());
                            }
                            return response;
                        })
                        .catch(() => cached); // オフライン時はキャッシュを返す
                    return cached || networkFetch;
                })
            )
        );
        return;
    }

    // ネットワーク優先ページ（study_log.html など頻繁に更新されるもの）
    const pathname = url.pathname;
    const isNetworkFirst = NETWORK_FIRST.some(p => pathname.endsWith(p.replace('./', '')));

    if (isNetworkFirst) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request)) // オフライン時はキャッシュを使う
        );
        return;
    }

    // それ以外のローカルファイル: キャッシュ優先 → なければネットワーク
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request)
                .then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    // オフライン & キャッシュなし → study_notes.html を返す
                    return caches.match('./study_notes.html');
                });
        })
    );
});
