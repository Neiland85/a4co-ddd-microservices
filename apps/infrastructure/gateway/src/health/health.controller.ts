/**
 * Health Controller - Health check endpoints
 */

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type HealthStatus = 'up' | 'down';

interface ComponentHealth {
  status: HealthStatus;
  message?: string;
  responseTimeMs?: number;
}

interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
  details: Record<string, ComponentHealth>;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Gateway health check' })
  @ApiResponse({ status: 200, description: 'Gateway is healthy' })
  check(): HealthResponse {
    return {
      status: 'up',
      timestamp: new Date().toISOString(),
      details: {
        gateway: { status: 'up' },
      },
    };
  }

  @Get('services')
  @ApiOperation({ summary: 'Check all downstream services health' })
  @ApiResponse({ status: 200, description: 'Services health status' })
  async checkServices(): Promise<HealthResponse> {
    const services = this.config.get<Record<string, string>>('services') || {};
    const entries = await Promise.all(
      Object.entries(services).map(async ([name, url]) => {
        const startedAt = Date.now();
        try {
          const response = await fetch(`${url}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
          });

          return [
            name,
            {
              status: response.ok ? 'up' : 'down',
              message: response.ok ? undefined : `HTTP ${response.status}`,
              responseTimeMs: Date.now() - startedAt,
            },
          ] as const;
        } catch (error) {
          return [
            name,
            {
              status: 'down',
              message: error instanceof Error ? error.message : 'Service unreachable',
              responseTimeMs: Date.now() - startedAt,
            },
          ] as const;
        }
      }),
    );

    const details = Object.fromEntries(entries);
    const status: HealthStatus = Object.values(details).every((item) => item.status === 'up')
      ? 'up'
      : 'down';

    return {
      status,
      timestamp: new Date().toISOString(),
      details,
    };
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
