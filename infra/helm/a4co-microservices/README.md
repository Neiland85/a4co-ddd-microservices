# A4CO Microservices Helm Chart

Helm chart omnicomprensivo para desplegar la plataforma completa de microservicios A4CO en Kubernetes.

## TL;DR

```bash
# Agregar repositorios de dependencias
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update

# Instalar el chart
helm install a4co-microservices . \
  --namespace a4co-production \
  --create-namespace \
  --values values-production.yaml
```

## Introducción

Este chart despliega:

- **5 Microservicios**: Auth, Product, Order, Payment, Inventory
- **PostgreSQL**: Base de datos principal (Bitnami chart)
- **NATS JetStream**: Message broker para comunicación asíncrona
- **Redis**: Cache y session store
- **Observability Stack**: Prometheus, Grafana, Jaeger (opcional)

## Prerrequisitos

- Kubernetes 1.25+
- Helm 3.8+
- PV provisioner (para persistent volumes)
- Ingress Controller (NGINX recomendado)
- Cert-manager (para TLS automático)
- External Secrets Operator (para gestión de secretos)

## Instalación

### Método 1: Usando scripts automatizados

```bash
# Desde la raíz del repositorio
./scripts/k8s-deploy.sh [dev|staging|production]
```

### Método 2: Helm manual

```bash
# Actualizar dependencias
helm dependency update

# Instalar/Actualizar
helm upgrade --install a4co-microservices . \
  --namespace a4co-production \
  --create-namespace \
  --values values-production.yaml \
  --timeout 10m \
  --wait
```

## Configuración

### Archivos de valores

- `values.yaml` - Valores por defecto (production)
- `values-dev.yaml` - Configuración de desarrollo
- `values-staging.yaml` - Configuración de staging
- `values-production.yaml` - Configuración de producción

### Parámetros principales

#### Global

| Parámetro | Descripción | Default |
|-----------|-------------|---------|
| `global.environment` | Ambiente de deployment | `production` |
| `global.imageRegistry` | Registry de imágenes Docker | `ghcr.io` |
| `global.domain` | Dominio principal | `a4co.com` |
| `global.database.host` | Host de PostgreSQL | `postgresql` |
| `global.nats.host` | Host de NATS | `nats` |
| `global.redis.host` | Host de Redis | `redis-master` |

#### Microservicios

Cada microservicio acepta los siguientes parámetros:

| Parámetro | Descripción | Default |
|-----------|-------------|---------|
| `enabled` | Habilitar el servicio | `true` |
| `replicaCount` | Número de réplicas | `2-3` |
| `image.repository` | Repositorio de imagen | `neiland85/a4co-*` |
| `image.tag` | Tag de imagen | `latest` |
| `resources.requests.cpu` | CPU request | `100-200m` |
| `resources.requests.memory` | Memory request | `128-256Mi` |
| `autoscaling.enabled` | Habilitar HPA | `true` |
| `autoscaling.minReplicas` | Réplicas mínimas | `2-3` |
| `autoscaling.maxReplicas` | Réplicas máximas | `8-15` |

#### Infraestructura

**PostgreSQL**:
```yaml
postgresql:
  enabled: true
  auth:
    username: a4co_user
    database: a4co_prod
    existingSecret: a4co-db-credentials
  primary:
    persistence:
      size: 20Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
```

**NATS**:
```yaml
nats:
  enabled: true
  config:
    cluster:
      replicas: 3
    jetstream:
      enabled: true
      fileStorage:
        size: 10Gi
```

**Redis**:
```yaml
redis:
  enabled: true
  architecture: replication
  replica:
    replicaCount: 2
```

#### Ingress

```yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: api.a4co.com
      paths:
        - path: /api/v1/auth
          service: authService
          port: 3001
  tls:
    - secretName: a4co-api-tls
      hosts:
        - api.a4co.com
```

#### Observabilidad

```yaml
observability:
  enabled: true
  prometheus:
    enabled: true
    retention: 15d
  grafana:
    enabled: true
  jaeger:
    enabled: true
```

## Gestión de Secretos

### Producción (External Secrets Operator)

