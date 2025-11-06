# 🚀 Guía de Deployment en Producción - A4CO Microservices

Esta guía describe el proceso completo para desplegar los microservicios A4CO en producción de forma segura usando Docker Swarm.

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Preparación de Secretos](#preparación-de-secretos)
4. [Deployment](#deployment)
5. [Health Checks y Monitoring](#health-checks-y-monitoring)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Seguridad](#seguridad)

---

## 🔧 Pre-requisitos

### Software Requerido

- **Docker Engine** >= 24.0
- **Docker Compose** >= 2.0
- **Docker Swarm** (inicializado)
- **Trivy** (opcional, para security scanning)
- **curl** (para health checks)

### Verificar Instalación

```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Swarm
docker info | grep Swarm

# Verificar Trivy (opcional)
trivy --version
```

### Inicializar Docker Swarm

Si Docker Swarm no está inicializado:

```bash
docker swarm init
```

**Nota**: En un entorno multi-nodo, ejecuta este comando solo en el manager node.

---

## ⚙️ Configuración Inicial

### 1. Clonar y Preparar el Repositorio

```bash
git clone <repository-url>
cd a4co-ddd-microservices
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp infra/.env.production.example infra/.env.production

# Editar con valores reales
nano infra/.env.production
# o
vim infra/.env.production
```

**⚠️ IMPORTANTE**: Nunca commitees `infra/.env.production` al repositorio. Está en `.gitignore` por seguridad.

### 3. Variables de Entorno Requeridas

Asegúrate de configurar todas las variables en `infra/.env.production`:

```bash
# Database
POSTGRES_PASSWORD=<strong_password_here>
DATABASE_URL=postgresql://user:password@postgres:5432/a4co_prod

# JWT
JWT_SECRET=<minimum_32_characters_random_string>

# Stripe
STRIPE_SECRET_KEY=sk_live_<your_key>
STRIPE_WEBHOOK_SECRET=whsec_<your_secret>

# Redis
REDIS_PASSWORD=<strong_password_here>

# Version
VERSION=1.0.0
```

**Generar JWT_SECRET seguro**:

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔐 Preparación de Secretos

### Usando Docker Swarm Secrets

Los secretos se gestionan usando Docker Swarm Secrets para máxima seguridad.

#### Opción 1: Script Automatizado (Recomendado)

```bash
# Cargar variables de entorno
source infra/.env.production

# Ejecutar script de setup
./infra/setup-production-secrets.sh
```

El script:
- Valida que todas las variables requeridas estén configuradas
- Crea los secrets en Docker Swarm
- Muestra un resumen de los secrets creados

#### Opción 2: Creación Manual

```bash
# Crear secrets individualmente
echo "your_db_password" | docker secret create db_password -
echo "your_jwt_secret" | docker secret create jwt_secret -
echo "your_stripe_key" | docker secret create stripe_secret_key -
echo "your_webhook_secret" | docker secret create stripe_webhook_secret -
```

#### Verificar Secrets

```bash
docker secret ls
```

Deberías ver:
- `db_password`
- `jwt_secret`
- `stripe_secret_key`
- `stripe_webhook_secret`

---

## 🚀 Deployment

### 1. Security Scan Pre-Deployment (Recomendado)

```bash
# Ejecutar security scan
./scripts/docker-security-scan.sh
```

Este script verifica:
- ✅ Non-root users en Dockerfiles
- ✅ Health checks configurados
- ✅ Versiones de base images pinned
- ✅ Multi-stage builds optimizados
- ✅ Vulnerabilidades con Trivy (si está instalado)
- ✅ Secretos hardcodeados

### 2. Build de Imágenes

```bash
# Build todas las imágenes
docker-compose -f infra/docker/docker-compose.prod.yml build

# O build individual
docker build -f apps/order-service/Dockerfile.prod -t a4co-order-service:latest .
docker build -f apps/payment-service/Dockerfile.prod -t a4co-payment-service:latest .
docker build -f apps/inventory-service/Dockerfile.prod -t a4co-inventory-service:latest .
docker build -f apps/auth-service/Dockerfile.prod -t a4co-auth-service:latest .
docker build -f apps/product-service/Dockerfile.prod -t a4co-product-service:latest .
```

### 3. Tag y Push a Registry (Opcional)

Si usas un registry privado:

```bash
# Tag
docker tag a4co-order-service:latest ghcr.io/neiland85/a4co-order-service:1.0.0
docker tag a4co-payment-service:latest ghcr.io/neiland85/a4co-payment-service:1.0.0
docker tag a4co-inventory-service:latest ghcr.io/neiland85/a4co-inventory-service:1.0.0
docker tag a4co-auth-service:latest ghcr.io/neiland85/a4co-auth-service:1.0.0
docker tag a4co-product-service:latest ghcr.io/neiland85/a4co-product-service:1.0.0

# Push
docker push ghcr.io/neiland85/a4co-order-service:1.0.0
docker push ghcr.io/neiland85/a4co-payment-service:1.0.0
docker push ghcr.io/neiland85/a4co-inventory-service:1.0.0
docker push ghcr.io/neiland85/a4co-auth-service:1.0.0
docker push ghcr.io/neiland85/a4co-product-service:1.0.0
```

### 4. Deploy con Docker Stack

```bash
# Deploy stack completo
docker stack deploy -c infra/docker/docker-compose.prod.yml a4co

# Verificar servicios
docker service ls

# Ver logs
docker service logs a4co_auth-service-prod -f
```

### 5. Verificar Deployment

```bash
# Estado de servicios
docker stack services a4co

# Health checks
docker service ps a4co_auth-service-prod --no-trunc

# Verificar que los servicios están corriendo como non-root
docker exec a4co-auth-service-prod id
# Debe mostrar: uid=1000(node) gid=1000(node)
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

### Verificar Health Status

```bash
# Ver health status de todos los servicios
docker service ls

# Health check manual
curl http://localhost:3001/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3006/health
curl http://localhost:3007/health
```

### Monitoring

Los servicios exponen métricas en los endpoints de health. Configura Prometheus/Grafana para monitoreo continuo.

---

## 🔄 Rollback Procedures

### Rollback a Versión Anterior

#### Opción 1: Rollback usando Tags

```bash
# Cambiar VERSION en .env.production
VERSION=0.9.0

# Redeploy
docker stack deploy -c infra/docker/docker-compose.prod.yml a4co
```

#### Opción 2: Rollback Manual

```bash
# Detener stack actual
docker stack rm a4co

# Esperar a que se detenga completamente
docker stack ps a4co

# Deploy versión anterior
docker stack deploy -c infra/docker/docker-compose.prod.yml a4co
```

#### Opción 3: Rollback de Servicio Individual

```bash
# Scale down servicio problemático
docker service scale a4co_order-service-prod=0

# Deploy versión anterior del servicio
docker service update --image ghcr.io/neiland85/a4co-order-service:0.9.0 a4co_order-service-prod

# Scale up
docker service scale a4co_order-service-prod=1
```

### Verificar Rollback

```bash
# Ver versión desplegada
docker service inspect a4co_order-service-prod --pretty | grep Image

# Verificar health
docker service ps a4co_order-service-prod
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Servicio no inicia

```bash
# Ver logs
docker service logs a4co_auth-service-prod --tail 100

# Ver eventos
docker service ps a4co_auth-service-prod --no-trunc

# Verificar dependencias
docker service ls | grep -E "(postgres|nats|redis)"
```

#### 2. Error de conexión a base de datos

```bash
# Verificar que postgres está corriendo
docker service ps a4co_postgres

# Verificar conexión
docker exec a4co-postgres-prod psql -U a4co_user -d a4co_prod -c "SELECT 1;"

# Verificar DATABASE_URL en .env.production
grep DATABASE_URL infra/.env.production
```

#### 3. Secrets no encontrados

```bash
# Verificar secrets
docker secret ls

# Si faltan, recrearlos
./infra/setup-production-secrets.sh
```

#### 4. Servicio corriendo como root

```bash
# Verificar usuario
docker exec a4co-auth-service-prod id

# Si muestra root, verificar Dockerfile.prod
grep "USER node" apps/auth-service/Dockerfile.prod
```

#### 5. Health check fallando

```bash
# Verificar health check manualmente
docker exec a4co-auth-service-prod curl -f http://localhost:3001/health

# Ver logs del servicio
docker service logs a4co_auth-service-prod --tail 50
```

### Comandos Útiles

```bash
# Ver todos los servicios
docker stack services a4co

# Ver detalles de un servicio
docker service inspect a4co_auth-service-prod --pretty

# Ver logs en tiempo real
docker service logs -f a4co_auth-service-prod

# Ver recursos utilizados
docker stats a4co-auth-service-prod

# Reiniciar un servicio
docker service update --force a4co_auth-service-prod

# Scale de servicios
docker service scale a4co_order-service-prod=3
```

---

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

1. **Non-root users**: Todos los servicios corren como usuario `node` (UID 1000)
2. **Read-only filesystem**: `read_only: true` en docker-compose.prod.yml
3. **Capability dropping**: `cap_drop: ALL` con solo `NET_BIND_SERVICE` necesario
4. **No new privileges**: `security_opt: no-new-privileges:true`
5. **Secrets management**: Docker Swarm Secrets (no hardcoded)
6. **Network segmentation**: Redes separadas para frontend, backend y database
7. **Resource limits**: CPU y memoria limitados por servicio
8. **Health checks**: Monitoreo continuo del estado de servicios

### Verificación de Seguridad

```bash
# Ejecutar security scan
./scripts/docker-security-scan.sh

# Verificar que no hay secretos hardcodeados
grep -r "secret.*=" infra/docker/docker-compose.prod.yml | grep -v "\${"

# Verificar usuarios
docker exec a4co-auth-service-prod id
docker exec a4co-order-service-prod id
docker exec a4co-payment-service-prod id
```

### Actualización de Secretos

Si necesitas rotar secretos:

```bash
# Eliminar secretos antiguos
docker secret rm db_password jwt_secret stripe_secret_key stripe_webhook_secret

# Crear nuevos secretos
./infra/setup-production-secrets.sh

# Actualizar servicios
docker service update --secret-rm db_password --secret-add db_password a4co_auth-service-prod
```

---

## 📚 Referencias

- [Docker Security Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Docker Swarm Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## ✅ Checklist Pre-Deployment

Antes de desplegar en producción, verifica:

- [ ] Docker Swarm inicializado
- [ ] Todos los secrets creados (`docker secret ls`)
- [ ] `.env.production` configurado con valores reales
- [ ] Security scan ejecutado sin errores críticos
- [ ] Imágenes construidas y probadas localmente
- [ ] Health checks funcionando
- [ ] Backup de base de datos realizado
- [ ] Plan de rollback preparado
- [ ] Monitoring configurado
- [ ] Documentación del equipo actualizada

---

## 🆘 Soporte

Para problemas o preguntas:

1. Revisar logs: `docker service logs <service-name>`
2. Verificar health checks
3. Consultar esta documentación
4. Contactar al equipo de DevOps

---

**Última actualización**: $(date +%Y-%m-%d)
