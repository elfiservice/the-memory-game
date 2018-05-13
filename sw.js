//let path = 'ND-Udacity-Front-End/projects/public_html/memory-game/';
let staticCacheName = 'mg-static-v1';

self.addEventListener('install', event => {
    console.log('installing  ' + staticCacheName);
  
    // cache a cat SVG
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {

            let arrayToCache = [
                
                'index.html',
                'images/bananaman.gif',
                'images/green-gobbler.png',
                'images/french-stucco.png',
                'js/app.js',
                'js/lib/fontawesome-all.min.js',
                'css/style.css',
                'sounds/card-clicked.wav',
                'sounds/cards-match.mp3',
                'sounds/cards-not-match.wav',
                'sounds/time-past-one-minute.wav'

            ];



            return cache.addAll(arrayToCache);
          })
    );
  });

  self.addEventListener('fetch', function(event) {
    // TODO: respond to requests for the root page with
    // the page skeleton from the cache

    // const normalizedUrl = new URL(event.request.url);
    // console.log(normalizedUrl);

  
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  