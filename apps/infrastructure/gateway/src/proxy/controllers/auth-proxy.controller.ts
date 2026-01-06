/**
 * Auth Proxy Controller - Forward requests to Auth Service
 */

import {
    All,
    Controller,
    Param,
    Req,
    Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy.service';

@ApiTags('auth')
@Controller('auth')
export class AuthProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All()
    @ApiOperation({ summary: 'Proxy to Auth Service root' })
    async proxyRoot(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '');
    }

    @All('login')
    @ApiOperation({ summary: 'User login' })
    async login(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/login');
    }

    @All('register')
    @ApiOperation({ summary: 'User registration' })
    async register(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/register');
    }

    @All('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'User logout' })
    async logout(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/logout');
    }

    @All('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/refresh');
    }

    @All('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async me(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/me');
    }

    @All('verify')
    @ApiOperation({ summary: 'Verify token' })
    async verify(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/verify');
    }

    @All('password/reset')
    @ApiOperation({ summary: 'Request password reset' })
    async passwordReset(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/password/reset');
    }

    @All('password/change')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change password' })
    async passwordChange(@Req() req: Request, @Res() res: Response) {
        return this.handleProxy(req, res, '/password/change');
    }

    @All('*path')
    @ApiOperation({ summary: 'Proxy any auth path' })
    async proxyAll(
        @Param('path') path: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const fullPath = Array.isArray(path) ? path.join('/') : path;
        return this.handleProxy(req, res, `/${fullPath}`);
    }

    private async handleProxy(req: Request, res: Response, path: string) {
        const response = await this.proxyService.forward('auth', path, req);

        // Set response headers
        Object.entries(response.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    }
}
