# PR4 Observability Setup Documentation

## Overview

This document provides complete implementation instructions for the observability infrastructure in Phase 4 (PR4) of the A4CO DDD Microservices project. The setup includes centralized logging with Loki, metrics visualization with Grafana, NATS message broker monitoring, and event tracking dashboards.

**Last Updated:** 2025-12-15  
**Phase:** PR4 - Observability & Monitoring  
**Status:** Implementation Ready

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Grafana Configuration](#grafana-configuration)
5. [Loki Setup](#loki-setup)
6. [NATS Monitoring](#nats-monitoring)
7. [Event Tracking & Dashboards](#event-tracking--dashboards)
8. [Implementation Steps](#implementation-steps)
9. [Troubleshooting](#troubleshooting)
10. [Appendix](#appendix)

---

## Architecture Overview

### Stack Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Observability Stack                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Microsvcs │  │   NATS   │  │  Agents  │  │   APIs   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                      │                                       │
│       ┌──────────────┴──────────────┐                       │
│       │                             │                       │
│  ┌────▼─────┐  ┌──────────┐  ┌─────▼─────┐                 │
│  │ Promtail  │  │ Prometheus│  │ NATS Exporter│            │
│  └────┬─────┘  └─────┬────┘  └──────┬─────┘                │
│       │              │             │                       │
│       └──────────────┴─────────────┘                        │
│              │                                              │
│       ┌──────▼─────────┐                                    │
│       │  Loki (Logs)   │                                    │
│       │  Prometheus    │                                    │
│       │  (Metrics)     │                                    │
│       └────────┬───────┘                                    │
│                │                                            │
│          ┌─────▼──────┐                                     │
│          │  Grafana   │                                     │
│          │ Dashboards │                                     │
│          └────────────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

- **Centralized Logging**: Loki for efficient log aggregation
- **Metrics Collection**: Prometheus for time-series metrics
- **Log Visualization**: Grafana dashboards with Loki datasource
- **NATS Monitoring**: Real-time monitoring of message broker
- **Event Tracking**: Custom event metrics and dashboards
- **Distributed Tracing**: OpenTelemetry integration (optional)

---

## Prerequisites

### Required Tools

- Docker and Docker Compose (v20.10+)
- Kubernetes (v1.24+) - for production deployment
- kubectl (v1.24+)
- Helm (v3.10+)
- Git

### Hardware Requirements

**Development/Testing:**
- CPU: 4 cores minimum
- RAM: 8GB minimum
- Storage: 20GB for logs and metrics

**Production:**
- CPU: 8 cores recommended
- RAM: 16GB+ recommended
- Storage: 100GB+ (depends on retention policy)

### Network Requirements

- Port 3000: Grafana UI
- Port 9090: Prometheus
- Port 3100: Loki API
- Port 8222: NATS monitoring
- Port 9091: NATS metrics exporter

---

## Infrastructure Setup

### 1. Docker Compose Setup

Create `docker-compose.observability.yml`:

```yaml
version: '3.8'

services:
  # Prometheus for metrics
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    networks:
      - observability
    restart: unless-stopped

  # Loki for logs
  loki:
    image: grafana/loki:latest
    container_name: loki
    volumes:
      - ./config/loki-config.yml:/etc/loki/local-config.yaml
      - loki_data:/loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - observability
    restart: unless-stopped

  # Promtail for log collection
  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./config/promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock
    command: -config.file=/etc/promtail/config.yml
    networks:
      - observability
    depends_on:
      - loki
    restart: unless-stopped

  # Grafana for visualization
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
      - GF_LOG_LEVEL=info
    volumes:
      - ./config/grafana/datasources:/etc/grafana/provisioning/datasources
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./config/grafana/grafana.ini:/etc/grafana/grafana.ini
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - observability
    depends_on:
      - prometheus
      - loki
    restart: unless-stopped

  # NATS with monitoring
  nats:
    image: nats:latest
    container_name: nats
    command:
      - -js
      - -m
      - 8222
      - -c
      - /etc/nats/nats.conf
    volumes:
      - ./config/nats.conf:/etc/nats/nats.conf
      - nats_data:/data/nats
    ports:
      - "4222:4222"    # Client connections
      - "8222:8222"    # Monitoring
      - "4223:4223"    # NATS Streaming (if used)
    networks:
      - observability
    restart: unless-stopped

  # NATS Exporter for Prometheus
  nats-exporter:
    image: natsio/prometheus-nats-exporter:latest
    container_name: nats-exporter
    command:
      - -n
      - nats:8222
    ports:
      - "7777:7777"
    networks:
      - observability
    depends_on:
      - nats
    restart: unless-stopped

  # AlertManager (optional but recommended)
  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    volumes:
      - ./config/alertmanager.yml:/etc/alertmanager/config.yml
      - alertmanager_data:/alertmanager
    ports:
      - "9093:9093"
    command:
      - '--config.file=/etc/alertmanager/config.yml'
      - '--storage.path=/alertmanager'
    networks:
      - observability
    restart: unless-stopped

volumes:
  prometheus_data:
  loki_data:
  grafana_data:
  nats_data:
  alertmanager_data:

networks:
  observability:
    driver: bridge
```

### 2. Launch Stack

```bash
# Start all observability services
docker-compose -f docker-compose.observability.yml up -d

# Verify services are running
docker-compose -f docker-compose.observability.yml ps

# View logs
docker-compose -f docker-compose.observability.yml logs -f grafana
```

---

## Grafana Configuration

### 1. Datasources Setup

Create `config/grafana/datasources/datasources.yml`:

```yaml
apiVersion: 1

# List of data sources to insert/update depending on what's available in the database
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    jsonData:
      timeInterval: 15s

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: false
    editable: true
    jsonData:
      maxLines: 1000
      derivedFields:
        - name: TraceID
          matcherRegex: traceId=(\w+)
          url: /explore?left=${__value.raw}
```

### 2. Grafana Dashboard Configuration

Create `config/grafana/dashboards/dashboard-provider.yml`:

```yaml
apiVersion: 1

providers:
  - name: 'A4CO Dashboards'
    orgId: 1
    folder: 'A4CO Microservices'
    type: file
    disableDeletion: false
    editable: true
    options:
      path: /etc/grafana/provisioning/dashboards
```

### 3. Create Main Dashboard

Create `config/grafana/dashboards/a4co-main-dashboard.json`:

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "Prometheus",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": null,
  "links": [],
  "panels": [
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])",
          "legendFormat": "{{method}} {{path}}",
          "refId": "A"
        }
      ],
      "title": "HTTP Request Latency",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "bars",
            "fillOpacity": 100,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "normal"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 0
      },
      "id": 3,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "increase(http_requests_total[5m])",
          "legendFormat": "{{method}} {{path}} {{status}}",
          "refId": "A"
        }
      ],
      "title": "HTTP Request Rate",
      "type": "timeseries"
    },
    {
      "datasource": "Loki",
      "fieldConfig": {
        "defaults": {},
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 24,
        "x": 0,
        "y": 8
      },
      "id": 4,
      "options": {
        "dedupStrategy": "none",
        "enableLogDetails": true,
        "prettifyLogMessage": false,
        "showCommonLabels": false,
        "showLabels": false,
        "showTime": true,
        "sortOrder": 1,
        "wrapLogMessage": false
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "{service=\"api-gateway\"}",
          "refId": "A"
        }
      ],
      "title": "Application Logs",
      "type": "logs"
    }
  ],
  "schemaVersion": 27,
  "style": "dark",
  "tags": ["a4co", "microservices", "monitoring"],
  "templating": {
    "list": []
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "A4CO Microservices - Main Dashboard",
  "uid": "a4co-main",
  "version": 0
}
```

### 4. Grafana Configuration File

Create `config/grafana/grafana.ini`:

```ini
[core]
instance_name = A4CO Microservices Monitoring
default_home_dashboard_path = /etc/grafana/provisioning/dashboards/a4co-main-dashboard.json

