# 🌐 AGENTE #11: Service Mesh con Istio

## 📋 Contexto

Este agente implementa un **Service Mesh completo** usando **Istio** para proporcionar:
- Tráfico seguro (mTLS automático)
- Observabilidad avanzada (traces, metrics, logs)
- Traffic management (circuit breakers, retries, timeouts)
- Service discovery automático
- Load balancing inteligente

## 🎯 Objetivos

1. ✅ Instalar y configurar Istio en el cluster
2. ✅ Habilitar inyección automática de sidecars
3. ✅ Configurar mTLS estricto entre servicios
4. ✅ Implementar circuit breakers y retries
5. ✅ Configurar virtual services y destination rules
6. ✅ Integrar con Prometheus, Grafana, Jaeger
7. ✅ Implementar políticas de seguridad (AuthorizationPolicy)

---

## 📂 Estructura a crear

```
infra/istio/
├── 00-namespace.yaml                # Namespace con label injection=enabled
├── 01-istio-config.yaml             # IstioOperator custom resource
├── 02-gateway.yaml                  # Istio Gateway (entrada al mesh)
├── 03-virtual-services/
│   ├── order-service-vs.yaml
│   ├── payment-service-vs.yaml
│   └── inventory-service-vs.yaml
├── 04-destination-rules/
│   ├── order-service-dr.yaml        # Circuit breakers, retries
│   ├── payment-service-dr.yaml
│   └── inventory-service-dr.yaml
├── 05-peer-authentication.yaml      # mTLS STRICT
├── 06-authorization-policies/
│   ├── order-to-payment.yaml        # Solo order puede llamar a payment
│   ├── payment-to-inventory.yaml
│   └── deny-all-default.yaml        # Deny by default
└── 07-telemetry.yaml                # Configuración de observabilidad

scripts/
├── install-istio.sh                 # Script de instalación
└── verify-istio-mesh.sh             # Script de verificación

apps/*/k8s/
├── deployment.yaml                  # Actualizar con annotations de Istio
└── service-monitor.yaml             # Prometheus ServiceMonitor
```

---

## 🔧 PASO 1: Instalación de Istio

### Script de instalación

**`scripts/install-istio.sh`**

```bash
#!/bin/bash
set -e

echo "🌐 Instalando Istio Service Mesh"
echo "================================="

# 1. Descargar Istio CLI
ISTIO_VERSION="1.24.0"
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=$ISTIO_VERSION sh -
cd istio-$ISTIO_VERSION
export PATH=$PWD/bin:$PATH

# 2. Instalar Istio con perfil de producción
istioctl install --set profile=production -y

# 3. Verificar instalación
kubectl get pods -n istio-system

# 4. Habilitar inyección automática en namespace a4co
kubectl label namespace a4co istio-injection=enabled --overwrite

# 5. Instalar addons de observabilidad
kubectl apply -f samples/addons/prometheus.yaml
kubectl apply -f samples/addons/grafana.yaml
kubectl apply -f samples/addons/jaeger.yaml
kubectl apply -f samples/addons/kiali.yaml

echo "✅ Istio instalado correctamente"
echo ""
echo "Dashboards disponibles:"
echo "  • Kiali:      istioctl dashboard kiali"
echo "  • Grafana:    istioctl dashboard grafana"
echo "  • Jaeger:     istioctl dashboard jaeger"
echo "  • Prometheus: istioctl dashboard prometheus"
```

**Ejecutar**:
```bash
chmod +x scripts/install-istio.sh
./scripts/install-istio.sh
```

---

## 🔧 PASO 2: Configuración del Namespace

**`infra/istio/00-namespace.yaml`**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: a4co
  labels:
    istio-injection: enabled  # ✅ Inyección automática de sidecars
    name: a4co
---
apiVersion: v1
kind: Namespace
metadata:
  name: istio-system
  labels:
    istio-injection: disabled
