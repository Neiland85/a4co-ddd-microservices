/**
 * Proxy Middleware - Raw HTTP proxy using http-proxy-middleware
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Create a proxy middleware for a specific service
   */
  createProxy(serviceName: string, targetUrl: string) {
    const options: Options = {
      target: targetUrl,
      changeOrigin: this.configService.get<boolean>('proxy.changeOrigin', true),
      pathRewrite: {
        [`^/api/v1/${serviceName}`]: '', // Remove gateway prefix
      },
      timeout: this.configService.get<number>('proxy.timeout', 30000),
      proxyTimeout: this.configService.get<number>('proxy.timeout', 30000),
      on: {
        proxyReq: (proxyReq, req) => {
          // Forward request ID
          const requestId = req.headers['x-request-id'];
          if (requestId) {
            proxyReq.setHeader('X-Request-ID', requestId as string);
          }

          // Add gateway identifier
          proxyReq.setHeader('X-Forwarded-By', 'a4co-gateway');

          this.logger.debug(
            `[${requestId}] Proxying ${req.method} ${req.url} -> ${targetUrl}`,
          );
        },
        proxyRes: (proxyRes, req) => {
          const requestId = req.headers['x-request-id'];
          this.logger.debug(
            `[${requestId}] Proxy response: ${proxyRes.statusCode}`,
          );
        },
        error: (err, req, res) => {
          const requestId = req.headers['x-request-id'];
          this.logger.error(`[${requestId}] Proxy error: ${err.message}`);

          if (res && 'status' in res && typeof res.status === 'function') {
            res.status(502).json({
              statusCode: 502,
              message: `Service ${serviceName} is unavailable`,
              error: 'Bad Gateway',
            });
          }
        },
      },
    };

    return createProxyMiddleware(options);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // This is a fallback - actual proxying is done by service-specific middlewares
    next();
  }
}
