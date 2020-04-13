var VERSON = 'v1';

//缓存
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(VERSON).then(cache => {
            return cache.addAll([
                './start.html',
                './jquery.min.js',
                './wx.png'
            ])
        })
    )
})

//缓存更新
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== VERSON) {
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})

//捕获请求并返回缓存数据
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).catch(() => {
        return fetch(event.request);
    })).then(response => {
        caches.open(VERSON).then(cache => {
            cache.put(event.request, response);
        })
        return response.clone();
    }).catch(() => {
        return caches.match('./static/wx.png')
    })
})