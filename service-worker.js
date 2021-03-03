importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const CACHE_NAME = "bundesliga-standing-v1";
var urlsToCache = [
    { url: "/", revision: 1 },
    { url: "/manifest.json", revision: 1 },
    { url: "/index.html", revision: 1 },
    { url: "/nav.html", revision: 1 },
    { url: "/pages/favorite.html", revision: 1 },
    { url: "/pages/standing.html", revision: 1 },
    { url: "/pages/team.html", revision: 1 },
    { url: "/assets/css/materialize.min.css", revision: 1 },
    { url: "/assets/css/style.css", revision: 1 },
    { url: "/assets/img/icon/android-icon-192x192.png", revision: 1 },
    { url: "/assets/img/icon/android-icon-512x512.png", revision: 1 },
    { url: "/assets/img/icon/apple-touch-icon.png", revision: 1 },
    { url: "/assets/img/icon/favicon.ico", revision: 1 },
    { url: "/assets/img/no_image.png", revision: 1 },
    { url: "/assets/js/api.js", revision: 1 },
    { url: "/assets/js/dbHelper.js", revision: 1 },
    { url: "/assets/js/main.js", revision: 1 },
    { url: "/assets/js/materialize.min.js", revision: 1 },
    { url: "/assets/js/nav.js", revision: 1 },
    { url: "/assets/js/push.js", revision: 1 },
    // "/assets/js/script.js",
    { url: "/node_modules/idb/lib/idb.js", revision: 1 }
];

if (workbox) {
    workbox.precaching.precacheAndRoute(urlsToCache);

    workbox.routing.registerRoute(
        new RegExp('https://cors-anywhere.herokuapp.com/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: CACHE_NAME
        })
    );

    workbox.routing.registerRoute(
        new RegExp('https://upload.wikimedia.org/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: CACHE_NAME
        })
    );
} else {
    console.error('Workbox gagal dimuat!');
}


self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'img/notification.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
