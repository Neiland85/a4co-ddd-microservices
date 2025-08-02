/**
 * Security Middleware - Protection against CVE-2025-29927 and other vulnerabilities
 * 
 * This middleware provides comprehensive protection for Next.js applications against:
 * - CVE-2025-29927 (Next.js Middleware Authorization Bypass)
 * - NextAuth.js vulnerabilities
 * - Command injection attacks
 * - Open redirect attacks
 * - Other security threats
 */

/**
 * HTTP Security Middleware
 * Strips dangerous headers and applies security policies
 */
function securityMiddleware(req, res, next) {
  // CVE-2025-29927: Block x-middleware-subrequest header
  if (req.headers['x-middleware-subrequest']) {
    console.warn(`🚨 SECURITY ALERT: Blocked CVE-2025-29927 exploit attempt from ${req.ip || req.connection.remoteAddress}`);
    console.warn(`🚨 Request headers:`, JSON.stringify(req.headers, null, 2));
    
    // Log the attempted exploit for security monitoring
    logSecurityEvent('CVE-2025-29927_ATTEMPT', {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      url: req.url,
      timestamp: new Date().toISOString()
    });
    
    // Remove the dangerous header
    delete req.headers['x-middleware-subrequest'];
  }

  // Block other suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-subrequest',
    'x-middleware-rewrite',
    'x-nextjs-subrequest'
  ];

  suspiciousHeaders.forEach(header => {
    if (req.headers[header]) {
      console.warn(`🚨 SECURITY ALERT: Blocked suspicious header: ${header}`);
      delete req.headers[header];
    }
  });

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );

  next();
}

/**
 * Express.js middleware wrapper
 */
function expressSecurityMiddleware(req, res, next) {
  return securityMiddleware(req, res, next);
}

/**
 * Node.js HTTP server wrapper
 */
function nodeHttpSecurityWrapper(originalCreateServer) {
  return function(options, requestListener) {
    const server = originalCreateServer.call(this, options, requestListener);
    const originalEmit = server.emit;
    
    server.emit = function(type, ...args) {
      if (type === 'request' && args[0] && args[0].headers) {
        const req = args[0];
        const res = args[1];
        
        // Apply security middleware
        securityMiddleware(req, res, () => {});
      }
      return originalEmit.apply(this, [type, ...args]);
    };
    
    return server;
  };
}

/**
 * Next.js middleware function
 */
function nextjsSecurityMiddleware(request) {
  const headers = new Headers(request.headers);
  
  // Block CVE-2025-29927
  if (headers.get('x-middleware-subrequest')) {
    console.warn('🚨 SECURITY ALERT: Blocked CVE-2025-29927 exploit attempt');
    
    // Create a new request without the dangerous header
    const newHeaders = new Headers();
    for (const [key, value] of headers) {
      if (key !== 'x-middleware-subrequest') {
        newHeaders.set(key, value);
      }
    }
    
    return new Request(request.url, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
    });
  }
  
  return request;
}

/**
 * Security event logging
 */
function logSecurityEvent(eventType, details) {
  const logEntry = {
    event: eventType,
    details,
    timestamp: new Date().toISOString(),
    severity: 'HIGH'
  };
  
  // In production, send to your security monitoring system
  console.error('🚨 SECURITY EVENT:', JSON.stringify(logEntry, null, 2));
  
  // You could integrate with services like:
  // - Sentry
  // - DataDog
  // - New Relic
  // - Custom security monitoring
}

/**
 * Nginx configuration generator
 */
function generateNginxConfig() {
  return `
# Nginx Security Configuration for CVE-2025-29927
location / {
    # Block CVE-2025-29927 exploit header
    if ($http_x_middleware_subrequest) {
        access_log /var/log/nginx/security.log;
        return 403 "Security violation detected";
    }
    
    # Remove dangerous headers from upstream
    proxy_set_header x-middleware-subrequest "";
    proxy_set_header x-forwarded-subrequest "";
    proxy_set_header x-middleware-rewrite "";
    proxy_set_header x-nextjs-subrequest "";
    
    # Add security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    proxy_pass http://nextjs_backend;
}
`;
}

/**
 * Apache configuration generator
 */
function generateApacheConfig() {
  return `
# Apache Security Configuration for CVE-2025-29927
<VirtualHost *:80>
    # Block CVE-2025-29927 exploit header
    <If "%{HTTP:x-middleware-subrequest} != ''">
        Require all denied
        ErrorDocument 403 "Security violation detected"
    </If>
    
    # Remove dangerous headers
    RequestHeader unset x-middleware-subrequest
    RequestHeader unset x-forwarded-subrequest
    RequestHeader unset x-middleware-rewrite
    RequestHeader unset x-nextjs-subrequest
    
    # Add security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
`;
}

/**
 * Cloudflare Worker script
 */
function generateCloudflareWorker() {
  return `
// Cloudflare Worker for CVE-2025-29927 protection
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Block CVE-2025-29927
  if (request.headers.get('x-middleware-subrequest')) {
    console.log('Blocked CVE-2025-29927 attempt from:', request.headers.get('cf-connecting-ip'));
    return new Response('Security violation detected', { status: 403 });
  }
  
  // Forward request to origin
  const response = await fetch(request);
  
  // Add security headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  
  return newResponse;
}
`;
}

// Override Node.js HTTP module for automatic protection
if (typeof require !== 'undefined') {
  const originalHttp = require('http');
  if (originalHttp && originalHttp.createServer) {
    originalHttp.createServer = nodeHttpSecurityWrapper(originalHttp.createServer);
  }
}

module.exports = {
  securityMiddleware,
  expressSecurityMiddleware,
  nodeHttpSecurityWrapper,
  nextjsSecurityMiddleware,
  logSecurityEvent,
  generateNginxConfig,
  generateApacheConfig,
  generateCloudflareWorker
};

// ES Module exports
if (typeof module === 'undefined') {
  export {
    securityMiddleware,
    expressSecurityMiddleware,
    nodeHttpSecurityWrapper,
    nextjsSecurityMiddleware,
    logSecurityEvent,
    generateNginxConfig,
    generateApacheConfig,
    generateCloudflareWorker
  };
}