[security]
admin_user = admin
admin_password = admin
disable_brute_force_protection = false

[auth]
disable_login_form = false
disable_signout_menu = false

[users]
allow_sign_up = false

[log]
mode = console
level = info

[paths]
logs = /var/log/grafana
data = /var/lib/grafana
plugins = /var/lib/grafana/plugins

[server]
root_url = http://grafana:3000
serve_from_sub_path = false

[analytics]
check_for_updates = true
reporting_enabled = false
```

---

## Loki Setup

### 1. Loki Configuration

Create `config/loki-config.yml`:

```yaml
auth_enabled: false

ingester:
  chunk_idle_period: 3m
  chunk_retain_period: 1m
  max_chunk_age: 1h
  max_streams_per_user: 10000
  max_retention_period: 744h  # 31 days

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 100
  ingestion_burst_size_mb: 150
  max_line_length: 262144

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

server:
  http_listen_port: 3100
  log_level: info
  log_format: json

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    period: 24h
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 744h  # 31 days
```

### 2. Promtail Configuration

Create `config/promtail-config.yml`:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0
  log_level: info
  log_format: json

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # Docker logs
  - job_name: docker
    docker: {}
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'
      - source_labels: ['__meta_docker_container_network_mode']
        target_label: 'network_mode'

  # System logs
  - job_name: syslog
    static_configs:
      - targets:
          - localhost
        labels:
          job: syslog
          __path__: /var/log/syslog

  # Application logs from mounted volume
  - job_name: app-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: app-logs
          __path__: /var/log/app/*.log

  # NATS logs
  - job_name: nats
    static_configs:
      - targets:
          - localhost
        labels:
          job: nats
          __path__: /var/log/nats/*.log
    pipeline_stages:
      - json:
          timestamp:
            parse_from: time
          expressions:
              level: level
              message: msg
              service: service
      - timestamp:
          source: timestamp
          format: RFC3339Nano
      - labels:
          level:
          service:
```

