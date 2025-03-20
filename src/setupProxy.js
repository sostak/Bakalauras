const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:5084',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Handle OPTIONS requests
        if (req.method === 'OPTIONS') {
          proxyReq.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
          proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
          proxyReq.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
        }
        console.log('Proxying request to:', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept';
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );
}; 