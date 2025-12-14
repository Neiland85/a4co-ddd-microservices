/**
 * Payments Proxy Controller - Forward requests to Payment Service
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

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'List payments or create a new payment' })
    async listOrCreate(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('process')
    @ApiOperation({ summary: 'Process a payment' })
    async process(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/process');
    }

    @All('verify')
    @ApiOperation({ summary: 'Verify payment status' })
    async verify(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/verify');
    }

    @All('refund')
    @ApiOperation({ summary: 'Request a payment refund' })
    async refund(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/refund');
    }

    @All('methods')
    @ApiOperation({ summary: 'Get available payment methods' })
    async methods(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/methods');
    }

    @All(':id')
    @ApiOperation({ summary: 'Get, update, or delete a payment by ID' })
    async paymentById(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}`);
    }

    @All(':id/status')
    @ApiOperation({ summary: 'Get payment status' })
    async status(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/status`);
    }

    @All(':id/cancel')
    @ApiOperation({ summary: 'Cancel a payment' })
    async cancel(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/cancel`);
    }

    @All(':id/confirm')
    @ApiOperation({ summary: 'Confirm a payment' })
    async confirm(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/confirm`);
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any payments path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('payments', path, req);

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
