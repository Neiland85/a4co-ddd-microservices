import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Endpoint raíz - Información de la API' })
  @ApiResponse({
    status: 200,
    description: 'Información básica de la API',
  })
  getRoot() {
    return {
      message: '🛍️ Portal de Artesanos - API',
      version: '1.0.0',
      documentation: '/api',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
        },
        users: {
          create: 'POST /users',
          list: 'GET /users',
          get: 'GET /users/:id',
          update: 'PUT /users/:id',
          delete: 'DELETE /users/:id',
        },
        products: {
          create: 'POST /products',
          list: 'GET /products',
          get: 'GET /products/:id',
          update: 'PUT /products/:id',
          delete: 'DELETE /products/:id',
        },
        orders: {
          create: 'POST /orders',
          list: 'GET /orders',
          get: 'GET /orders/:id',
          update: 'PUT /orders/:id',
        },
      },
      links: {
        swagger: '/api',
        health: '/health',
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del servidor' })
  @ApiResponse({
    status: 200,
    description: 'Estado del servidor',
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
