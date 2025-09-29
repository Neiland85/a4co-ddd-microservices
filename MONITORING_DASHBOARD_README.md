# A4CO Monitoring Dashboard

> Dashboard de monitoreo en tiempo real para el rollout de funcionalidades A4CO - Phase 1 Internal Beta y Phase 2 External Beta (25%)

## 📊 Descripción General

El A4CO Monitoring Dashboard es una aplicación web ligera que proporciona visibilidad en tiempo real del progreso del rollout de nuevas funcionalidades. Desarrollado con Express.js y HTML puro con Tailwind CSS, ofrece una interfaz intuitiva para monitorear métricas clave, estados de servicios y alertas durante las fases de beta testing.

### 🎯 Características Principales

- **📈 Monitoreo en Tiempo Real**: Actualización automática cada 30 segundos
- **📱 Diseño Responsive**: Optimizado para desktop y dispositivos móviles
- **🚨 Sistema de Alertas**: Notificaciones automáticas basadas en reglas configurables
- **📊 Métricas Detalladas**: Análisis profundo de KPIs y tendencias
- **🔒 Configurable**: Sistema de configuración flexible para diferentes entornos
- **🎨 UI Moderna**: Interfaz limpia y profesional con Tailwind CSS

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Archivos de datos JSON** en el directorio `data/`

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/a4co/a4co-ddd-microservices.git
   cd a4co-ddd-microservices
   ```

2. **Instalar dependencias**
   ```bash
   cd scripts
   npm install
   ```

3. **Preparar datos**
   ```bash
   # Asegurarse de que existan los archivos de datos
   ls -la ../data/phase1-metrics.json ../data/phase2-metrics.json
   ```

4. **Iniciar el servidor**
   ```bash
   node simple-monitoring-server.js
   ```

5. **Acceder al dashboard**
   - Abrir navegador en: `http://localhost:3003`
   - El dashboard se carga automáticamente

## 📁 Estructura del Proyecto

```
monitoring-dashboard/
├── scripts/
│   └── simple-monitoring-server.js    # Servidor Express.js principal
├── data/
│   ├── phase1-metrics.json            # Datos de Phase 1 Internal Beta
│   ├── phase2-metrics.json            # Datos de Phase 2 External Beta
│   └── alerts.json                    # Configuración de alertas
├── docs/
│   ├── MONITORING_DASHBOARD_DOCUMENTATION.md
│   ├── MONITORING_DASHBOARD_DIAGRAMS.md
│   ├── MONITORING_DASHBOARD_USE_CASES.md
│   ├── MONITORING_DASHBOARD_CONFIG.md
│   └── MONITORING_DASHBOARD_USER_GUIDE.md
├── public/
│   ├── index.html                     # Dashboard principal
│   ├── metrics.html                   # Página de métricas detalladas
│   └── styles.css                     # Estilos CSS
└── config/
    ├── dashboard-config.json          # Configuración general
    ├── alerts-config.json             # Reglas de alertas
    └── security-config.json           # Configuración de seguridad
```

## 📊 Métricas Monitoreadas

### KPIs Principales

| Métrica | Descripción | Umbral Objetivo | Unidad |
|---------|-------------|-----------------|--------|
| **Adopción de Features** | Porcentaje de usuarios que adoptan nuevas funcionalidades | >70% | % |
| **Tasa de Error** | Porcentaje de operaciones con error | <2% | % |
| **Satisfacción Usuario** | Puntuación promedio de experiencia | >4.0 | /5.0 |
| **Performance** | Tiempo de respuesta del sistema | <2000ms | ms |

### Estados de Servicios

- **🟢 Operational**: >99% uptime
- **🟡 Degraded**: 95-99% uptime
- **🔴 Down**: <95% uptime

## 🔧 Configuración

### Archivo de Configuración Principal

```json
{
  "server": {
    "port": 3003,
    "autoRefreshInterval": 30000
  },
  "data": {
    "phase1DataPath": "./data/phase1-metrics.json",
    "phase2DataPath": "./data/phase2-metrics.json"
  },
  "features": {
    "realTimeUpdates": true,
    "alertNotifications": true
  }
}
```

### Variables de Entorno

```bash
# Archivo .env
PORT=3003
NODE_ENV=development
DATA_PATH=./data
CONFIG_PATH=./config
```

## 🚨 Sistema de Alertas

### Reglas de Alertas Predefinidas

| Alerta | Condición | Severidad | Acción |
|--------|-----------|-----------|---------|
| Tasa de Error Alta | >2% | Crítica | Notificación inmediata |
| Adopción Baja | <70% | Advertencia | Revisión requerida |
| Performance Degradada | >2000ms | Advertencia | Optimización |
| Satisfacción Baja | <4.0 | Información | Monitoreo |

### Configuración de Notificaciones