---

## NATS Monitoring

### 1. NATS Configuration

Create `config/nats.conf`:

```conf
# NATS Server Configuration for A4CO Microservices

# Server name
server_name: a4co-nats-server

# Port for client connections
port: 4222

# Host binding
host: 0.0.0.0

# HTTP monitoring port
monitor_port: 8222

# Jetstream configuration
jetstream {
  store_dir: /data/nats/jetstream
  max_memory_store: 100GB
  max_file_store: 500GB
}

# Cluster configuration (optional for production)
cluster {
  name: a4co-cluster
  listen: 0.0.0.0:6222
  routes: [
    # Add cluster peers here
    # nats-route://user:password@peer-host:6222
  ]
}

# Authorization (basic example - enhance for production)
authorization {
  default_permissions: {
    publish: ">"
    subscribe: ">"
  }
  
  users: [
    {
      user: admin
      password: admin123
      permissions: {
        publish: ">"
        subscribe: ">"
      }
    },
    {
      user: metrics
      password: metrics123
      permissions: {
        publish: "$SYS.>"
        subscribe: "$SYS.>"
      }
    },
    {
      user: microservice
      password: microservice123
      permissions: {
        publish: ">"
        subscribe: ">"
      }
    }
  ]
}

# Logging configuration
log_file: /var/log/nats/nats.log
debug: false
trace: false
verbose: true
logtime: true

# Connection limits
max_connections: 64000
max_pending: 2097152
ping_interval: 120s
ping_max: 2

# System accounts (for monitoring)
system_account: "$SYS"
```

### 2. NATS Exporter Configuration

The NATS exporter will automatically expose Prometheus metrics from the monitoring port. Key metrics exposed:

```
# NATS Server Metrics
nats_server_clients_total - Total connected clients
nats_server_connections_total - Total client connections
nats_server_messages_recv - Messages received
nats_server_messages_sent - Messages sent
nats_server_bytes_recv - Bytes received
nats_server_bytes_sent - Bytes sent
nats_server_mem_bytes - Memory usage
nats_server_uptime - Server uptime

# Jetstream Metrics
nats_jetstream_accounts_total - JetStream accounts
nats_jetstream_streams - Streams count
nats_jetstream_consumers - Consumers count
nats_jetstream_messages_total - Total messages
nats_jetstream_bytes_total - Total bytes stored
nats_jetstream_api_calls - API calls
nats_jetstream_api_errors - API errors
```

