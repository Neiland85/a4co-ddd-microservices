/**
 * Inventory Proxy Controller - Forward requests to Inventory Service
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

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'List all inventory items' })
    async list(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('check')
    @ApiOperation({ summary: 'Check inventory availability' })
    async check(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/check');
    }

    @All('low-stock')
    @ApiOperation({ summary: 'Get low stock items' })
    async lowStock(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/low-stock');
    }

    @All('out-of-stock')
    @ApiOperation({ summary: 'Get out of stock items' })
    async outOfStock(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/out-of-stock');
    }

    @All('reserve')
    @ApiOperation({ summary: 'Reserve inventory' })
    async reserve(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/reserve');
    }

    @All('release')
    @ApiOperation({ summary: 'Release reserved inventory' })
    async release(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/release');
    }

    @All('adjust')
    @ApiOperation({ summary: 'Adjust inventory quantities' })
    async adjust(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/adjust');
    }

    @All('warehouses')
    @ApiOperation({ summary: 'List warehouses' })
    async warehouses(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/warehouses');
    }

    @All('warehouses/:warehouseId')
    @ApiOperation({ summary: 'Get warehouse inventory' })
    async warehouseInventory(
        @Param('warehouseId') warehouseId: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/warehouses/${warehouseId}`);
    }

    @All('product/:productId')
    @ApiOperation({ summary: 'Get inventory for a specific product' })
    async productInventory(
        @Param('productId') productId: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/product/${productId}`);
    }

    @All(':id')
    @ApiOperation({ summary: 'Get, update, or delete inventory item by ID' })
    async inventoryById(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}`);
    }

    @All(':id/movements')
    @ApiOperation({ summary: 'Get inventory movements history' })
    async movements(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/movements`);
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any inventory path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('inventory', path, req);

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
