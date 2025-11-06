# A4CO Kubernetes - Quick Start Guide

Esta guía te llevará desde cero hasta tener la plataforma A4CO desplegada en Kubernetes en menos de 30 minutos.

## 🚀 Instalación Rápida (5 minutos)

### Prerrequisitos

```bash
# Verificar que tienes acceso al cluster
kubectl cluster-info
kubectl get nodes

# Verificar versiones
kubectl version --client  # >= 1.25
helm version              # >= 3.8
```

### Deploy con un solo comando

```bash
# Clonar repositorio
git clone https://github.com/neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices

# Deploy en staging
./scripts/k8s-deploy.sh staging
```

¡Eso es todo! El script:
- ✅ Crea el namespace
- ✅ Instala dependencias (PostgreSQL, NATS, Redis)
- ✅ Despliega los 5 microservicios
- ✅ Configura el Ingress
- ✅ Habilita auto-scaling
- ✅ Configura observabilidad

### Verificar deployment

```bash
# Ver pods
kubectl get pods -n a4co-staging

# Ver servicios
kubectl get svc -n a4co-staging

# Ver ingress
kubectl get ingress -n a4co-staging

# Esperar a que todos estén ready (2-3 minutos)
kubectl wait --for=condition=ready pod -l tier=backend -n a4co-staging --timeout=300s
```

## 🔧 Configuración Básica

### Opción 1: Desarrollo Local (sin secretos externos)

```bash
# Crear secretos manualmente
kubectl create namespace a4co-dev

kubectl create secret generic a4co-jwt-secret \
  --from-literal=JWT_SECRET=dev-jwt-secret-change-this \
  --from-literal=JWT_EXPIRATION=3600 \
  -n a4co-dev

kubectl create secret generic a4co-db-credentials \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=postgres \
  --from-literal=password=postgres \
  --from-literal=postgres-password=postgres \
  --from-literal=DATABASE_URL=postgresql://postgres:postgres@postgresql:5432/a4co_dev \
  -n a4co-dev

kubectl create secret generic a4co-redis-credentials \
  --from-literal=password=redis \
  --from-literal=REDIS_PASSWORD=redis \
  -n a4co-dev

kubectl create secret generic a4co-stripe-credentials \
  --from-literal=STRIPE_SECRET_KEY=sk_test_123 \
  --from-literal=STRIPE_WEBHOOK_SECRET=whsec_test_123 \
  -n a4co-dev

kubectl create secret generic a4co-oauth-credentials \
  --from-literal=GOOGLE_CLIENT_ID=dev-id \
  --from-literal=GOOGLE_CLIENT_SECRET=dev-secret \
  -n a4co-dev

kubectl create secret generic a4co-nats-credentials \
  --from-literal=NATS_USER=nats \
  --from-literal=NATS_PASSWORD=nats \
  -n a4co-dev

# Deploy
./scripts/k8s-deploy.sh dev
```

### Opción 2: Producción (con AWS Secrets Manager)

```bash
# Crear secretos en AWS Secrets Manager
aws secretsmanager create-secret \
  --name a4co/production/jwt \
  --secret-string '{"secret":"your-secure-jwt-secret-here","expiration":"3600"}'

aws secretsmanager create-secret \
  --name a4co/production/database \
  --secret-string '{"username":"a4co_user","password":"secure-password-here","admin_password":"admin-password-here"}'

aws secretsmanager create-secret \
  --name a4co/production/redis \
  --secret-string '{"password":"redis-secure-password"}'

aws secretsmanager create-secret \
  --name a4co/production/stripe \
  --secret-string '{"secret_key":"sk_live_...","publishable_key":"pk_live_...","webhook_secret":"whsec_..."}'

aws secretsmanager create-secret \
  --name a4co/production/oauth \
  --secret-string '{"google_client_id":"...","google_client_secret":"...","github_client_id":"...","github_client_secret":"..."}'

aws secretsmanager create-secret \
  --name a4co/production/nats \
  --secret-string '{"username":"a4co_nats","password":"nats-secure-password"}'

# Deploy
./scripts/k8s-deploy.sh production
```