```

**Aplicar**:
```bash
kubectl apply -f infra/istio/00-namespace.yaml
```

---

## 🔧 PASO 3: Istio Gateway (Entrada al Mesh)

**`infra/istio/02-gateway.yaml`**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: a4co-gateway
  namespace: a4co
spec:
  selector:
    istio: ingressgateway  # Usa el ingress gateway de Istio
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*.a4co.local"
    - "a4co.local"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: a4co-tls-cert  # Secret con certificado TLS
    hosts:
    - "*.a4co.local"
```

---

## 🔧 PASO 4: Virtual Services (Routing)

**`infra/istio/03-virtual-services/order-service-vs.yaml`**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: order-service
  namespace: a4co
spec:
  hosts:
  - order-service
  - order.a4co.local
  gateways:
  - a4co-gateway
  - mesh  # También aplica a tráfico interno (service-to-service)
  http:
  - match:
    - uri:
        prefix: /orders
    route:
    - destination:
        host: order-service
        port:
          number: 3004
        subset: v1  # Referencia a DestinationRule
      weight: 100
    retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: 5xx,reset,connect-failure,refused-stream
    timeout: 10s
    fault:
      # ✅ Fault injection para testing (comentar en producción)
      # delay:
      #   percentage:
      #     value: 0.1
      #   fixedDelay: 5s
      # abort:
      #   percentage:
      #     value: 0.01
      #   httpStatus: 500
```

**`infra/istio/03-virtual-services/payment-service-vs.yaml`**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: payment-service
  namespace: a4co
spec:
  hosts:
  - payment-service
  - payment.a4co.local
  gateways:
  - mesh
  http:
  - match:
    - uri:
        prefix: /payments
    route:
    - destination:
        host: payment-service
        port:
          number: 3006
        subset: v1
    retries:
      attempts: 5  # Más reintentos para pagos
      perTryTimeout: 3s
      retryOn: 5xx,reset,connect-failure
    timeout: 15s
```

---

## 🔧 PASO 5: Destination Rules (Circuit Breakers)

**`infra/istio/04-destination-rules/order-service-dr.yaml`**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: order-service
  namespace: a4co
spec:
  host: order-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    loadBalancer:
      simple: LEAST_REQUEST  # Algoritmo de balanceo
    outlierDetection:
      # ✅ Circuit breaker: detecta pods no saludables
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 40
  subsets:
  - name: v1
    labels:
      version: v1
```

**`infra/istio/04-destination-rules/payment-service-dr.yaml`**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: payment-service
  namespace: a4co
spec:
  host: payment-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 50  # Menos conexiones para servicio crítico
      http:
        http1MaxPendingRequests: 20
        http2MaxRequests: 50
    outlierDetection:
      consecutiveErrors: 3  # Más agresivo
      interval: 20s
      baseEjectionTime: 60s  # Ejection más larga
      maxEjectionPercent: 30
  subsets:
  - name: v1
    labels:
      version: v1
```

---

## 🔧 PASO 6: mTLS Estricto (PeerAuthentication)

**`infra/istio/05-peer-authentication.yaml`**

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: a4co
spec:
  mtls:
    mode: STRICT  # ✅ TODO el tráfico debe usar mTLS
---
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: payment-service-mtls
  namespace: a4co
spec:
  selector:
    matchLabels:
      app: payment-service
  mtls:
    mode: STRICT
  portLevelMtls:
    3006:
      mode: STRICT
```

**Verificar mTLS**:
```bash
istioctl authn tls-check payment-service.a4co.svc.cluster.local
```

---

## 🔧 PASO 7: Authorization Policies (Seguridad)

**`infra/istio/06-authorization-policies/deny-all-default.yaml`**

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: a4co
spec:
  {}  # Deny all by default
```

**`infra/istio/06-authorization-policies/order-to-payment.yaml`**

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-order-to-payment
  namespace: a4co
spec:
  selector:
    matchLabels:
      app: payment-service
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/a4co/sa/order-service"]  # Solo order-service
    to:
    - operation:
        methods: ["POST"]
        paths: ["/payments/process"]