### 3. Prometheus NATS Scrape Config

Add to `config/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'nats'
    static_targets: ['localhost:7777']
    scrape_interval: 15s
    scrape_timeout: 10s
```

---

## Event Tracking & Dashboards

### 1. Event Dashboard

Create `config/grafana/dashboards/a4co-events-dashboard.json`:

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "Prometheus",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": null,
  "links": [],
  "panels": [
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Events/sec",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 24,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "options": {
        "legend": {
          "calcs": ["mean", "max"],
          "displayMode": "table",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "multi"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "rate(event_published_total[5m])",
          "legendFormat": "{{event_type}}",
          "refId": "A"
        }
      ],
      "title": "Event Publishing Rate by Type",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Events/sec",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 24,
        "x": 0,
        "y": 8
      },
      "id": 3,
      "options": {
        "legend": {
          "calcs": ["mean", "max"],
          "displayMode": "table",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "multi"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "rate(event_consumed_total[5m])",
          "legendFormat": "{{consumer}}",
          "refId": "A"
        }
      ],
      "title": "Event Consumption Rate by Consumer",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "thresholds"
          },
          "mappings": [
            {
              "options": {
                "0": {
                  "text": "OK",
                  "color": "green"
                }
              },
              "type": "value"
            }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 1
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 6,
        "w": 6,
        "x": 0,
        "y": 16
      },
      "id": 4,
      "options": {
        "orientation": "auto",
        "reduceOptions": {
          "values": false,
          "fields": "",
          "calcs": ["lastNotNull"]
        },
        "showThresholdLabels": false,
        "showThresholdMarkers": true
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "increase(event_processing_errors_total[5m])",
          "legendFormat": "{{event_type}}",
          "refId": "A"
        }
      ],
      "title": "Event Processing Errors",
      "type": "gauge"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Latency (ms)",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 6,
        "w": 12,
        "x": 6,
        "y": 16
      },
      "id": 5,
      "options": {
        "legend": {
          "calcs": ["mean", "max", "min"],
          "displayMode": "table",
          "placement": "right"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, rate(event_processing_duration_seconds_bucket[5m]))",
          "legendFormat": "p95 - {{event_type}}",
          "refId": "A"
        },
        {
          "expr": "histogram_quantile(0.99, rate(event_processing_duration_seconds_bucket[5m]))",
          "legendFormat": "p99 - {{event_type}}",
          "refId": "B"
        }
      ],
      "title": "Event Processing Latency (p95, p99)",
      "type": "timeseries"
    },
    {
      "datasource": "Loki",
      "fieldConfig": {
        "defaults": {},
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 24,
        "x": 0,
        "y": 22
      },
      "id": 6,
      "options": {
        "dedupStrategy": "none",
        "enableLogDetails": true,
        "prettifyLogMessage": false,
        "showCommonLabels": false,
        "showLabels": false,
        "showTime": true,
        "sortOrder": 1,
        "wrapLogMessage": false
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "{level=\"error\",component=\"event-handler\"}",
          "refId": "A"
        }
      ],
      "title": "Event Handler Errors (Logs)",
      "type": "logs"
    }
  ],
  "refresh": "30s",
  "schemaVersion": 27,
  "style": "dark",
  "tags": ["a4co", "events", "monitoring"],
  "templating": {
    "list": [
      {
        "current": {
          "selected": false,
          "text": "5m",
          "value": "5m"
        },
        "hide": 0,
        "includeAll": false,
        "label": "Time Range",
        "multi": false,
        "name": "time_range",
        "options": [
          {
            "selected": true,
            "text": "5m",
            "value": "5m"
          },
          {
            "selected": false,
            "text": "15m",
            "value": "15m"
          },
          {
            "selected": false,
            "text": "1h",
            "value": "1h"
          }
        ],
        "query": "5m,15m,1h",
        "queryValue": "",
        "skipUrlSync": false,
        "sort": 0,
        "type": "custom"
      }
    ]
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "A4CO - Event Tracking Dashboard",
  "uid": "a4co-events",
  "version": 0
}
```

### 2. NATS Dashboard

Create `config/grafana/dashboards/a4co-nats-dashboard.json`:

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "Prometheus",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": null,
  "links": [],
  "panels": [
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Connections",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "nats_server_clients_total",
          "legendFormat": "Connected Clients",
          "refId": "A"
        }
      ],
      "title": "NATS Connected Clients",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Messages/sec",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 0
      },
      "id": 3,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "rate(nats_server_messages_recv[5m])",
          "legendFormat": "Received",
          "refId": "A"
        },
        {
          "expr": "rate(nats_server_messages_sent[5m])",
          "legendFormat": "Sent",
          "refId": "B"
        }
      ],
      "title": "NATS Message Throughput",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Bytes/sec",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 8
      },
      "id": 4,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "rate(nats_server_bytes_recv[5m])",
          "legendFormat": "Received",
          "refId": "A"
        },
        {
          "expr": "rate(nats_server_bytes_sent[5m])",
          "legendFormat": "Sent",
          "refId": "B"
        }
      ],
      "title": "NATS Byte Throughput",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "MB",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 8
      },
      "id": 5,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "nats_server_mem_bytes / 1024 / 1024",
          "legendFormat": "Memory Usage",
          "refId": "A"
        }
      ],
      "title": "NATS Memory Usage",
      "type": "timeseries"
    },
    {
      "datasource": "Prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "Streams",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 24,
        "x": 0,
        "y": 16
      },
      "id": 6,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.0.0",
      "targets": [
        {
          "expr": "nats_jetstream_streams",
          "legendFormat": "Streams",
          "refId": "A"
        },
        {
          "expr": "nats_jetstream_consumers",
          "legendFormat": "Consumers",
          "refId": "B"
        }
      ],
      "title": "NATS JetStream Streams & Consumers",
      "type": "timeseries"
    }
  ],
  "refresh": "30s",
  "schemaVersion": 27,
  "style": "dark",
  "tags": ["a4co", "nats", "monitoring"],
  "templating": {
    "list": []
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "A4CO - NATS Monitoring Dashboard",
  "uid": "a4co-nats",
  "version": 0
}
```

