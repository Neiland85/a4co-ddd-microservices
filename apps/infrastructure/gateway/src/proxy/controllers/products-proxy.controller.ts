/**
 * Products Proxy Controller - Forward requests to Product Service
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

@ApiTags('products')
@Controller('products')
export class ProductsProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'List all products or create a new product' })
    async listOrCreate(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('search')
    @ApiOperation({ summary: 'Search products' })
    async search(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/search');
    }

    @All('categories')
    @ApiOperation({ summary: 'List product categories' })
    async categories(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/categories');
    }

    @All('categories/:categoryId')
    @ApiOperation({ summary: 'Get products by category' })
    async productsByCategory(
        @Param('categoryId') categoryId: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/categories/${categoryId}`);
    }

    @All('featured')
    @ApiOperation({ summary: 'Get featured products' })
    async featured(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/featured');
    }

    @All('popular')
    @ApiOperation({ summary: 'Get popular products' })
    async popular(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/popular');
    }

    @All(':id')
    @ApiOperation({ summary: 'Get, update, or delete a product by ID' })
    async productById(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}`);
    }

    @All(':id/reviews')
    @ApiOperation({ summary: 'Get or create product reviews' })
    async productReviews(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/reviews`);
    }

    @All(':id/stock')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product stock' })
    async updateStock(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return this.handleProxy(req, res, `/${id}/stock`);
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any products path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('products', path, req);

        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
