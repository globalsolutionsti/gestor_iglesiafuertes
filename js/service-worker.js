self.addEventListener('install',e=>{

e.waitUntil(

caches.open('iglesia-cache').then(cache=>{

return cache.addAll([

'/',
'/index.html',
'/dashboard.html',
'/css/styles.css'

]);

})

);

});

self.addEventListener('fetch',e=>{

e.respondWith(

caches.match(e.request).then(response=>{

return response || fetch(e.request);

})

);

});