---

## Implementation Steps

### Phase 1: Infrastructure Setup (Days 1-2)

#### Step 1.1: Create Configuration Directory Structure
```bash
# Create directory structure
mkdir -p config/{grafana/{datasources,dashboards},prometheus,loki,nats,alertmanager}

# Initialize configuration files
touch config/prometheus.yml
touch config/loki-config.yml
touch config/promtail-config.yml
touch config/nats.conf
touch config/alertmanager.yml
```

#### Step 1.2: Populate Configuration Files
Copy the configuration files from sections above into their respective locations.

#### Step 1.3: Deploy Using Docker Compose
```bash
# Build and start services
docker-compose -f docker-compose.observability.yml up -d

# Verify services
docker-compose -f docker-compose.observability.yml ps

# Check logs
docker-compose -f docker-compose.observability.yml logs -f loki
docker-compose -f docker-compose.observability.yml logs -f grafana
```

### Phase 2: Grafana Setup (Days 2-3)

#### Step 2.1: Access Grafana
- Navigate to http://localhost:3000
- Default credentials: admin/admin
- Change password immediately

#### Step 2.2: Configure Datasources
1. Go to Configuration → Data Sources
2. Add Prometheus (http://prometheus:9090)
3. Add Loki (http://loki:3100)
4. Test connections

#### Step 2.3: Import Dashboards
1. Go to Dashboards → Manage
2. Create new dashboard from JSON
3. Import the dashboard JSONs from config/grafana/dashboards/

#### Step 2.4: Create Alert Rules
```bash
# Add to prometheus.yml
rule_files:
  - 'alerts.yml'

# Create alerts.yml
touch config/alerts.yml
```

### Phase 3: NATS & Metrics Integration (Days 3-4)

#### Step 3.1: Verify NATS is Running
```bash
# Check NATS health
curl http://localhost:8222/varz

# Check JetStream status
curl http://localhost:8222/jsz
```

#### Step 3.2: Test NATS Connection
```bash
# Use nats-cli to test
docker exec -it nats nats server list

# Publish test message
docker exec -it nats nats pub "test.subject" "hello world"
```

#### Step 3.3: Verify Exporter Metrics
```bash
# Check NATS exporter
curl http://localhost:7777/metrics | grep nats_

# Verify Prometheus scrape
curl http://localhost:9090/api/v1/query?query=nats_server_clients_total
```

### Phase 4: Application Integration (Days 4-5)

#### Step 4.1: Add Prometheus Instrumentation
```go
import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

// Register metrics
var (
    eventPublished = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "event_published_total",
            Help: "Total events published",
        },
        []string{"event_type", "service"},
    )
    
    eventProcessed = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "event_processing_duration_seconds",
            Help: "Event processing duration",
            Buckets: prometheus.DefBuckets,
        },
        []string{"event_type"},
    )
)

// In main.go
func init() {
    prometheus.MustRegister(eventPublished)
    prometheus.MustRegister(eventProcessed)
}

// Expose metrics endpoint
http.Handle("/metrics", promhttp.Handler())
```

#### Step 4.2: Add Logging Integration
```go
import "github.com/grafana/loki-client-go/loki"

// Configure Loki client
logCfg := loki.Config{
    URL:      flag.String("loki.url", "http://loki:3100", "Loki URL"),
    TenantID: flag.String("loki.tenant-id", "a4co", "Tenant ID"),
}

// Initialize logger
client, err := loki.New(logCfg)
```

#### Step 4.3: NATS Event Publishing
```go
// Publish events with metrics
func PublishEvent(ctx context.Context, eventType string, data interface{}) error {
    startTime := time.Now()
    
    // Publish to NATS
    err := nc.Publish(eventType, marshalledData)
    
    // Record metrics
    eventPublished.WithLabelValues(eventType, "my-service").Inc()
    eventProcessed.WithLabelValues(eventType).Observe(time.Since(startTime).Seconds())
    
    return err
}
```

### Phase 5: Testing & Validation (Days 5-6)

#### Step 5.1: Generate Test Data
```bash
# Create test event generator
cat > load-test.sh << 'EOF'
#!/bin/bash
for i in {1..1000}; do
    docker exec nats nats pub "events.created" "event_$i" &
done
wait
EOF

chmod +x load-test.sh
./load-test.sh
```

#### Step 5.2: Validate Metrics
```bash
# Check metrics in Prometheus
# Navigate to http://localhost:9090/graph
# Query: rate(event_published_total[5m])

# Check logs in Loki
# Navigate to Explore in Grafana
# Query: {service="my-service"}
```

#### Step 5.3: Test Alerting
```bash
# Trigger test alert
docker exec prometheus kill -HUP 1

# Check AlertManager
curl http://localhost:9093/api/v1/alerts
```

### Phase 6: Documentation & Handover (Days 6-7)

#### Step 6.1: Create Runbooks
```bash
# Create runbook directory
mkdir -p docs/runbooks

# Create runbook templates for common issues
```

#### Step 6.2: Team Training
- Conduct Grafana dashboard walkthrough
- Explain alert handling procedures
- Review NATS monitoring best practices

#### Step 6.3: Performance Tuning
- Adjust retention policies
- Optimize query performance
- Configure backup strategies

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Grafana Datasource Connection Failing
**Problem:** "Unable to connect to Prometheus/Loki"

**Solution:**
```bash
# Check service connectivity
docker exec grafana curl http://prometheus:9090/-/healthy
docker exec grafana curl http://loki:3100/ready

# Check network
docker network ls
docker network inspect a4co-ddd-microservices_observability

# Restart services
docker-compose -f docker-compose.observability.yml restart grafana
```

#### 2. Loki Out of Memory
**Problem:** "loki is killed by OOMKiller"

**Solution:**
```yaml
# In docker-compose.observability.yml, add memory limits
loki:
  deploy:
    resources:
      limits:
        memory: 2G
      reservations:
        memory: 1G
```

#### 3. NATS Exporter Not Scraping
**Problem:** NATS metrics not appearing in Prometheus

**Solution:**
```bash
# Check exporter is running
docker-compose -f docker-compose.observability.yml ps | grep exporter

# Test exporter endpoint
curl http://localhost:7777/metrics

# Check Prometheus targets
# Navigate to http://localhost:9090/targets
```

#### 4. Missing Logs in Loki
**Problem:** Application logs not appearing in Loki

**Solution:**
```bash
# Verify Promtail is running
docker-compose -f docker-compose.observability.yml logs promtail

# Check log paths in config
# Verify application is writing logs to correct location
docker exec <app-container> tail -f /var/log/app/app.log

# Restart Promtail
docker-compose -f docker-compose.observability.yml restart promtail
```

### Performance Troubleshooting

#### High Memory Usage
```bash
# Check which service uses memory
docker stats

# Reduce retention in Loki
# In loki-config.yml, reduce: retention_period: 168h (7 days)

# Optimize Prometheus
# In prometheus.yml, reduce scrape_interval
```

#### Slow Queries
```bash
# Check Prometheus WAL
du -sh /var/lib/docker/volumes/prometheus_data/_data

# Optimize query performance
# Use recording rules in prometheus.yml
```

---

## Appendix

### A. Useful Commands

```bash
# View running services
docker-compose -f docker-compose.observability.yml ps

# View logs
docker-compose -f docker-compose.observability.yml logs -f <service>

# Execute commands in container
docker exec -it <container> <command>

# SSH into container
docker exec -it <container> sh

# Scale services
docker-compose -f docker-compose.observability.yml up -d --scale <service>=3

# Cleanup
docker-compose -f docker-compose.observability.yml down -v
```

### B. Kubernetes Deployment

For production Kubernetes deployment:

```yaml
# Create namespace
kubectl create namespace observability

# Deploy Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n observability

# Deploy Loki Stack
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack -n observability
```

### C. Alerting Rules Example

```yaml
groups:
  - name: a4co.rules
    interval: 30s
    rules:
      - alert: HighEventProcessingLatency
        expr: histogram_quantile(0.95, event_processing_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "High event processing latency"
          
      - alert: NATSClientConnectionsHigh
        expr: nats_server_clients_total > 1000
        for: 5m
        annotations:
          summary: "High NATS client connections"
```

### D. Recording Rules Example

```yaml
groups:
  - name: a4co.recording
    interval: 30s
    rules:
      - record: event:rate:5m
        expr: rate(event_published_total[5m])
        
      - record: event:processing_latency:p95
        expr: histogram_quantile(0.95, rate(event_processing_duration_seconds_bucket[5m]))
```

### E. Retention & Backup Policy

```bash
# Prometheus retention (in prometheus.yml)
--storage.tsdb.retention.time=30d

# Loki retention (in loki-config.yml)
retention_period: 744h  # 31 days

# Backup strategy
*/6 * * * * /scripts/backup-prometheus.sh
*/12 * * * * /scripts/backup-loki.sh
```

---

## References & Resources

- **Grafana Documentation:** https://grafana.com/docs/
- **Prometheus Documentation:** https://prometheus.io/docs/
- **Loki Documentation:** https://grafana.com/docs/loki/latest/
- **NATS Documentation:** https://docs.nats.io/
- **OpenTelemetry:** https://opentelemetry.io/

---

## Support & Escalation

### Getting Help

1. **Check Logs:** Review service logs for errors
2. **Test Connectivity:** Verify inter-service communication
3. **Review Configuration:** Validate YAML syntax and settings
4. **Consult Documentation:** Reference official docs for the component
5. **Escalate:** Contact DevOps team if issue persists

### Contact Information

- **DevOps Team:** devops@a4co.com
- **On-Call:** Check PagerDuty
- **Slack Channel:** #a4co-observability

---

**Document Version:** 1.0  
**Last Reviewed:** 2025-12-15  
**Next Review:** 2026-03-15
