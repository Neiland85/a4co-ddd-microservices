/**
 * Proxy Module - Service Proxy Configuration
 */

import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthProxyController } from './controllers/auth-proxy.controller';
import { InventoryProxyController } from './controllers/inventory-proxy.controller';
import { OrdersProxyController } from './controllers/orders-proxy.controller';
import { PaymentsProxyController } from './controllers/payments-proxy.controller';
import { ProductsProxyController } from './controllers/products-proxy.controller';
import { SagasProxyController } from './controllers/sagas-proxy.controller';
import { ProxyMiddleware } from './proxy.middleware';
import { ProxyService } from './proxy.service';

@Module({
    imports: [
        ConfigModule,
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                timeout: config.get<number>('proxy.timeout', 30000),
                maxRedirects: 5,
            }),
        }),
    ],
    controllers: [
        AuthProxyController,
        ProductsProxyController,
        OrdersProxyController,
        InventoryProxyController,
        PaymentsProxyController,
        SagasProxyController,
    ],
    providers: [ProxyService, ProxyMiddleware],
    exports: [ProxyService],
})
export class ProxyModule implements NestModule {
    constructor(private readonly proxyMiddleware: ProxyMiddleware) { }

    configure(_consumer: MiddlewareConsumer) {
        // Apply proxy middleware for specific routes
        // This allows raw request forwarding for complex scenarios
    }
}
