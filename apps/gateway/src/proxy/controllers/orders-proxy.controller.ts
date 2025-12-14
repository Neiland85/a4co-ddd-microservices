/**
 * Orders Proxy Controller - Forward requests to Order Service
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

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'List user orders or create a new order' })
    async listOrCreate(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('my-orders')
    @ApiOperation({ summary: 'Get current user orders' })
    async myOrders(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/my-orders');
    }

    @All('pending')
    @ApiOperation({ summary: 'Get pending orders' })
    async pending(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/pending');
    }

    @All('history')
    @ApiOperation({ summary: 'Get order history' })
    async history(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/history');
    }

    @All(':id')
    @ApiOperation({ summary: 'Get, update, or delete an order by ID' })
    async orderById(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}`);
    }

    @All(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/status`);
    }

    @All(':id/cancel')
    @ApiOperation({ summary: 'Cancel an order' })
    async cancel(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/cancel`);
    }

    @All(':id/items')
    @ApiOperation({ summary: 'Get order items' })
    async orderItems(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/items`);
    }

    @All(':id/payment')
    @ApiOperation({ summary: 'Process order payment' })
    async payment(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/payment`);
    }

    @All(':id/shipping')
    @ApiOperation({ summary: 'Get or update shipping info' })
    async shipping(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/shipping`);
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any orders path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('orders', path, req);

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