Los secretos se sincronizan desde AWS Secrets Manager:

```bash
# Crear secretos en AWS
aws secretsmanager create-secret \
  --name a4co/production/jwt \
  --secret-string '{"secret":"your-jwt-secret"}'

aws secretsmanager create-secret \
  --name a4co/production/database \
  --secret-string '{"username":"a4co_user","password":"secure-password"}'

# Los secretos se sincronizan automáticamente
kubectl get externalsecrets -n a4co-production
```

### Desarrollo (Secrets manuales)

```bash
# Crear secretos manualmente
kubectl create secret generic a4co-jwt-secret \
  --from-literal=JWT_SECRET=dev-secret \
  -n a4co-dev

kubectl create secret generic a4co-db-credentials \
  --from-literal=POSTGRES_PASSWORD=postgres \
  -n a4co-dev
```

## Escalado

### Horizontal Pod Autoscaler (HPA)

HPA configurado automáticamente para cada servicio:

```bash
# Ver estado de HPAs
kubectl get hpa -n a4co-production

# Ver métricas
kubectl top pods -n a4co-production
```

### Escalado manual

```bash
# Escalar deployment
kubectl scale deployment order-service --replicas=5 -n a4co-production

# O via Helm
helm upgrade a4co-microservices . \
  --reuse-values \
  --set orderService.replicaCount=5
```

## Monitoreo

### Prometheus

```bash
kubectl port-forward -n a4co-observability svc/prometheus-server 9090:80
# Abrir http://localhost:9090
```

### Grafana

```bash
kubectl port-forward -n a4co-observability svc/grafana 3000:80
# Abrir http://localhost:3000
# Usuario: admin
# Password: ver secret
```

### Jaeger

```bash
kubectl port-forward -n a4co-observability svc/jaeger-query 16686:16686
# Abrir http://localhost:16686
```

## Troubleshooting

### Ver logs

```bash
# Todos los servicios
kubectl logs -f -n a4co-production -l tier=backend

# Servicio específico
kubectl logs -f -n a4co-production -l app=order-service
```

### Debug de pods

```bash
# Describir pod
kubectl describe pod <pod-name> -n a4co-production

# Shell en pod
kubectl exec -it <pod-name> -n a4co-production -- sh

# Ver eventos
kubectl get events -n a4co-production --sort-by='.lastTimestamp'
```

### Port forwarding

```bash
# Forward a un servicio
kubectl port-forward -n a4co-production svc/order-service 3004:3004

# Test
curl http://localhost:3004/health
```

## Actualización

```bash
# Actualizar valores
helm upgrade a4co-microservices . \
  --namespace a4co-production \
  --values values-production.yaml \
  --reuse-values

# Actualizar solo una imagen
helm upgrade a4co-microservices . \
  --reuse-values \
  --set orderService.image.tag=v1.2.0
```

## Rollback

```bash
# Ver historial
helm history a4co-microservices -n a4co-production

# Rollback a versión anterior
helm rollback a4co-microservices -n a4co-production

# Rollback a revisión específica
helm rollback a4co-microservices 3 -n a4co-production
```

## Limpieza

```bash
# Desinstalar release
helm uninstall a4co-microservices -n a4co-production

# Eliminar namespace
kubectl delete namespace a4co-production

# O usar script
./scripts/k8s-cleanup.sh production
```

## Seguridad

- ✅ SecurityContext restrictivos en todos los pods
- ✅ NetworkPolicies configuradas
- ✅ Secretos gestionados con External Secrets Operator
- ✅ TLS/SSL automático con cert-manager
- ✅ RBAC configurado con Service Accounts
- ✅ Pod Disruption Budgets para alta disponibilidad

## Recursos Adicionales

- [Documentación completa](../../../docs/KUBERNETES_DEPLOYMENT.md)
- [Scripts de deployment](../../../scripts/)
- [GitHub](https://github.com/neiland85/a4co-ddd-microservices)

## Licencia

Copyright © 2024 A4CO Team

## Soporte

- Email: team@a4co.com
- Issues: https://github.com/neiland85/a4co-ddd-microservices/issues
