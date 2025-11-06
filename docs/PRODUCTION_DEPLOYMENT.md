# 🚀 Guía de Deployment en Producción - A4CO Microservices

Esta guía describe el proceso completo para desplegar los microservicios A4CO en producción de forma segura usando Docker.

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Configuración de Secretos](#configuración-de-secretos)
4. [Build de Imágenes](#build-de-imágenes)
5. [Deployment](#deployment)
6. [Health Checks y Monitoring](#health-checks-y-monitoring)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)

---

## 🔧 Pre-requisitos

### Software Requerido

- **Docker**: Versión 24.0 o superior
- **Docker Compose**: Versión 2.0 o superior
- **Docker Swarm** (opcional, para producción): Para gestión de secretos
- **Trivy** (opcional): Para escaneo de seguridad

### Verificación de Pre-requisitos

```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Docker Swarm (si se usa)
docker info | grep Swarm

# Verificar Trivy (opcional)
trivy --version
```

### Permisos

Asegúrate de tener permisos para:
- Ejecutar Docker sin sudo (o usar sudo según tu configuración)
- Crear secrets de Docker Swarm
- Acceder a la red donde se desplegarán los servicios

---

## ⚙️ Configuración Inicial

### 1. Clonar y Preparar el Repositorio

```bash
# Clonar el repositorio
git clone <repository-url>
cd a4co-ddd-microservices

# Verificar que todos los archivos necesarios existen
ls -la apps/*/Dockerfile.prod
ls -la infra/docker/docker-compose.prod.yml
ls -la infra/.env.production.example
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp infra/.env.production.example infra/.env.production

# Editar con tus valores reales
nano infra/.env.production  # o usar tu editor preferido
```

**⚠️ IMPORTANTE**: Nunca commitees el archivo `.env.production` al repositorio. Está en `.gitignore` por seguridad.

### 3. Validar Configuración

```bash
# Verificar que todas las variables requeridas están configuradas
source infra/.env.production
echo "Database: ${POSTGRES_DB}"
echo "JWT Secret configured: $([ -n "$JWT_SECRET" ] && echo 'Yes' || echo 'No')"
echo "Stripe Key configured: $([ -n "$STRIPE_SECRET_KEY" ] && echo 'Yes' || echo 'No')"
```

---

## 🔐 Configuración de Secretos

### Opción 1: Docker Swarm Secrets (Recomendado para Producción)

```bash
# Inicializar Docker Swarm (si no está inicializado)
docker swarm init

# Ejecutar el script de configuración de secretos
source infra/.env.production
./infra/setup-production-secrets.sh
```

El script creará los siguientes secrets:
- `db_password`: Contraseña de PostgreSQL
- `jwt_secret`: Secret para JWT tokens
- `stripe_secret_key`: API key de Stripe
- `stripe_webhook_secret`: Webhook secret de Stripe
- `redis_password`: Contraseña de Redis

### Opción 2: Variables de Entorno (Desarrollo/Testing)

Si no usas Docker Swarm, los secretos se cargarán desde `.env.production`:

```bash
# Cargar variables de entorno
export $(cat infra/.env.production | xargs)

# Verificar que están cargadas
env | grep -E "(JWT_SECRET|STRIPE_SECRET|POSTGRES_PASSWORD)"
```

---

## 🏗️ Build de Imágenes

### Build Individual de Servicios

```bash
# Order Service
docker build -f apps/order-service/Dockerfile.prod -t a4co-order-service:latest .

# Payment Service
docker build -f apps/payment-service/Dockerfile.prod -t a4co-payment-service:latest .

# Inventory Service
docker build -f apps/inventory-service/Dockerfile.prod -t a4co-inventory-service:latest .

# Auth Service
docker build -f apps/auth-service/Dockerfile.prod -t a4co-auth-service:latest .

# Product Service
docker build -f apps/product-service/Dockerfile.prod -t a4co-product-service:latest .
```

### Build con Docker Compose

```bash
# Build todas las imágenes
docker-compose -f infra/docker/docker-compose.prod.yml build

# Build con cache
docker-compose -f infra/docker/docker-compose.prod.yml build --parallel
```

### Verificar Builds

```bash
# Listar imágenes creadas
docker images | grep a4co

# Verificar que no corren como root
docker run --rm a4co-order-service:latest id
# Debe mostrar: uid=1000(node) gid=1000(node)
```

---

## 🚀 Deployment

### Opción 1: Docker Compose (Recomendado para desarrollo/testing)

```bash
# Levantar todos los servicios
docker-compose -f infra/docker/docker-compose.prod.yml up -d

# Ver logs
docker-compose -f infra/docker/docker-compose.prod.yml logs -f

# Ver estado de servicios
docker-compose -f infra/docker/docker-compose.prod.yml ps
```

### Opción 2: Docker Swarm (Recomendado para producción)

```bash
# Desplegar stack
docker stack deploy -c infra/docker/docker-compose.prod.yml a4co

# Ver servicios del stack
docker stack services a4co

# Ver logs
docker service logs a4co_auth-service -f

# Escalar servicios (ejemplo)
docker service scale a4co_order-service=3
```

### Verificar Deployment

```bash
# Verificar que todos los servicios están corriendo
docker-compose -f infra/docker/docker-compose.prod.yml ps

# Verificar health checks
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service curl -f http://localhost:3001/health

# Verificar logs sin errores
docker-compose -f infra/docker/docker-compose.prod.yml logs | grep -i error
```

---

## 🏥 Health Checks y Monitoring

### Health Checks Configurados

Cada servicio tiene un health check configurado:

- **Auth Service**: `http://localhost:3001/health`
- **Product Service**: `http://localhost:3003/health`
- **Order Service**: `http://localhost:3004/health`
- **Payment Service**: `http://localhost:3006/health`
- **Inventory Service**: `http://localhost:3007/health`

### Verificar Health Checks

```bash
# Verificar health status de todos los servicios
docker-compose -f infra/docker/docker-compose.prod.yml ps

# Verificar health check específico
docker inspect a4co-auth-service-prod | grep -A 10 Healthcheck

# Test manual de health endpoint
curl http://localhost:3001/health
```

### Monitoring

Los servicios están configurados para:
- Exponer métricas en endpoints `/metrics` (si está configurado)
- Logging estructurado
- Tracing distribuido (si está configurado)

---

## 🔄 Rollback Procedures

### Rollback con Docker Compose

```bash
# Detener servicios actuales
docker-compose -f infra/docker/docker-compose.prod.yml down

# Cambiar a versión anterior en .env.production
# VERSION=1.0.0  # versión anterior

# Rebuild y restart
docker-compose -f infra/docker/docker-compose.prod.yml build
docker-compose -f infra/docker/docker-compose.prod.yml up -d
```

### Rollback con Docker Swarm

```bash
# Ver versiones disponibles
docker images | grep a4co-order-service

# Actualizar servicio a versión anterior
docker service update --image a4co-order-service:1.0.0 a4co_order-service

# Verificar rollback
docker service ps a4co_order-service
```

### Rollback de Base de Datos

```bash
# Backup antes de cambios importantes
docker exec a4co-postgres-prod pg_dump -U a4co_user a4co_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i a4co-postgres-prod psql -U a4co_user a4co_prod < backup_YYYYMMDD_HHMMSS.sql
```

---

## 🐛 Troubleshooting

### Problema: Servicios no inician

```bash
# Ver logs detallados
docker-compose -f infra/docker/docker-compose.prod.yml logs service-name

# Verificar variables de entorno
docker-compose -f infra/docker/docker-compose.prod.yml config

# Verificar conectividad entre servicios
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service ping postgres
```

### Problema: Health checks fallan

```bash
# Verificar que el endpoint existe
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service curl -v http://localhost:3001/health

# Verificar logs del servicio
docker-compose -f infra/docker/docker-compose.prod.yml logs auth-service | tail -50
```

### Problema: Permisos denegados

```bash
# Verificar que el usuario no es root
docker run --rm a4co-order-service:latest id

# Verificar permisos de volúmenes
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service ls -la /app
```

### Problema: Secretos no disponibles

```bash
# Verificar secrets en Swarm
docker secret ls

# Verificar que los secrets están montados
docker inspect a4co-auth-service-prod | grep -A 5 Secrets
```

### Problema: Imágenes no se construyen

```bash
# Limpiar cache y rebuild
docker builder prune
docker-compose -f infra/docker/docker-compose.prod.yml build --no-cache

# Verificar Dockerfile
docker build -f apps/order-service/Dockerfile.prod -t test-build . --progress=plain
```

---

## 🔒 Security Best Practices

### Checklist de Seguridad

- ✅ Todos los servicios corren como usuario `node` (non-root)
- ✅ Secrets no están hardcodeados en docker-compose
- ✅ Health checks configurados en todos los servicios
- ✅ Resource limits configurados
- ✅ Security contexts aplicados (`cap_drop: ALL`, `no-new-privileges`)
- ✅ Read-only root filesystem donde sea posible
- ✅ Networks segmentadas (frontend, backend, database)
- ✅ Versiones específicas de imágenes base (no `latest`)

### Security Scanning

```bash
# Ejecutar scan de seguridad
./scripts/docker-security-scan.sh

# Scan manual con Trivy
trivy image a4co-order-service:latest
```

### Actualización de Imágenes Base

```bash
# Verificar vulnerabilidades en imágenes base
trivy image node:22.11-alpine

# Actualizar Dockerfiles con nuevas versiones cuando sea necesario
```

### Rotación de Secretos

```bash
# Actualizar secret en Swarm
echo "new-secret-value" | docker secret create jwt_secret_v2 -

# Actualizar servicio para usar nuevo secret
docker service update --secret-rm jwt_secret --secret-add jwt_secret_v2 a4co_auth-service

# Eliminar secret antiguo (después de verificar que funciona)
docker secret rm jwt_secret
```

---

## 📊 Validación Post-Deployment

### Checklist de Validación

```bash
# 1. Todos los servicios están corriendo
docker-compose -f infra/docker/docker-compose.prod.yml ps

# 2. Health checks pasan
for port in 3001 3003 3004 3006 3007; do
  curl -f http://localhost:$port/health && echo "✅ Port $port OK" || echo "❌ Port $port FAILED"
done

# 3. Base de datos conectada
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service node -e "console.log('DB connection test')"

# 4. NATS conectado
docker-compose -f infra/docker/docker-compose.prod.yml exec order-service ping nats

# 5. Redis conectado
docker-compose -f infra/docker/docker-compose.prod.yml exec auth-service redis-cli -h redis ping
```

---

## 📚 Referencias

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)

---

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar logs: `docker-compose -f infra/docker/docker-compose.prod.yml logs`
2. Verificar configuración: `docker-compose -f infra/docker/docker-compose.prod.yml config`
3. Consultar documentación de troubleshooting arriba
4. Contactar al equipo de DevOps

---

**Última actualización**: 2025-01-XX
**Versión**: 1.0.0
