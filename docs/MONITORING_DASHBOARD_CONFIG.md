# Configuración del Dashboard - A4CO Monitoring Dashboard

## 📁 Estructura de Archivos

```
monitoring-dashboard/
├── server/
│   ├── simple-monitoring-server.js    # Servidor Express.js principal
│   ├── package.json                   # Dependencias del servidor
│   └── public/                        # Archivos estáticos
│       ├── index.html                 # Dashboard principal
│       ├── metrics.html               # Página de métricas detalladas
│       └── styles.css                 # Estilos CSS (Tailwind)
├── data/
│   ├── phase1-metrics.json            # Datos de Phase 1
│   ├── phase2-metrics.json            # Datos de Phase 2
│   └── alerts.json                    # Configuración de alertas
├── docs/
│   ├── MONITORING_DASHBOARD_DOCUMENTATION.md
│   ├── MONITORING_DASHBOARD_DIAGRAMS.md
│   └── MONITORING_DASHBOARD_USE_CASES.md
└── config/
    ├── dashboard-config.json          # Configuración general
    ├── alerts-config.json             # Reglas de alertas
    └── security-config.json           # Configuración de seguridad
```

## ⚙️ Configuración General (dashboard-config.json)

```json
{
  "server": {
    "port": 3003,
    "host": "localhost",
    "autoRefreshInterval": 30000,
    "maxConnections": 100,
    "timeout": 5000
  },
  "data": {
    "phase1DataPath": "./data/phase1-metrics.json",
    "phase2DataPath": "./data/phase2-metrics.json",
    "alertsDataPath": "./data/alerts.json",
    "cacheEnabled": true,
    "cacheTTL": 30000
  },
  "ui": {
    "theme": "light",
    "language": "es",
    "timezone": "Europe/Madrid",
    "dateFormat": "DD/MM/YYYY HH:mm:ss",
    "numberFormat": "es-ES"
  },
  "features": {
    "realTimeUpdates": true,
    "alertNotifications": true,
    "exportData": true,
    "detailedMetrics": true,
    "mobileResponsive": true
  },
  "integrations": {
    "slack": {
      "enabled": false,
      "webhookUrl": "",
      "channel": "#monitoring"
    },
    "pagerduty": {
      "enabled": false,
      "apiKey": "",
      "serviceId": ""
    }
  }
}
```

## 🚨 Configuración de Alertas (alerts-config.json)

```json
{
  "alertRules": [
    {
      "id": "error_rate_high",
      "name": "Tasa de Error Alta",
      "description": "La tasa de error supera el umbral definido",
      "metric": "errorRate",
      "condition": ">",
      "threshold": 2.0,
      "severity": "critical",
      "enabled": true,
      "cooldown": 300000,
      "channels": ["dashboard", "slack"]
    },
    {
      "id": "adoption_low",
      "name": "Adopción Baja",
      "description": "La adopción de features está por debajo del mínimo",
      "metric": "adoptionRate",
      "condition": "<",
      "threshold": 70.0,
      "severity": "warning",
      "enabled": true,
      "cooldown": 600000,
      "channels": ["dashboard"]
    },
    {
      "id": "performance_degraded",
      "name": "Performance Degradada",
      "description": "El tiempo de respuesta supera el límite aceptable",
      "metric": "responseTime",
      "condition": ">",
      "threshold": 2000,
      "severity": "warning",
      "enabled": true,
      "cooldown": 180000,
      "channels": ["dashboard", "pagerduty"]
    },
    {
      "id": "user_satisfaction_low",
      "name": "Satisfacción de Usuario Baja",
      "description": "La satisfacción del usuario está por debajo del estándar",
      "metric": "userSatisfaction",
      "condition": "<",
      "threshold": 4.0,
      "severity": "info",
      "enabled": true,
      "cooldown": 3600000,
      "channels": ["dashboard"]
    }
  ],
  "notificationSettings": {
    "email": {
      "enabled": false,
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false,
        "auth": {
          "user": "",
          "pass": ""
        }
      },
      "recipients": ["team@a4co.com"]
    },
    "slack": {
      "enabled": false,
      "webhookUrl": "",
      "username": "A4CO Monitoring",
      "channel": "#alerts",
      "iconEmoji": ":warning:"
    },
    "pagerduty": {
      "enabled": false,
      "apiKey": "",
      "serviceId": "",
      "escalationPolicyId": ""
    }
  }
}
```