```json
{
  "notificationSettings": {
    "slack": {
      "enabled": true,
      "webhookUrl": "https://hooks.slack.com/...",
      "channel": "#monitoring"
    },
    "email": {
      "enabled": false,
      "recipients": ["team@a4co.com"]
    }
  }
}
```

## 🐳 Despliegue con Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

CMD ["node", "scripts/simple-monitoring-server.js"]
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
      - ./data:/app/data:ro
      - ./config:/app/config:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📈 API Endpoints

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Dashboard principal (HTML) |
| `GET` | `/metrics` | Página de métricas detalladas (HTML) |
| `GET` | `/api/metrics/phase1` | Datos JSON de Phase 1 |
| `GET` | `/api/metrics/phase2` | Datos JSON de Phase 2 |
| `GET` | `/api/alerts` | Estado de alertas |
| `GET` | `/health` | Health check del servicio |

### Ejemplos de Uso

```bash
# Obtener métricas de Phase 1
curl http://localhost:3003/api/metrics/phase1

# Health check
curl http://localhost:3003/health
```

## 🔍 Monitoreo y Logs

### Logs del Servidor

```bash
# Ver logs en tiempo real
tail -f logs/server.log

# Buscar errores específicos
grep "ERROR" logs/server.log

# Logs de las últimas 24 horas
tail -f logs/server.log | grep "$(date -d '1 day ago' +%Y-%m-%d)"
```

### Health Checks

```bash
# Health check básico
curl -f http://localhost:3003/health

# Health check con detalles
curl -H "Accept: application/json" http://localhost:3003/health
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests de integración
npm run test:integration
```

### Tests de Carga

```bash
# Usando Artillery
npm install -g artillery
artillery quick --count 10 --num 50 http://localhost:3003/
```

## 🔒 Seguridad

### Configuración de Seguridad

- **HTTPS**: Configurable para entornos de producción
- **CORS**: Control de orígenes permitidos
- **Rate Limiting**: Protección contra abuso
- **Autenticación**: JWT opcional
- **Autorización**: Control de acceso basado en roles

### Mejores Prácticas

- Mantener dependencias actualizadas
- Usar secrets para configuración sensible
- Implementar logging de seguridad
- Regular backups de configuración

## 📚 Documentación

### Documentos Disponibles

- **[📖 Documentación Técnica](docs/MONITORING_DASHBOARD_DOCUMENTATION.md)**: Arquitectura, implementación y consideraciones técnicas
- **[📊 Diagramas del Sistema](docs/MONITORING_DASHBOARD_DIAGRAMS.md)**: 12 diagramas profesionales explicando el sistema
- **[📋 Casos de Uso](docs/MONITORING_DASHBOARD_USE_CASES.md)**: 10 casos de uso detallados con flujos completos
- **[⚙️ Guía de Configuración](docs/MONITORING_DASHBOARD_CONFIG.md)**: Configuración completa del sistema
- **[👥 Guía de Usuario](docs/MONITORING_DASHBOARD_USER_GUIDE.md)**: Manual completo para usuarios finales

### Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │  Express.js     │    │   JSON Files    │
│   (Frontend)    │◄──►│   Server        │◄──►│   (Data)        │
│                 │    │   (Backend)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Real-time      │    │  REST API       │    │  File System    │
│  Updates        │    │  Endpoints      │    │  Storage        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤝 Contribución

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Estándares de Código

- **ESLint**: Configurado con reglas estrictas
- **Prettier**: Formateo automático de código
- **Husky**: Pre-commit hooks para calidad de código
- **TypeScript**: Tipado estricto donde aplique

### Guías de Desarrollo

- Seguir principios SOLID
- Implementar tests para nuevas funcionalidades
- Actualizar documentación según cambios
- Mantener compatibilidad hacia atrás

## 📝 Changelog

### [v1.2.0] - 2024-01-25
- ✅ Agregado soporte móvil completo
- ✅ Sistema de alertas avanzado
- ✅ Integración con Slack y PagerDuty
- ✅ Documentación completa con 12 diagramas

### [v1.1.0] - 2024-01-20
- ✅ Auto-refresh cada 30 segundos
- ✅ Métricas detalladas por fase
- ✅ UI responsive con Tailwind CSS
- ✅ API REST completa

### [v1.0.0] - 2024-01-15
- ✅ Dashboard básico funcional
- ✅ Monitoreo de métricas principales
- ✅ Estados de servicios
- ✅ Primera versión de producción

## 📞 Soporte

- **📧 Email**: devops@a4co.com
- **💬 Slack**: #monitoring-dashboard
- **🐛 Issues**: [GitHub Issues](https://github.com/a4co/a4co-ddd-microservices/issues)
- **📖 Docs**: [Documentación Completa](docs/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para más detalles.

---

**A4CO Monitoring Dashboard** - Desarrollado con ❤️ por el equipo de DevOps A4CO</content>
<parameter name="filePath">/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices/MONITORING_DASHBOARD_README.md