```

**`infra/istio/06-authorization-policies/payment-to-inventory.yaml`**

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-payment-to-inventory
  namespace: a4co
spec:
  selector:
    matchLabels:
      app: inventory-service
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/a4co/sa/payment-service"]
    to:
    - operation:
        methods: ["POST", "PUT"]
        paths: ["/inventory/reserve", "/inventory/release"]
```

---

## 🔧 PASO 8: Telemetría y Observabilidad

**`infra/istio/07-telemetry.yaml`**

```yaml
apiVersion: telemetry.istio.io/v1alpha1
kind: Telemetry
metadata:
  name: mesh-telemetry
  namespace: istio-system
spec:
  tracing:
  - providers:
    - name: jaeger
    randomSamplingPercentage: 100.0  # 100% en desarrollo, 1-10% en producción
    customTags:
      environment:
        literal:
          value: production
  metrics:
  - providers:
    - name: prometheus
    overrides:
    - match:
        metric: ALL_METRICS
      tagOverrides:
        source_cluster:
          value: a4co-cluster
  accessLogging:
  - providers:
    - name: envoy
```

---

## 🔧 PASO 9: Actualizar Deployments con Annotations

**`apps/order-service/k8s/deployment.yaml`** (actualizar)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: a4co
spec:
  template:
    metadata:
      annotations:
        # ✅ Istio annotations
        sidecar.istio.io/inject: "true"
        prometheus.io/scrape: "true"
        prometheus.io/port: "3004"
        prometheus.io/path: "/orders/metrics"
        # ✅ Resource limits para sidecar
        sidecar.istio.io/proxyCPU: "100m"
        sidecar.istio.io/proxyMemory: "128Mi"
        sidecar.istio.io/proxyCPULimit: "500m"
        sidecar.istio.io/proxyMemoryLimit: "512Mi"
      labels:
        app: order-service
        version: v1  # ✅ Importante para subsets
    spec:
      serviceAccountName: order-service  # ✅ Necesario para mTLS
      containers:
      - name: order-service
        image: ghcr.io/a4co/order-service:latest
        ports:
        - containerPort: 3004
          name: http
          protocol: TCP
        env:
        - name: NATS_URL
          value: "nats://nats.a4co.svc.cluster.local:4222"
        # ...resto de la configuración
```

---

## 🔧 PASO 10: ServiceAccounts

**`apps/order-service/k8s/serviceaccount.yaml`**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: order-service
  namespace: a4co
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payment-service
  namespace: a4co
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: inventory-service
  namespace: a4co
```

**Aplicar**:
```bash
kubectl apply -f apps/order-service/k8s/serviceaccount.yaml
```

---

## 🧪 PASO 11: Verificación

**`scripts/verify-istio-mesh.sh`**

```bash
#!/bin/bash
set -e

echo "🔍 Verificando Istio Service Mesh"
echo "=================================="

# 1. Verificar sidecars inyectados
echo ""
echo "📦 Pods con sidecars Istio:"
kubectl get pods -n a4co -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].name}{"\n"}{end}'

# 2. Verificar mTLS
echo ""
echo "🔒 Estado de mTLS:"
istioctl authn tls-check order-service.a4co.svc.cluster.local payment-service.a4co.svc.cluster.local

# 3. Verificar virtual services
echo ""
echo "🌐 Virtual Services:"
kubectl get virtualservices -n a4co

# 4. Verificar destination rules
echo ""
echo "📍 Destination Rules:"
kubectl get destinationrules -n a4co

# 5. Verificar authorization policies
echo ""
echo "🔐 Authorization Policies:"
kubectl get authorizationpolicies -n a4co

# 6. Test de conectividad
echo ""
echo "🧪 Test de conectividad (desde order-service a payment-service):"
ORDER_POD=$(kubectl get pod -n a4co -l app=order-service -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n a4co $ORDER_POD -c order-service -- curl -s http://payment-service:3006/health

echo ""
echo "✅ Verificación completada"
echo ""
echo "Para ver dashboards:"
echo "  • Kiali:   istioctl dashboard kiali"
echo "  • Grafana: istioctl dashboard grafana"
echo "  • Jaeger:  istioctl dashboard jaeger"
```

