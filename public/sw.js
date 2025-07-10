// Service Worker for handling CORS requests
self.addEventListener('fetch', (event) => {
  // Only handle Firebase Storage requests
  if (event.request.url.includes('firebasestorage.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response before modifying headers
          const modifiedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
              ...response.headers,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-goog-meta-*',
            }
          });
          return modifiedResponse;
        })
        .catch(error => {
          return new Response('Service Worker Error', { status: 500 });
        })
    );
  }
});
