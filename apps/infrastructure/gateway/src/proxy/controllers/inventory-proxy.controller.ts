import { All, Controller, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('inventory')
export class InventoryProxyController {
  private readonly target =
    process.env.INVENTORY_SERVICE_URL ||
    process.env.INVENTORY_URL ||
    'http://localhost:3006';

  @All()
  async root(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, '');
  }

  @All('*path')
  async wildcard(
    @Param('path') path: string | string[] | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const normalized = Array.isArray(path) ? path.join('/') : path || '';
    return this.forward(req, res, normalized);
  }

  private async forward(req: Request, res: Response, path: string) {
    const base = this.target.replace(/\/$/, '');
    const cleanPath = path ? `/${path.replace(/^\//, '')}` : '';
    const query = this.toQueryString(req.query);
    const url = `${base}/api/inventory${cleanPath}${query}`;

    try {
      const upstream = await fetch(url, {
        method: req.method,
        headers: this.forwardHeaders(req),
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
      });

      const body = await upstream.text();
      const contentType = upstream.headers.get('content-type');

      if (contentType) {
        res.setHeader('content-type', contentType);
      }

      return res.status(upstream.status).send(body);
    } catch (error) {
      return res.status(503).json({
        statusCode: 503,
        message: 'Service inventory is unavailable',
        error: error instanceof Error ? error.message : 'Service Unavailable',
        target: url,
      });
    }
  }

  private forwardHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    const authorization = req.headers.authorization;
    if (authorization) headers.authorization = authorization;

    const contentType = req.headers['content-type'];
    headers['content-type'] = Array.isArray(contentType)
      ? contentType[0]
      : contentType || 'application/json';

    return headers;
  }

  private toQueryString(query: Request['query']): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)));
      } else if (value !== undefined) {
        params.append(key, String(value));
      }
    }

    const serialized = params.toString();
    return serialized ? `?${serialized}` : '';
  }
}
