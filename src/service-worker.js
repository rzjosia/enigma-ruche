/* eslint-disable */

if (workbox) {
    workbox.precaching.precacheAndRoute(self.__precacheManifest);
    workbox.routing.registerNavigationRoute("/index.html");
  
    // All css
    workbox.routing.registerRoute(
      ({ request }) => request.destination === "style",
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: "cache-css"
      })
    )
    // Google fonts
    workbox.routing.registerRoute(
      ({ url }) => url.origin === "https://fonts.gstatic.com",
      new workbox.strategies.CacheFirst({
        cacheName: "google-fonts-cache",
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 30
          })
        ]
      })
    )
    // Material design fonts
    workbox.routing.registerRoute(
      ({ url }) => url.origin === "https://cdn.jsdelivr.net" && url.pathname.startsWith("/npm/@mdi/font@latest/"),
      new workbox.strategies.CacheFirst({
        cacheName: "mdi-fonts-cache",
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 30
          })
        ]
      })
    )
    // Images
    workbox.routing.registerRoute(
      ({ url, request }) => url.origin === "https://robohash.org" && request.destination === "image",
      new workbox.strategies.CacheFirst({
        cacheName: "users-pictures",
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
            maxEntries: 30
          })
        ]
      })
    )
  }
  
  self.addEventListener("message", (event) => {
    if (event.data) {
      switch (event.data) {
        case "please-update":
          self.skipWaiting();
          break;
        default:
          break;
      }
    }
  })