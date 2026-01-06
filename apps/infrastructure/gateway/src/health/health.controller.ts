/**
 * Health Controller - Health check endpoints
 */

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly config: ConfigService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Gateway health check' })
    @ApiResponse({ status: 200, description: 'Gateway is healthy' })
    @HealthCheck()
    check() {
        return this.health.check([
            // Basic gateway health
            () => Promise.resolve({ gateway: { status: 'up' } } as HealthIndicatorResult),
        ]);
    }

    @Get('services')
    @ApiOperation({ summary: 'Check all downstream services health' })
    @ApiResponse({ status: 200, description: 'Services health status' })
    @HealthCheck()
    async checkServices() {
        const services = this.config.get<Record<string, string>>('services');

        const checks = Object.entries(services || {}).map(([name, url]) => async (): Promise<HealthIndicatorResult> => {
            try {
                return await this.http.pingCheck(name, `${url}/health`);
            } catch {
                return { [name]: { status: 'down', message: 'Service unreachable' } } as HealthIndicatorResult;
            }
        });

        return this.health.check(checks);
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
    @ApiResponse({ status: 200, description: 'Gateway is ready' })
    ready() {
        return {
            status: 'ready',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('live')
    @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
    @ApiResponse({ status: 200, description: 'Gateway is alive' })
    live() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
        };
    }
}
