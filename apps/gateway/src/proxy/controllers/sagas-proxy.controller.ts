/**
 * Sagas Proxy Controller - Forward requests to Saga Coordinator Service
 */

import {
    All,
    Controller,
    Param,
    Req,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy.service';

@ApiTags('sagas')
@ApiBearerAuth()
@Controller('sagas')
export class SagasProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'List sagas or create a new saga' })
    async listOrCreate(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('transactions')
    @ApiOperation({ summary: 'List all saga transactions' })
    async transactions(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/transactions');
    }

    @All('compensate')
    @ApiOperation({ summary: 'Trigger compensation for failed saga' })
    async compensate(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/compensate');
    }

    @All('status')
    @ApiOperation({ summary: 'Get saga orchestration status' })
    async status(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/status');
    }

    @All(':id')
    @ApiOperation({ summary: 'Get saga by ID' })
    async sagaById(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}`);
    }

    @All(':id/steps')
    @ApiOperation({ summary: 'Get saga execution steps' })
    async steps(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/steps`);
    }

    @All(':id/rollback')
    @ApiOperation({ summary: 'Rollback a saga' })
    async rollback(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/rollback`);
    }

    @All(':id/retry')
    @ApiOperation({ summary: 'Retry a failed saga step' })
    async retry(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/retry`);
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any sagas path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('sagas', path, req);

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