## 📊 Acceso a la Plataforma

### API Endpoints

Si configuraste Ingress:

```bash
# Obtener URL del Ingress
kubectl get ingress -n a4co-staging

# Endpoints disponibles:
# https://api.staging.a4co.com/api/v1/auth/health
# https://api.staging.a4co.com/api/v1/products
# https://api.staging.a4co.com/api/v1/orders
# https://api.staging.a4co.com/api/v1/payments
# https://api.staging.a4co.com/api/v1/inventory
```

### Port Forwarding (desarrollo local)

```bash
# Auth Service
kubectl port-forward -n a4co-dev svc/auth-service 3001:3001
curl http://localhost:3001/health

# Product Service
kubectl port-forward -n a4co-dev svc/product-service 3003:3003
curl http://localhost:3003/health

# Order Service
kubectl port-forward -n a4co-dev svc/order-service 3004:3004
curl http://localhost:3004/health

# Payment Service
kubectl port-forward -n a4co-dev svc/payment-service 3006:3006
curl http://localhost:3006/health

# Inventory Service
kubectl port-forward -n a4co-dev svc/inventory-service 3007:3007
curl http://localhost:3007/health
```

### Usando el Makefile

```bash
# Port forwarding con Makefile
make port-auth ENVIRONMENT=dev
make port-product ENVIRONMENT=dev
make port-order ENVIRONMENT=dev
```

## 🔍 Monitoreo

### Prometheus

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/prometheus-server 9090:80

# O con Makefile
make port-prometheus

# Abrir navegador
open http://localhost:9090
```

Queries útiles:
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Latencia P95
histogram_quantile(0.95, http_request_duration_seconds_bucket)
```

### Grafana

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/grafana 3000:80

# O con Makefile
make port-grafana

# Obtener password
kubectl get secret -n a4co-observability grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode

# Abrir navegador
open http://localhost:3000
# Usuario: admin
# Password: (del comando anterior)
```

### Jaeger (Tracing)

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/jaeger-query 16686:16686

# O con Makefile
make port-jaeger

# Abrir navegador
open http://localhost:16686
```

## 📝 Comandos Útiles

### Ver Logs

```bash
# Todos los servicios
kubectl logs -f -n a4co-staging -l tier=backend

# Un servicio específico
kubectl logs -f -n a4co-staging -l app=order-service --tail=100

# Con el script
./scripts/k8s-logs.sh staging order

# Con Makefile
make logs-order ENVIRONMENT=staging
```

### Ver Estado

```bash
# Status completo
./scripts/k8s-status.sh staging

# O con Makefile
make status ENVIRONMENT=staging

# Pods
kubectl get pods -n a4co-staging -o wide

# HPA (auto-scaling)
kubectl get hpa -n a4co-staging

# Uso de recursos
kubectl top pods -n a4co-staging
```

### Escalar Servicios

```bash
# Manual
kubectl scale deployment order-service --replicas=5 -n a4co-staging

# Con Makefile
make scale SERVICE=order REPLICAS=5 ENVIRONMENT=staging

# Via Helm
helm upgrade a4co-microservices infra/helm/a4co-microservices \
  --reuse-values \
  --set orderService.replicaCount=5 \
  -n a4co-staging
```

### Reiniciar Servicios

```bash
# Reiniciar un servicio
kubectl rollout restart deployment/order-service -n a4co-staging

# Con Makefile
make restart SERVICE=order ENVIRONMENT=staging
```

## 🔄 Actualización

### Actualizar una imagen

```bash
# Con Helm
helm upgrade a4co-microservices infra/helm/a4co-microservices \
  --reuse-values \
  --set orderService.image.tag=v1.2.0 \
  -n a4co-staging

# O actualizar todo
helm upgrade a4co-microservices infra/helm/a4co-microservices \
  -f infra/helm/a4co-microservices/values-staging.yaml \
  -n a4co-staging
```

