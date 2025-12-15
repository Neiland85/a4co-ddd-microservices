# A4CO Observability Infrastructure

This directory contains the complete observability infrastructure for the A4CO DDD Microservices platform as defined in **PR4: Observability Event-Driven Infrastructure**.

## 📋 Overview

The observability stack provides comprehensive monitoring, logging, and alerting for:
- **Microservices**: HTTP metrics, health, performance
- **Event-Driven Architecture**: Event publishing, consumption, processing metrics
- **NATS Messaging**: Message throughput, JetStream metrics, consumer lag
- **Infrastructure**: Database, cache, system resources
- **Saga Orchestration**: Success/failure rates, compensation tracking

## 🏗️ Stack Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Observability Stack                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Microservices → Prometheus (metrics) → Grafana (viz)       │
│                → Promtail (logs) → Loki (storage)           │
│                → NATS Exporter → Prometheus                 │
│                                                              │
│  Alerts → Prometheus → AlertManager → Notifications         │
└─────────────────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Grafana** | 3000 | Visualization and dashboards |
| **Prometheus** | 9090 | Metrics collection and storage |
| **Loki** | 3100 | Log aggregation |
| **Promtail** | 9080 | Log collector |
| **AlertManager** | 9093 | Alert management |
| **NATS Exporter** | 7777 | NATS metrics exporter |

## 🚀 Quick Start

### 1. Start the Observability Stack

```bash
# From repository root
docker-compose -f docker-compose.observability.yml up -d
```

### 2. Verify Services

```bash
# Check all services are running
docker-compose -f docker-compose.observability.yml ps

# Check logs
docker-compose -f docker-compose.observability.yml logs -f grafana
```

### 3. Access Dashboards

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **AlertManager**: http://localhost:9093
- **Loki**: http://localhost:3100/ready

## 📊 Dashboards

### Main Dashboard (`a4co-main`)
- HTTP request latency (p50, p95, p99)
- Request rate by status code
- Service availability
- Error rate
- Application logs

### Events Dashboard (`a4co-events`)
- Event publishing rate by type
- Event consumption rate by consumer
- Event processing errors
- Event processing latency (p95, p99)
- Event handler error logs

### NATS Dashboard (`a4co-nats`)
- Connected clients
- Message throughput (in/out)
- Byte throughput (in/out)
- Memory usage
- JetStream streams & consumers
- Consumer lag
- Storage usage
- NATS logs

## 📁 Directory Structure

```
infra/observability/
├── README.md                          # This file
├── prometheus/
│   ├── prometheus.yml                 # Main config
│   ├── alerts.yml                     # Alerting rules
│   └── recording-rules.yml            # Recording rules
├── loki/
│   └── loki-config.yml               # Loki configuration
├── promtail/
│   └── promtail-config.yml           # Log collection config
├── alertmanager/
│   └── alertmanager.yml              # Alert routing
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasources.yml       # Prometheus, Loki datasources
│   │   └── dashboards/
│   │       └── dashboards.yml        # Dashboard provisioning
│   └── dashboards/
│       ├── main-dashboard.json       # Main dashboard
│       ├── events/
│       │   └── events-dashboard.json # Events dashboard
│       └── nats/
│           └── nats-dashboard.json   # NATS dashboard
└── nats-exporter/                    # (Optional configs)
```

## 🔧 Configuration

### Prometheus

- **Scrape Interval**: 15s (10s for microservices)
- **Retention**: 30 days
- **Storage**: 10GB max
- **Targets**: All microservices, NATS, infrastructure

### Loki

- **Retention**: 31 days
- **Max Line Size**: 256KB
- **Ingestion Rate**: 100MB/s
- **Storage**: Filesystem-based

### AlertManager

- **Grouping**: By alertname, cluster, service
- **Group Wait**: 30s (10s for critical)
- **Repeat Interval**: 4h (1h for critical)

## 📈 Key Metrics

### HTTP Metrics
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Latency p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Event Metrics
```promql
# Event publishing rate
rate(event_published_total[5m])

# Event consumption rate
rate(event_consumed_total[5m])

# Event processing errors
rate(event_processing_errors_total[5m])

# Event processing duration p95
histogram_quantile(0.95, rate(event_processing_duration_seconds_bucket[5m]))
```

### NATS Metrics
```promql
# Connected clients
gnatsd_varz_connections

# Message rate
rate(gnatsd_varz_in_msgs[5m])

# Memory usage
gnatsd_varz_mem / gnatsd_varz_max_mem

# JetStream consumer lag
gnatsd_jetstream_consumer_num_pending
```

## 🚨 Alerting

### Critical Alerts
- **ServiceDown**: Service unavailable for 2+ minutes
- **NATSServerDown**: NATS unavailable for 1+ minute
- **HighEventProcessingErrors**: >5 errors/sec for 5 minutes
- **SagaCompensationFailed**: Compensation failure detected

### Warning Alerts
- **HighErrorRate**: >5% HTTP errors for 5 minutes
- **HighLatency**: p95 >1s for 10 minutes
- **NATSHighMemoryUsage**: >80% memory for 5 minutes
- **EventConsumptionStalled**: No consumption while publishing

## 🔍 Troubleshooting

### Grafana not showing data
```bash
# Check Prometheus datasource
curl http://localhost:9090/api/v1/query?query=up

# Check Loki datasource
curl http://localhost:3100/ready

# Restart Grafana
docker-compose -f docker-compose.observability.yml restart grafana
```

### Prometheus not scraping
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check service metrics endpoint
curl http://localhost:3000/metrics  # Example: order-service

# Reload Prometheus config
curl -X POST http://localhost:9090/-/reload
```

### Loki out of memory
```bash
# Check Loki metrics
curl http://localhost:3100/metrics | grep loki_ingester_memory

# Reduce retention in loki-config.yml
# retention_period: 168h  # 7 days instead of 31

# Restart Loki
docker-compose -f docker-compose.observability.yml restart loki
```

### Missing logs
```bash
# Check Promtail is running
docker-compose -f docker-compose.observability.yml logs promtail

# Check Promtail targets
curl http://localhost:9080/targets

# Verify log path permissions
ls -la /var/lib/docker/containers/
```

## 📚 Documentation

- **Full Documentation**: `docs/PR4-OBSERVABILITY-SETUP.md` (50KB)
- **Prometheus Docs**: https://prometheus.io/docs/
- **Grafana Docs**: https://grafana.com/docs/
- **Loki Docs**: https://grafana.com/docs/loki/
- **NATS Docs**: https://docs.nats.io/

## 🔐 Security

### Default Credentials
- **Grafana**: admin/admin (change on first login)

### Production Recommendations
1. Use environment variables for credentials
2. Enable TLS/SSL for all services
3. Configure authentication for Prometheus/AlertManager
4. Restrict network access with firewall rules
5. Enable audit logging
6. Regular security updates

## 🎯 Next Steps (Future PRs)

- **PR5**: Structured logging in microservices
- **PR6**: Distributed tracing with Jaeger/Tempo
- **PR7**: Advanced alerting and on-call rotation
- **PR8**: Log-based metrics and anomaly detection

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review full documentation in `docs/PR4-OBSERVABILITY-SETUP.md`
3. Open GitHub issue with `observability` label

---

**Version**: 1.0  
**Last Updated**: 2025-12-15  
**Status**: Production Ready