---

## 📊 PASO 12: Dashboards de Kiali

**Abrir Kiali**:
```bash
istioctl dashboard kiali
```

En Kiali podrás ver:
- ✅ **Service Graph**: Visualización del mesh
- ✅ **Traffic Flow**: Flujo de requests entre servicios
- ✅ **Health Status**: Estado de salud de cada servicio
- ✅ **mTLS Status**: Verificar que todo usa mTLS
- ✅ **Request Rates**: Métricas de tráfico
- ✅ **Error Rates**: Detectar problemas

---

## 🚀 Deployment Completo

```bash
# 1. Instalar Istio
./scripts/install-istio.sh

# 2. Aplicar configuraciones
kubectl apply -f infra/istio/00-namespace.yaml
kubectl apply -f infra/istio/02-gateway.yaml
kubectl apply -f infra/istio/03-virtual-services/
kubectl apply -f infra/istio/04-destination-rules/
kubectl apply -f infra/istio/05-peer-authentication.yaml
kubectl apply -f infra/istio/06-authorization-policies/
kubectl apply -f infra/istio/07-telemetry.yaml

# 3. Aplicar ServiceAccounts
kubectl apply -f apps/order-service/k8s/serviceaccount.yaml

# 4. Re-deploy servicios (para inyectar sidecars)
kubectl rollout restart deployment -n a4co

# 5. Verificar
./scripts/verify-istio-mesh.sh

# 6. Abrir dashboards
istioctl dashboard kiali
```

---

## ✅ Criterios de Éxito

- [ ] Istio instalado y corriendo en `istio-system`
- [ ] Sidecars inyectados en todos los pods de namespace `a4co`
- [ ] mTLS STRICT habilitado (verificar con `istioctl authn tls-check`)
- [ ] Virtual Services configurados para cada microservicio
- [ ] Destination Rules con circuit breakers activos
- [ ] Authorization Policies funcionando (deny by default, allow explícito)
- [ ] Telemetría integrada con Prometheus, Grafana, Jaeger
- [ ] Kiali dashboard mostrando service graph
- [ ] Traces de Jaeger mostrando requests distribuidos
- [ ] Circuit breakers activándose bajo carga (test con k6)

---

## 📈 Próximos Pasos

Después de completar este agente:

1. **Ejecutar Agent #12**: Implementar API Gateway (Kong/Traefik)
2. **Canary Deployments**: Usar Istio para despliegues progresivos
3. **Chaos Engineering**: Inyectar fallos con Istio fault injection
4. **Security Hardening**: Políticas más estrictas

---

## 🎓 Conceptos Clave

### Service Mesh
- **Sidecar Pattern**: Proxy Envoy inyectado en cada pod
- **Control Plane**: Istio Pilot, Citadel, Galley
- **Data Plane**: Envoy proxies manejando todo el tráfico

### Traffic Management
- **Virtual Services**: Routing inteligente
- **Destination Rules**: Políticas de tráfico (circuit breakers, retries)
- **Gateways**: Entrada/salida del mesh

### Security
- **mTLS**: Encriptación automática entre servicios
- **AuthorizationPolicy**: Control de acceso basado en identidad
- **ServiceAccount**: Identidad de cada servicio

### Observability
- **Distributed Tracing**: Jaeger traces de requests distribuidos
- **Metrics**: Prometheus + Grafana dashboards
- **Logs**: Envoy access logs

---

**¿Listo para ejecutar?** 🚀

```bash
./scripts/install-istio.sh
kubectl apply -f infra/istio/
./scripts/verify-istio-mesh.sh
istioctl dashboard kiali
```
