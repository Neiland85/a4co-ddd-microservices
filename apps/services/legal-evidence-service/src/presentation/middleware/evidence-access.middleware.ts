import { randomUUID } from 'crypto';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AccessAction, AccessLog } from '../../domain/entities/access-log.entity.js';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';

@Injectable()
export class EvidenceAccessMiddleware implements NestMiddleware {
  constructor(
    @Inject('IAccessLogRepository')
    private readonly accessLogRepository: IAccessLogRepository,
    @Inject('IEvidenceRepository')
    private readonly evidenceRepository: IEvidenceRepository,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const path = req.path ?? req.originalUrl?.split('?')[0] ?? '';
    const isEvidenceGet = req.method === 'GET' && path.startsWith('/evidence/');
    const isExportOrDownload = path.includes('/export') || path.includes('/download');

    if (!isEvidenceGet && !isExportOrDownload) {
      next();
      return;
    }

    const match = path.match(/\/evidence\/([^/]+)/);
    const evidenceId = match?.[1];
    if (!evidenceId) {
      next();
      return;
    }

    const evidence = await this.evidenceRepository.findById(evidenceId);
    if (!evidence) {
      next();
      return;
    }

    let action = AccessAction.VIEW;
    if (path.includes('/download')) {
      action = AccessAction.DOWNLOAD;
    } else if (path.includes('/export')) {
      action = AccessAction.EXPORT;
    }

    const userIdHeader = req.headers['x-user-id'];
    const userId = typeof userIdHeader === 'string' && userIdHeader.trim() ? userIdHeader : 'anonymous';
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip ?? null;

    try {
      const log = new AccessLog(
        randomUUID(),
        userId,
        evidence.caseId,
        evidence.id,
        action,
        ipAddress,
        typeof userAgent === 'string' ? userAgent : null,
      );
      await this.accessLogRepository.save(log);
    } catch {
      // no-op: access logging must not break evidence requests
    }
    next();
  }
}