### Rollback

```bash
# Ver historial
helm history a4co-microservices -n a4co-staging

# Rollback a versión anterior
helm rollback a4co-microservices -n a4co-staging

# Con script
./scripts/k8s-rollback.sh staging

# Con Makefile
make rollback ENVIRONMENT=staging
```

## 🐛 Troubleshooting Rápido

### Pods no inician

```bash
# Ver eventos
kubectl get events -n a4co-staging --sort-by='.lastTimestamp' | tail -20

# Describir pod
kubectl describe pod <pod-name> -n a4co-staging

# Ver logs (incluso si crasheó)
kubectl logs <pod-name> -n a4co-staging --previous
```

### Servicio no responde

```bash
# Verificar endpoints
kubectl get endpoints -n a4co-staging

# Test de conectividad desde un pod
kubectl run test --rm -it --image=nicolaka/netshoot -n a4co-staging -- bash
# Dentro del pod:
curl http://order-service:3004/health
nslookup order-service
```

### Base de datos

```bash
# Conectar a PostgreSQL
kubectl exec -it -n a4co-staging postgresql-0 -- \
  psql -U a4co_user -d a4co_staging

# Ver logs
kubectl logs -f -n a4co-staging -l app.kubernetes.io/name=postgresql
```

### Ver todo

```bash
# Estado completo
kubectl get all -n a4co-staging

# Con Makefile
make status ENVIRONMENT=staging
```

## 🧹 Limpieza

### Limpiar pods terminados

```bash
kubectl delete pods --field-selector=status.phase==Succeeded -n a4co-staging
kubectl delete pods --field-selector=status.phase==Failed -n a4co-staging

# Con Makefile
make clean-pods ENVIRONMENT=staging
```

### Desinstalar completamente

```bash
# Con script
./scripts/k8s-cleanup.sh staging

# Con Makefile
make clean-all ENVIRONMENT=staging

# Manual
helm uninstall a4co-microservices -n a4co-staging
kubectl delete namespace a4co-staging
```

## 📚 Próximos Pasos

Ahora que tienes la plataforma corriendo:

1. **Configurar DNS** para tu dominio apuntando al LoadBalancer del Ingress
2. **Configurar Cert-manager** para certificados TLS automáticos
3. **Configurar alertas** en Prometheus/Alertmanager
4. **Configurar backups** automáticos de PostgreSQL
5. **Configurar CI/CD** para deployments automáticos

Para documentación completa, ver:
- [KUBERNETES_DEPLOYMENT.md](./KUBERNETES_DEPLOYMENT.md) - Guía completa
- [README del chart](../infra/helm/a4co-microservices/README.md) - Documentación del Helm chart
- [Makefile](../Makefile) - Todos los comandos disponibles

## 🆘 Obtener Ayuda

```bash
# Ver comandos disponibles en Makefile
make help

# Ver comandos disponibles en scripts
./scripts/k8s-deploy.sh --help
./scripts/k8s-status.sh --help
```

## 🎯 Cheatsheet de Comandos

```bash
# Deploy
make deploy ENVIRONMENT=staging
make deploy ENVIRONMENT=production

# Status
make status ENVIRONMENT=staging
make pods ENVIRONMENT=staging
make hpa ENVIRONMENT=staging

# Logs
make logs ENVIRONMENT=staging
make logs-order ENVIRONMENT=staging

# Port forwarding
make port-auth ENVIRONMENT=staging
make port-prometheus

# Scaling
make scale SERVICE=order REPLICAS=5 ENVIRONMENT=staging

# Restart
make restart SERVICE=order ENVIRONMENT=staging

# Rollback
make rollback ENVIRONMENT=staging

# Cleanup
make clean-pods ENVIRONMENT=staging
make clean-all ENVIRONMENT=staging
```

---

**¡Felicitaciones!** 🎉 Ya tienes la plataforma A4CO corriendo en Kubernetes.

Para cualquier duda: team@a4co.com
