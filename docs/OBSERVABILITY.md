# A4CO Observability Setup

This document describes how to set up and use the observability stack for A4CO microservices.

## Overview

The A4CO observability stack provides:

- **Metrics**: Prometheus-compatible metrics following OpenTelemetry semantic conventions
- **Dashboards**: Pre-configured Grafana dashboards for monitoring service health
- **Alerts**: Prometheus alerting rules for critical SLO violations
- **Tracing**: Distributed tracing with Jaeger

## Quick Start

### 1. Start the Monitoring Stack

```bash
# Navigate to the infra/docker directory
cd infra/docker

# Start Prometheus, Grafana, and Jaeger
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. Access the Dashboards

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| Grafana | http://localhost:3100 | admin / a4co_grafana_admin |
| Prometheus | http://localhost:9090 | - |
| Jaeger UI | http://localhost:16686 | - |
| Alertmanager | http://localhost:9093 | - |

### 3. View Pre-configured Dashboards

Once Grafana is running:

1. Navigate to http://localhost:3100
2. Log in with admin credentials
3. Go to Dashboards → Browse
4. Select "A4CO - Services Overview"

## Metrics Exposed

### Standard HTTP Metrics

All services export the following metrics:

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests (labels: method, route, status_code, status_class) |
| `request_duration_seconds` | Histogram | Request duration in seconds |
| `http_active_requests` | Gauge | Currently active HTTP requests |

### Database Health Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `db_query_total` | Counter | Total database queries |
| `db_query_duration_seconds` | Histogram | Query duration in seconds |
| `db_query_errors_total` | Counter | Failed database queries |
| `db_connections_active` | Gauge | Active database connections |

### A4CO Business Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `commerce_listed_total` | Counter | Commerce listings created |
| `promo_nearby_request_total` | Counter | Nearby promotion requests |

### System Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `process_memory_bytes` | Gauge | Process memory usage |
| `process_cpu_percent` | Gauge | Process CPU usage percentage |

## Testing Metrics Locally

### Test that metrics are being exported

```bash
# Test order-service metrics
curl http://localhost:3004/metrics

# Test auth-service metrics
curl http://localhost:3001/metrics

# Test user-service metrics
curl http://localhost:3002/metrics
```

### Query Prometheus directly

```bash
# Check P95 latency
curl 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,sum(rate(request_duration_seconds_bucket[5m]))by(le,job))'

# Check error rate
curl 'http://localhost:9090/api/v1/query?query=sum(rate(http_requests_total{status_class=~"4xx|5xx"}[5m]))by(job)/sum(rate(http_requests_total[5m]))by(job)*100'

# Check throughput
curl 'http://localhost:9090/api/v1/query?query=sum(rate(http_requests_total[5m]))by(job)'
```

## Alert Rules

### P95 Latency Alert

- **Threshold**: P95 latency > 500ms
- **Duration**: 3 minutes
- **Severity**: Warning

### Error Rate Alert

- **Threshold**: Error rate > 2%
- **Duration**: 5 minutes
- **Severity**: Critical

### Database Latency Alert

- **Threshold**: P95 DB query latency > 500ms
- **Duration**: 3 minutes
- **Severity**: Warning

## Integrating Metrics in Your Service

### Using the MetricsModule in NestJS

```typescript
import { Module } from '@nestjs/common';
import { MetricsModule } from '@a4co/observability';

@Module({
  imports: [
    MetricsModule.forRoot({
      serviceName: 'my-service',
      serviceVersion: '1.0.0',
      prometheusPort: 9464,
    }),
  ],
})
export class AppModule {}
```

### Using the MetricsInterceptor

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsInterceptor } from '@a4co/observability';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule {}
```

### Recording Business Metrics

```typescript
import { Injectable } from '@nestjs/common';
import { MetricsService } from '@a4co/observability';

@Injectable()
export class CommerceService {
  constructor(private readonly metricsService: MetricsService) {}

  async createCommerce(data: CreateCommerceDto) {
    // ... business logic
    
    // Record metric
    this.metricsService.recordCommerceListed(data.type);
    
    return commerce;
  }
}
```

### Recording Database Metrics

```typescript
import { MetricsService } from '@a4co/observability';

const startTime = Date.now();
try {
  const result = await prisma.user.findMany();
  const duration = (Date.now() - startTime) / 1000;
  metricsService.recordDbQuery('findMany', 'users', duration, true);
  return result;
} catch (error) {
  const duration = (Date.now() - startTime) / 1000;
  metricsService.recordDbQuery('findMany', 'users', duration, false);
  throw error;
}
```

## Grafana Dashboard Panels

The "A4CO - Services Overview" dashboard includes:

1. **P95 Latency by Service** - Time series showing p95 latency per service
2. **Error Rate by Service** - Percentage of 4xx/5xx responses
3. **Throughput by Service** - Requests per second
4. **Database Query Latency** - P50 and P95 database query times
5. **Commerce Listings Rate** - Business metric for listing creation
6. **Nearby Promo Requests Rate** - Business metric for location-based queries

## Troubleshooting

### Metrics not appearing in Prometheus

1. Verify the service is running and exposing `/metrics` endpoint
2. Check Prometheus targets: http://localhost:9090/targets
3. Verify network connectivity between Prometheus and services

### Grafana shows "No Data"

1. Verify Prometheus datasource is configured correctly
2. Check the time range selector
3. Verify the service is generating traffic

### Alerts not firing

1. Check Alertmanager is running: http://localhost:9093
2. Verify alert rules are loaded: http://localhost:9090/rules
3. Check the alert thresholds and conditions

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Microservice  │────▶│   Prometheus    │
│    /metrics     │     │    :9090        │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Grafana      │
                        │    :3100        │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Alertmanager   │
                        │    :9093        │
                        └─────────────────┘
```

## Service Ports Reference

| Service | Application Port | Metrics Port |
|---------|------------------|--------------|
| auth-service | 3001 | 3001 |
| user-service | 3002 | 3002 |
| product-service | 3003 | 3003 |
| order-service | 3004 | 3004 |
| payment-service | 3005 | 3005 |
| inventory-service | 3006 | 3006 |
| notification-service | 3008 | 3008 |
| loyalty-service | 3009 | 3009 |
| geo-service | 3010 | 3010 |
| gateway | 3000 | 3000 |