## 🔒 Configuración de Seguridad (security-config.json)

```json
{
  "authentication": {
    "enabled": false,
    "method": "jwt",
    "jwt": {
      "secret": "your-jwt-secret-key",
      "expiresIn": "24h",
      "issuer": "a4co-monitoring-dashboard",
      "audience": "a4co-users"
    },
    "oauth": {
      "enabled": false,
      "provider": "google",
      "clientId": "",
      "clientSecret": "",
      "redirectUrl": "http://localhost:3003/auth/callback"
    }
  },
  "authorization": {
    "enabled": false,
    "roles": {
      "admin": {
        "permissions": ["read", "write", "delete", "admin"],
        "users": ["admin@a4co.com"]
      },
      "viewer": {
        "permissions": ["read"],
        "users": ["viewer@a4co.com"]
      }
    }
  },
  "network": {
    "https": {
      "enabled": false,
      "keyPath": "./ssl/private.key",
      "certPath": "./ssl/certificate.crt"
    },
    "cors": {
      "enabled": true,
      "origins": ["http://localhost:3000", "http://localhost:3001"],
      "methods": ["GET", "POST", "PUT", "DELETE"],
      "headers": ["Content-Type", "Authorization"]
    },
    "rateLimiting": {
      "enabled": true,
      "windowMs": 900000,
      "maxRequests": 100,
      "skipSuccessfulRequests": false,
      "skipFailedRequests": false
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "file": "./logs/security.log",
    "maxSize": "10m",
    "maxFiles": 5
  }
}
```

## 🚀 Guía de Instalación y Configuración

### 1. Instalación de Dependencias

```bash
cd monitoring-dashboard/server
npm install
```

### 2. Configuración Inicial

```bash
# Copiar archivos de configuración de ejemplo
cp config/dashboard-config.json.example config/dashboard-config.json
cp config/alerts-config.json.example config/alerts-config.json
cp config/security-config.json.example config/security-config.json

# Editar configuraciones según necesidades
nano config/dashboard-config.json
```

### 3. Preparación de Datos

```bash
# Crear directorio de datos
mkdir -p data

# Copiar datos de ejemplo
cp data/phase1-metrics.json.example data/phase1-metrics.json
cp data/phase2-metrics.json.example data/phase2-metrics.json
cp data/alerts.json.example data/alerts.json
```

### 4. Inicio del Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 5. Verificación

```bash
# Verificar que el servidor esté ejecutándose
curl http://localhost:3003/health

# Acceder al dashboard
open http://localhost:3003
```

## 🔧 Configuraciones Avanzadas

### Variables de Entorno

```bash
# Archivo .env
PORT=3003
NODE_ENV=production
JWT_SECRET=your-super-secret-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
PAGERDUTY_API_KEY=your-api-key
```

### Configuración de Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  monitoring-dashboard:
    build: .
    ports:
      - "3003:3003"
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 📊 Monitoreo y Mantenimiento

### Health Checks

```bash
# Endpoint de health check
GET /health

# Respuesta esperada
{
  "status": "healthy",
  "timestamp": "2024-01-25T10:30:00Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

### Logs

```bash
# Ver logs del servidor
tail -f logs/server.log

# Ver logs de seguridad
tail -f logs/security.log

# Ver logs de alertas
tail -f logs/alerts.log
```

### Backup

```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz data/ config/
echo "Backup created: backup_$DATE.tar.gz"
```

### Actualización

```bash
# Actualizar dependencias
npm audit
npm update

# Reiniciar servicios
docker-compose restart monitoring-dashboard
```

---

_Configuración del Dashboard - A4CO Monitoring Dashboard v1.0_</content>
<parameter name="filePath">/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices/docs/MONITORING_DASHBOARD_CONFIG.md
