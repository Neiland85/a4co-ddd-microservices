# A4CO Microservices Platform - Kubernetes Deployment Guide

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Prerrequisitos](#prerrequisitos)
4. [Instalación Inicial](#instalación-inicial)
5. [Configuración de Entornos](#configuración-de-entornos)
6. [Gestión de Secretos](#gestión-de-secretos)
7. [Deployment](#deployment)
8. [Escalado y Auto-scaling](#escalado-y-auto-scaling)
9. [Monitoreo y Observabilidad](#monitoreo-y-observabilidad)
10. [Troubleshooting](#troubleshooting)
11. [Rollback](#rollback)
12. [Seguridad](#seguridad)
13. [Mantenimiento](#mantenimiento)

---

## Introducción

Este documento describe el proceso completo de deployment de la plataforma A4CO Microservices en Kubernetes utilizando Helm charts.

### Componentes de la Plataforma

- **5 Microservicios Backend**:
  - Auth Service (Puerto 3001)
  - Product Service (Puerto 3003)
  - Order Service (Puerto 3004)
  - Payment Service (Puerto 3006)
  - Inventory Service (Puerto 3007)

- **Infraestructura**:
  - PostgreSQL (Base de datos principal)
  - NATS JetStream (Message broker)
  - Redis (Cache y session store)

- **Observabilidad**:
  - Prometheus (Métricas)
  - Grafana (Dashboards)
  - Jaeger (Distributed tracing)

---

## Arquitectura

### Arquitectura de Kubernetes

```
┌─────────────────────────────────────────────────────────────────┐
│                         Ingress (NGINX)                          │
│                    api.a4co.com (TLS/SSL)                       │
└────────┬────────────────────────────────────────────────────────┘
         │
         ├──────► /api/v1/auth     ──► Auth Service (3 replicas)
         ├──────► /api/v1/products ──► Product Service (2 replicas)
         ├──────► /api/v1/orders   ──► Order Service (3 replicas)
         ├──────► /api/v1/payments ──► Payment Service (3 replicas)
         └──────► /api/v1/inventory ──► Inventory Service (2 replicas)
                       │
                       ├──────► PostgreSQL (Primary + Replicas)
                       ├──────► NATS JetStream (3-node cluster)
                       └──────► Redis (Master + Replicas)
```

### Componentes de Seguridad

- **NetworkPolicies**: Segmentación de red entre pods
- **External Secrets Operator**: Gestión de secretos desde AWS Secrets Manager
- **Pod Security Standards**: SecurityContext restrictivos
- **Service Accounts**: RBAC configurado para cada servicio
- **TLS/SSL**: Certificados automáticos con cert-manager

### Auto-scaling

- **HorizontalPodAutoscaler (HPA)**: Basado en CPU y memoria
- **Vertical Pod Autoscaler (VPA)**: Optimización de recursos (opcional)
- **Cluster Autoscaler**: Escalado de nodos (configuración del cluster)

---

## Prerrequisitos

### Herramientas Requeridas

#### 1. kubectl

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verificar instalación
kubectl version --client
```

#### 2. Helm 3

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verificar instalación
helm version
```

#### 3. Docker (para build local)

```bash
# macOS
brew install --cask docker

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar instalación
docker --version
```

### Acceso al Cluster

#### AWS EKS

```bash
# Configurar AWS CLI
aws configure

# Obtener kubeconfig
aws eks update-kubeconfig --name a4co-cluster --region us-east-1

# Verificar acceso
kubectl cluster-info
kubectl get nodes
```

#### Google GKE

```bash
# Autenticar con Google Cloud
gcloud auth login

# Obtener kubeconfig
gcloud container clusters get-credentials a4co-cluster --region us-central1

# Verificar acceso
kubectl cluster-info
```

#### Azure AKS

```bash
# Autenticar con Azure
az login

# Obtener kubeconfig
az aks get-credentials --resource-group a4co-rg --name a4co-cluster

# Verificar acceso
kubectl cluster-info
```

### Requisitos del Cluster

- **Versión de Kubernetes**: 1.25 o superior
- **Nodos mínimos**: 
  - Dev: 2 nodos (t3.medium)
  - Staging: 3 nodos (t3.large)
  - Production: 5+ nodos (t3.xlarge o superior)
- **Storage Class**: gp3 o equivalente
- **Ingress Controller**: NGINX Ingress Controller instalado
- **Cert-manager**: Para gestión de certificados TLS
- **Metrics Server**: Para HPA basado en métricas

### Instalación de Componentes del Cluster

#### NGINX Ingress Controller

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

#### Cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

#### External Secrets Operator

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm repo update

helm install external-secrets external-secrets/external-secrets \
  --namespace external-secrets \
  --create-namespace
```

#### Metrics Server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

## Instalación Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices
```

### 2. Revisar Configuración

```bash
# Navegar al directorio de Helm charts
cd infra/helm/a4co-microservices

# Listar archivos de configuración
ls -la

# Archivos principales:
# - Chart.yaml              (Metadata del chart)
# - values.yaml             (Valores por defecto)
# - values-dev.yaml         (Configuración de desarrollo)
# - values-staging.yaml     (Configuración de staging)
# - values-production.yaml  (Configuración de producción)
```

### 3. Personalizar Configuración

Editar `values-production.yaml` (o el entorno correspondiente):

```yaml
global:
  imageRegistry: ghcr.io
  domain: tudominio.com  # ← Cambiar esto
  
  database:
    host: postgresql
    port: 5432
    name: a4co_prod
    ssl: true

# Configurar recursos según tu cluster
orderService:
  replicaCount: 3
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 512Mi
```

---

## Configuración de Entornos

### Desarrollo (dev)

Configuración optimizada para desarrollo local con recursos mínimos:

```yaml
# values-dev.yaml
global:
  environment: development
  domain: dev.a4co.local
  tls:
    enabled: false

# Replicas mínimas
orderService:
  replicaCount: 1
  autoscaling:
    enabled: false

# Sin observabilidad completa
observability:
  enabled: false
```

**Deployment:**

```bash
./scripts/k8s-deploy.sh dev
```

### Staging

Configuración de pre-producción para testing:

```yaml
# values-staging.yaml
global:
  environment: staging
  domain: staging.a4co.com
  tls:
    enabled: true
    issuer: letsencrypt-staging

# Replicas moderadas
orderService:
  replicaCount: 2
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5

# Observabilidad habilitada
observability:
  enabled: true
```

**Deployment:**

```bash
./scripts/k8s-deploy.sh staging
```

### Production

Configuración de alta disponibilidad para producción:

```yaml
# values-production.yaml
global:
  environment: production
  domain: a4co.com
  tls:
    enabled: true
    issuer: letsencrypt-prod

# Replicas completas con auto-scaling
orderService:
  replicaCount: 3
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 15

# Observabilidad completa
observability:
  enabled: true
  prometheus:
    retention: 30d
    storageSize: 100Gi
```

**Deployment:**

```bash
./scripts/k8s-deploy.sh production
```

---

## Gestión de Secretos

La plataforma utiliza **External Secrets Operator** para sincronizar secretos desde AWS Secrets Manager.

### Configuración de AWS Secrets Manager

#### 1. Crear IAM Role

```bash
# Crear política IAM
cat > external-secrets-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:a4co/*"
    }
  ]
}
EOF

# Crear política
aws iam create-policy \
  --policy-name A4COExternalSecretsPolicy \
  --policy-document file://external-secrets-policy.json

# Crear role para Service Account
eksctl create iamserviceaccount \
  --name external-secrets-sa \
  --namespace a4co-production \
  --cluster a4co-cluster \
  --attach-policy-arn arn:aws:iam::ACCOUNT_ID:policy/A4COExternalSecretsPolicy \
  --approve
```

#### 2. Crear Secretos en AWS

```bash
# JWT Secret
aws secretsmanager create-secret \
  --name a4co/production/jwt \
  --secret-string '{
    "secret": "your-super-secret-jwt-key-change-this",
    "expiration": "3600"
  }'

# Database Credentials
aws secretsmanager create-secret \
  --name a4co/production/database \
  --secret-string '{
    "username": "a4co_user",
    "password": "your-secure-password",
    "admin_password": "your-admin-password"
  }'

# Redis Credentials
aws secretsmanager create-secret \
  --name a4co/production/redis \
  --secret-string '{
    "password": "your-redis-password"
  }'

# Stripe Credentials
aws secretsmanager create-secret \
  --name a4co/production/stripe \
  --secret-string '{
    "secret_key": "sk_live_...",
    "publishable_key": "pk_live_...",
    "webhook_secret": "whsec_..."
  }'

# OAuth Credentials
aws secretsmanager create-secret \
  --name a4co/production/oauth \
  --secret-string '{
    "google_client_id": "your-google-client-id",
    "google_client_secret": "your-google-client-secret",
    "github_client_id": "your-github-client-id",
    "github_client_secret": "your-github-client-secret"
  }'

# NATS Credentials
aws secretsmanager create-secret \
  --name a4co/production/nats \
  --secret-string '{
    "username": "a4co_nats",
    "password": "your-nats-password"
  }'
```

### Desarrollo Local (sin External Secrets)

Para desarrollo local, crear secretos manualmente:

```bash
# Crear namespace
kubectl create namespace a4co-dev

# JWT Secret
kubectl create secret generic a4co-jwt-secret \
  --from-literal=JWT_SECRET=dev-jwt-secret \
  --from-literal=JWT_EXPIRATION=3600 \
  -n a4co-dev

# Database Credentials
kubectl create secret generic a4co-db-credentials \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=postgres \
  --from-literal=password=postgres \
  --from-literal=postgres-password=postgres \
  --from-literal=DATABASE_URL=postgresql://postgres:postgres@postgresql:5432/a4co_dev \
  -n a4co-dev

# Redis Credentials
kubectl create secret generic a4co-redis-credentials \
  --from-literal=password=redis \
  --from-literal=REDIS_PASSWORD=redis \
  -n a4co-dev

# Stripe Credentials (test keys)
kubectl create secret generic a4co-stripe-credentials \
  --from-literal=STRIPE_SECRET_KEY=sk_test_... \
  --from-literal=STRIPE_WEBHOOK_SECRET=whsec_test_... \
  -n a4co-dev

# OAuth Credentials
kubectl create secret generic a4co-oauth-credentials \
  --from-literal=GOOGLE_CLIENT_ID=dev-client-id \
  --from-literal=GOOGLE_CLIENT_SECRET=dev-client-secret \
  -n a4co-dev

# NATS Credentials
kubectl create secret generic a4co-nats-credentials \
  --from-literal=NATS_USER=nats \
  --from-literal=NATS_PASSWORD=nats \
  -n a4co-dev
```

### Verificar External Secrets

```bash
# Ver External Secrets
kubectl get externalsecrets -n a4co-production

# Ver status de sincronización
kubectl describe externalsecret a4co-jwt-secret -n a4co-production

# Verificar que los secrets fueron creados
kubectl get secrets -n a4co-production | grep a4co
```

---

## Deployment

### Usando Scripts de Deployment

El repositorio incluye scripts automatizados para facilitar el deployment:

#### Deployment Completo

```bash
# Development
./scripts/k8s-deploy.sh dev

# Staging
./scripts/k8s-deploy.sh staging

# Production
./scripts/k8s-deploy.sh production
```

El script realiza automáticamente:

1. ✅ Validación de prerrequisitos (kubectl, helm)
2. ✅ Creación de namespace
3. ✅ Actualización de repositorios Helm
4. ✅ Actualización de dependencias del chart
5. ✅ Lint del chart
6. ✅ Dry-run para validación
7. ✅ Deployment real con rollback automático en caso de error
8. ✅ Verificación de pods
9. ✅ Resumen de deployment

#### Verificar Status

```bash
# Ver status completo
./scripts/k8s-status.sh production

# Ver logs
./scripts/k8s-logs.sh production all          # Todos los servicios
./scripts/k8s-logs.sh production order        # Solo order-service
./scripts/k8s-logs.sh production payment      # Solo payment-service
```

### Deployment Manual con Helm

Si prefieres tener más control, puedes usar Helm directamente:

#### 1. Preparación

```bash
# Navegar al directorio del chart
cd infra/helm/a4co-microservices

# Agregar repositorios de dependencias
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add nats https://nats-io.github.io/k8s/helm/charts/
helm repo update

# Actualizar dependencias
helm dependency update
```

#### 2. Validación

```bash
# Lint del chart
helm lint . -f values-production.yaml

# Dry-run (ver manifests sin aplicar)
helm install a4co-microservices . \
  --namespace a4co-production \
  --create-namespace \
  --values values-production.yaml \
  --dry-run --debug
```

#### 3. Deployment

```bash
# Install o upgrade
helm upgrade --install a4co-microservices . \
  --namespace a4co-production \
  --create-namespace \
  --values values-production.yaml \
  --timeout 10m \
  --wait \
  --atomic
```

Flags importantes:
- `--atomic`: Rollback automático si falla
- `--wait`: Espera a que todos los recursos estén ready
- `--timeout 10m`: Timeout de 10 minutos

#### 4. Verificación

```bash
# Ver releases instalados
helm list -n a4co-production

# Ver history
helm history a4co-microservices -n a4co-production

# Ver status
helm status a4co-microservices -n a4co-production
```

### Actualización de Imágenes

Para actualizar solo las imágenes Docker sin cambiar configuración:

```bash
# Actualizar imagen de un servicio específico
helm upgrade a4co-microservices . \
  --namespace a4co-production \
  --reuse-values \
  --set orderService.image.tag=v1.2.0

# Actualizar todas las imágenes
helm upgrade a4co-microservices . \
  --namespace a4co-production \
  --reuse-values \
  --set orderService.image.tag=v1.2.0 \
  --set paymentService.image.tag=v1.2.0 \
  --set inventoryService.image.tag=v1.2.0 \
  --set authService.image.tag=v1.2.0 \
  --set productService.image.tag=v1.2.0
```

### CI/CD Integration

Ejemplo de workflow de GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name a4co-cluster
      
      - name: Install Helm
        uses: azure/setup-helm@v3
        with:
          version: '3.12.0'
      
      - name: Deploy to Kubernetes
        run: |
          cd infra/helm/a4co-microservices
          helm dependency update
          helm upgrade --install a4co-microservices . \
            --namespace a4co-production \
            --values values-production.yaml \
            --set orderService.image.tag=${{ github.sha }} \
            --timeout 10m \
            --wait \
            --atomic
```

---

## Escalado y Auto-scaling

### Horizontal Pod Autoscaler (HPA)

El chart incluye HPA configurado para cada microservicio basado en CPU y memoria.

#### Configuración

En `values.yaml`:

```yaml
orderService:
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 15
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80
```

#### Verificar HPA

```bash
# Ver todos los HPAs
kubectl get hpa -n a4co-production

# Ver detalles de un HPA específico
kubectl describe hpa order-service-hpa -n a4co-production

# Ver métricas en tiempo real
watch kubectl get hpa -n a4co-production
```

#### Métricas Personalizadas

Para escalar basado en métricas personalizadas (ej: requests/second):

```yaml
# En templates/hpa.yaml
metrics:
- type: Pods
  pods:
    metric:
      name: http_requests_per_second
    target:
      type: AverageValue
      averageValue: "1000"
```

Requiere configurar **Prometheus Adapter** o **KEDA**.

### Escalado Manual

```bash
# Escalar un deployment manualmente
kubectl scale deployment order-service \
  --replicas=5 \
  -n a4co-production

# Verificar
kubectl get deployment order-service -n a4co-production
```

### Pod Disruption Budgets (PDB)

Los PDB aseguran alta disponibilidad durante actualizaciones o mantenimiento:

```yaml
podDisruptionBudget:
  enabled: true
  minAvailable: 2  # Mínimo 2 pods disponibles durante disrupciones
```

Verificar PDB:

```bash
kubectl get pdb -n a4co-production
kubectl describe pdb order-service-pdb -n a4co-production
```

---

## Monitoreo y Observabilidad

### Prometheus

#### Métricas Disponibles

Cada microservicio expone métricas en `/metrics`:

- **HTTP Metrics**: 
  - `http_requests_total`
  - `http_request_duration_seconds`
  - `http_requests_in_flight`

- **Process Metrics**:
  - `process_cpu_seconds_total`
  - `process_resident_memory_bytes`
  - `nodejs_heap_size_used_bytes`

- **Custom Business Metrics**:
  - `orders_created_total`
  - `payments_processed_total`
  - `inventory_updated_total`

#### Consultas Prometheus

```promql
# Request rate por servicio
rate(http_requests_total[5m])

# Latencia P95
histogram_quantile(0.95, http_request_duration_seconds_bucket)

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# CPU usage
rate(process_cpu_seconds_total[5m])
```

#### Acceder a Prometheus UI

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/prometheus-server 9090:80

# Abrir browser
open http://localhost:9090
```

### Grafana

#### Acceder a Grafana

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/grafana 3000:80

# Obtener password
kubectl get secret -n a4co-observability grafana -o jsonpath="{.data.admin-password}" | base64 --decode

# Abrir browser
open http://localhost:3000
# Usuario: admin
# Password: (del comando anterior)
```

#### Dashboards Incluidos

1. **Kubernetes Cluster Overview**: Vista general del cluster
2. **Microservices Performance**: Latencia, throughput, error rate
3. **Database Metrics**: PostgreSQL performance
4. **NATS Metrics**: Message broker statistics
5. **Redis Metrics**: Cache hit/miss ratio

### Jaeger (Distributed Tracing)

#### Acceder a Jaeger UI

```bash
# Port forward
kubectl port-forward -n a4co-observability svc/jaeger-query 16686:16686

# Abrir browser
open http://localhost:16686
```

#### Análisis de Traces

1. Seleccionar servicio (ej: order-service)
2. Buscar traces por operación
3. Analizar latencias entre servicios
4. Identificar cuellos de botella

### Logs Centralizados

#### Ver logs en tiempo real

```bash
# Todos los microservicios
kubectl logs -f -n a4co-production -l tier=backend

# Un servicio específico
kubectl logs -f -n a4co-production -l app=order-service

# Últimas 100 líneas
kubectl logs -n a4co-production -l app=order-service --tail=100

# Desde hace 1 hora
kubectl logs -n a4co-production -l app=order-service --since=1h
```

#### Stern (Multi-pod log tailing)

```bash
# Instalar stern
brew install stern

# Seguir logs de todos los servicios
stern -n a4co-production ".*-service"

# Filtrar por contexto
stern -n a4co-production "order" --context 10
```

### Alertas

Configurar alertas en Prometheus (archivo `alerting-rules.yml`):

```yaml
groups:
- name: microservices
  rules:
  - alert: HighErrorRate
    expr: |
      rate(http_requests_total{status=~"5.."}[5m]) /
      rate(http_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      
  - alert: HighLatency
    expr: |
      histogram_quantile(0.95,
        rate(http_request_duration_seconds_bucket[5m])
      ) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High latency on {{ $labels.service }}"
      
  - alert: PodCrashLooping
    expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Pod {{ $labels.pod }} is crash looping"
```

---

## Troubleshooting

### Pods no inician

#### 1. Verificar estado del pod

```bash
kubectl get pods -n a4co-production
kubectl describe pod <pod-name> -n a4co-production
```

Posibles causas:
- **ImagePullBackOff**: Imagen no encontrada
  ```bash
  # Verificar que la imagen existe
  docker pull ghcr.io/neiland85/a4co-order-service:latest
  
  # Verificar imagePullSecrets
  kubectl get secret ghcr-credentials -n a4co-production
  ```

- **CrashLoopBackOff**: Aplicación crashea al iniciar
  ```bash
  # Ver logs del contenedor
  kubectl logs <pod-name> -n a4co-production
  
  # Ver logs del contenedor anterior (si crasheó)
  kubectl logs <pod-name> -n a4co-production --previous
  ```

- **Pending**: No hay recursos suficientes
  ```bash
  # Ver eventos
  kubectl describe pod <pod-name> -n a4co-production
  
  # Ver capacidad de nodos
  kubectl describe nodes | grep -A 5 "Allocated resources"
  ```

#### 2. Verificar dependencias

```bash
# Verificar que PostgreSQL está ready
kubectl get pods -n a4co-production -l app.kubernetes.io/name=postgresql

# Verificar que NATS está ready
kubectl get pods -n a4co-production -l app.kubernetes.io/name=nats

# Verificar que Redis está ready
kubectl get pods -n a4co-production -l app.kubernetes.io/name=redis
```

#### 3. Verificar secretos

```bash
# Listar secrets
kubectl get secrets -n a4co-production

# Verificar que los secrets tienen datos
kubectl get secret a4co-jwt-secret -n a4co-production -o yaml
```

### Servicio no responde

#### 1. Verificar Service

```bash
# Ver services
kubectl get svc -n a4co-production

# Describir service
kubectl describe svc order-service -n a4co-production

# Verificar endpoints
kubectl get endpoints order-service -n a4co-production
```

#### 2. Test de conectividad

```bash
# Desde un pod de prueba
kubectl run test --rm -it --image=nicolaka/netshoot -n a4co-production -- bash

# Dentro del pod:
curl http://order-service:3004/health
nslookup order-service
telnet order-service 3004
```

#### 3. Verificar NetworkPolicies

```bash
# Listar NetworkPolicies
kubectl get networkpolicies -n a4co-production

# Describir policy
kubectl describe networkpolicy a4co-microservices-allow-microservices -n a4co-production

# Temporalmente deshabilitar NetworkPolicies para debug
helm upgrade a4co-microservices . \
  --reuse-values \
  --set networkPolicy.enabled=false \
  -n a4co-production
```

### Ingress no funciona

#### 1. Verificar Ingress

```bash
# Ver ingress
kubectl get ingress -n a4co-production

# Describir ingress
kubectl describe ingress a4co-microservices-ingress -n a4co-production

# Verificar anotaciones
kubectl get ingress a4co-microservices-ingress -n a4co-production -o yaml
```

#### 2. Verificar Ingress Controller

```bash
# Verificar que NGINX Ingress está running
kubectl get pods -n ingress-nginx

# Ver logs del ingress controller
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

#### 3. Verificar DNS y TLS

```bash
# Test DNS
nslookup api.a4co.com

# Test HTTPS
curl -v https://api.a4co.com/api/v1/auth/health

# Verificar certificado
kubectl get certificate -n a4co-production
kubectl describe certificate a4co-api-tls -n a4co-production
```

### Base de datos lenta

#### 1. Ver métricas de PostgreSQL

```bash
# Ver pods de PostgreSQL
kubectl get pods -n a4co-production -l app.kubernetes.io/name=postgresql

# Ver logs
kubectl logs -n a4co-production -l app.kubernetes.io/name=postgresql --tail=100

# Conectar a PostgreSQL
kubectl exec -it postgresql-0 -n a4co-production -- psql -U a4co_user -d a4co_prod

# Queries lentas
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

#### 2. Verificar recursos

```bash
# Ver uso de recursos
kubectl top pod -n a4co-production -l app.kubernetes.io/name=postgresql

# Ver límites configurados
kubectl describe pod postgresql-0 -n a4co-production | grep -A 5 "Limits"
```

### HPA no escala

#### 1. Verificar Metrics Server

```bash
# Verificar que Metrics Server está running
kubectl get deployment metrics-server -n kube-system

# Ver métricas de pods
kubectl top pods -n a4co-production
```

#### 2. Verificar configuración de HPA

```bash
# Ver HPA
kubectl get hpa -n a4co-production

# Ver detalles
kubectl describe hpa order-service-hpa -n a4co-production

# Ver métricas actuales
kubectl get hpa order-service-hpa -n a4co-production -o yaml
```

#### 3. Generar carga para probar

```bash
# Instalar hey (load testing)
brew install hey

# Generar carga
hey -z 5m -c 50 https://api.a4co.com/api/v1/products

# Observar escalado
watch kubectl get hpa -n a4co-production
```

### Debug General

#### Shell interactivo en un pod

```bash
# Ejecutar shell en un pod running
kubectl exec -it <pod-name> -n a4co-production -- /bin/sh

# Ver variables de entorno
env | grep -E "DATABASE|NATS|REDIS"

# Test de conectividad
nc -zv postgresql 5432
nc -zv nats 4222
nc -zv redis-master 6379
```

#### Port forwarding para debug local

```bash
# Forward a un servicio
kubectl port-forward -n a4co-production svc/order-service 3004:3004

# Forward a PostgreSQL
kubectl port-forward -n a4co-production svc/postgresql 5432:5432

# Forward a NATS
kubectl port-forward -n a4co-production svc/nats 4222:4222
```

---

## Rollback

### Rollback con Script

```bash
# Rollback a la versión anterior
./scripts/k8s-rollback.sh production

# Rollback a una revisión específica
./scripts/k8s-rollback.sh production 3
```

### Rollback Manual con Helm

#### Ver historial

```bash
helm history a4co-microservices -n a4co-production
```

#### Rollback a versión anterior

```bash
helm rollback a4co-microservices -n a4co-production
```

#### Rollback a revisión específica

```bash
helm rollback a4co-microservices 3 -n a4co-production
```

### Rollback de Deployment Individual

```bash
# Ver historial de un deployment
kubectl rollout history deployment/order-service -n a4co-production

# Rollback
kubectl rollout undo deployment/order-service -n a4co-production

# Rollback a revisión específica
kubectl rollout undo deployment/order-service --to-revision=2 -n a4co-production
```

### Estrategias de Rollback

#### Blue-Green Deployment

1. Deploy nueva versión en namespace separado
2. Test exhaustivo
3. Switch de tráfico con Ingress
4. Rollback = volver a namespace anterior

#### Canary Deployment

Usar **Flagger** con Istio/Linkerd:

```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: order-service
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  progressDeadlineSeconds: 600
  service:
    port: 3004
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
```

---

## Seguridad

### Pod Security Standards

Los pods están configurados con security context restrictivo:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000
  seccompProfile:
    type: RuntimeDefault

containers:
- securityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    capabilities:
      drop:
      - ALL
```

### NetworkPolicies

Segmentación de red implementada:

- ✅ Deny all por defecto
- ✅ Allow entre microservicios (backend tier)
- ✅ Allow de ingress a microservicios
- ✅ Allow de microservicios a PostgreSQL/NATS/Redis
- ✅ Allow egress para DNS
- ✅ Allow egress HTTPS para APIs externas

### RBAC

Service Accounts configurados para cada servicio:

```bash
# Ver service accounts
kubectl get sa -n a4co-production

# Ver permisos
kubectl describe sa order-service-sa -n a4co-production
```

### Secrets Management

- ✅ External Secrets Operator para producción
- ✅ Secretos almacenados en AWS Secrets Manager
- ✅ Rotación automática de secretos
- ✅ Encryption at rest en etcd

### Image Security

- ✅ Imágenes de fuentes confiables (GHCR)
- ✅ Scan de vulnerabilidades en CI/CD
- ✅ Image pull secrets configurados
- ✅ Tags específicos (no usar `latest` en prod)

### TLS/SSL

- ✅ Cert-manager para gestión automática
- ✅ Let's Encrypt como CA
- ✅ Certificados renovados automáticamente
- ✅ Force HTTPS en Ingress

### Auditing

Habilitar audit logging en el cluster:

```yaml
# audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: RequestResponse
  namespaces: ["a4co-production"]
  verbs: ["create", "update", "patch", "delete"]
  resources:
  - group: ""
    resources: ["secrets", "configmaps"]
```

---

## Mantenimiento

### Backup y Restore

#### PostgreSQL Backup

```bash
# Crear backup manual
kubectl exec -n a4co-production postgresql-0 -- \
  pg_dump -U a4co_user a4co_prod > backup-$(date +%Y%m%d).sql

# Upload a S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://a4co-backups/postgres/

# Automated backup con CronJob
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: a4co-production
spec:
  schedule: "0 2 * * *"  # Diario a las 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: a4co-db-credentials
                  key: password
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h postgresql -U a4co_user a4co_prod | \
              aws s3 cp - s3://a4co-backups/postgres/backup-\$(date +\%Y\%m\%d-\%H\%M\%S).sql
          restartPolicy: OnFailure
EOF
```

#### Restore

```bash
# Download backup
aws s3 cp s3://a4co-backups/postgres/backup-20240115.sql .

# Restore
kubectl exec -i -n a4co-production postgresql-0 -- \
  psql -U a4co_user a4co_prod < backup-20240115.sql
```

### Actualización de Kubernetes

1. **Backup completo** del cluster
2. **Actualizar nodos de worker** primero
3. **Actualizar control plane**
4. **Verificar todos los deployments**

```bash
# Ver versión actual
kubectl version

# Actualizar nodos (ejemplo EKS)
eksctl upgrade cluster --name a4co-cluster --approve

# Verificar
kubectl get nodes
```

### Limpieza de Recursos

```bash
# Eliminar pods terminados
kubectl delete pods --field-selector=status.phase==Succeeded -n a4co-production
kubectl delete pods --field-selector=status.phase==Failed -n a4co-production

# Eliminar old ReplicaSets
kubectl delete rs -n a4co-production $(kubectl get rs -n a4co-production -o jsonpath='{.items[?(@.spec.replicas==0)].metadata.name}')

# Limpieza completa de un ambiente
./scripts/k8s-cleanup.sh dev
```

### Monitoreo de Costos

```bash
# Ver recursos por namespace
kubectl get pods -n a4co-production -o custom-columns=\
NAME:.metadata.name,\
CPU_REQ:.spec.containers[0].resources.requests.cpu,\
MEM_REQ:.spec.containers[0].resources.requests.memory,\
CPU_LIM:.spec.containers[0].resources.limits.cpu,\
MEM_LIM:.spec.containers[0].resources.limits.memory

# Calcular costo estimado
kubectl cost --namespace a4co-production  # Requiere kubecost
```

### Actualización de Charts

```bash
# Ver versión actual
helm list -n a4co-production

# Actualizar a nueva versión
helm upgrade a4co-microservices infra/helm/a4co-microservices \
  --namespace a4co-production \
  --values infra/helm/a4co-microservices/values-production.yaml \
  --version 1.1.0

# Con valores personalizados
helm upgrade a4co-microservices infra/helm/a4co-microservices \
  --namespace a4co-production \
  --reuse-values \
  --set orderService.replicaCount=5
```

---

## Referencias Útiles

### Comandos Rápidos

```bash
# Namespace operations
kubectl config set-context --current --namespace=a4co-production

# Quick pod status
kubectl get pods -n a4co-production -o wide

# Resource usage
kubectl top pods -n a4co-production
kubectl top nodes

# Events
kubectl get events -n a4co-production --sort-by='.lastTimestamp'

# All resources in namespace
kubectl get all -n a4co-production

# Describe everything
kubectl describe all -n a4co-production

# Quick logs
kubectl logs -f deployment/order-service -n a4co-production

# Execute command in pod
kubectl exec -it deployment/order-service -n a4co-production -- sh

# Port forward
kubectl port-forward service/order-service 3004:3004 -n a4co-production

# Scale
kubectl scale deployment order-service --replicas=5 -n a4co-production

# Restart
kubectl rollout restart deployment order-service -n a4co-production
```

### Herramientas Recomendadas

- **k9s**: Terminal UI para Kubernetes
- **stern**: Multi-pod log tailing
- **kubectx/kubens**: Switch context/namespace rápido
- **kube-ps1**: Prompt de shell con context
- **kubeval**: Validación de manifests
- **kubeseal**: Sealed Secrets
- **velero**: Backup/Restore de cluster

### Documentación Externa

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/)
- [Cert-manager](https://cert-manager.io/docs/)
- [External Secrets Operator](https://external-secrets.io/)
- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)

---

## Soporte

Para problemas o preguntas:

- **Issues**: https://github.com/neiland85/a4co-ddd-microservices/issues
- **Email**: team@a4co.com
- **Slack**: #a4co-devops

---

**Última actualización**: 2025-01-06  
**Versión del documento**: 1.0.0
