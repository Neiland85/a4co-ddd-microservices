# =============================================================================
# A4CO Microservices Platform - Makefile
# =============================================================================

.PHONY: help
.DEFAULT_GOAL := help

# Variables
ENVIRONMENT ?= staging
NAMESPACE := a4co-$(ENVIRONMENT)
CHART_PATH := infra/helm/a4co-microservices
RELEASE_NAME := a4co-microservices

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

# =============================================================================
# Help
# =============================================================================

help: ## Muestra esta ayuda
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)  A4CO Microservices Platform - Makefile Commands$(NC)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Uso:$(NC)"
	@echo "  make <comando> [ENVIRONMENT=dev|staging|production]"
	@echo ""
	@echo "$(YELLOW)Ejemplos:$(NC)"
	@echo "  make deploy ENVIRONMENT=staging"
	@echo "  make status ENVIRONMENT=production"
	@echo "  make logs ENVIRONMENT=dev"
	@echo ""

# =============================================================================
# Prerequisites
# =============================================================================

.PHONY: check-prereqs
check-prereqs: ## Verificar prerrequisitos
	@echo "$(BLUE)▶ Verificando prerrequisitos...$(NC)"
	@command -v kubectl >/dev/null 2>&1 || { echo "$(YELLOW)kubectl no encontrado$(NC)"; exit 1; }
	@command -v helm >/dev/null 2>&1 || { echo "$(YELLOW)helm no encontrado$(NC)"; exit 1; }
	@kubectl cluster-info >/dev/null 2>&1 || { echo "$(YELLOW)No hay conexión al cluster$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Todos los prerrequisitos cumplidos$(NC)"

# =============================================================================
# Helm Operations
# =============================================================================

.PHONY: helm-repos
helm-repos: ## Agregar repositorios de Helm
	@echo "$(BLUE)▶ Agregando repositorios de Helm...$(NC)"
	@helm repo add bitnami https://charts.bitnami.com/bitnami
	@helm repo add nats https://nats-io.github.io/k8s/helm/charts/
	@helm repo update
	@echo "$(GREEN)✓ Repositorios actualizados$(NC)"

.PHONY: helm-deps
helm-deps: ## Actualizar dependencias del chart
	@echo "$(BLUE)▶ Actualizando dependencias...$(NC)"
	@cd $(CHART_PATH) && helm dependency update
	@echo "$(GREEN)✓ Dependencias actualizadas$(NC)"

.PHONY: helm-lint
helm-lint: ## Validar chart con lint
	@echo "$(BLUE)▶ Validando chart...$(NC)"
	@helm lint $(CHART_PATH) -f $(CHART_PATH)/values-$(ENVIRONMENT).yaml
	@echo "$(GREEN)✓ Chart válido$(NC)"

.PHONY: helm-template
helm-template: ## Ver manifests generados
	@helm template $(RELEASE_NAME) $(CHART_PATH) \
		-f $(CHART_PATH)/values-$(ENVIRONMENT).yaml \
		--namespace $(NAMESPACE)

.PHONY: helm-dry-run
helm-dry-run: check-prereqs ## Dry-run del deployment
	@echo "$(BLUE)▶ Ejecutando dry-run...$(NC)"
	@helm upgrade --install $(RELEASE_NAME) $(CHART_PATH) \
		--namespace $(NAMESPACE) \
		--create-namespace \
		-f $(CHART_PATH)/values-$(ENVIRONMENT).yaml \
		--dry-run --debug

# =============================================================================
# Deployment
# =============================================================================

.PHONY: deploy
deploy: check-prereqs helm-repos helm-deps helm-lint ## Desplegar en Kubernetes
	@echo "$(BLUE)▶ Desplegando en $(ENVIRONMENT)...$(NC)"
	@./scripts/k8s-deploy.sh $(ENVIRONMENT)

.PHONY: upgrade
upgrade: check-prereqs ## Actualizar deployment existente
	@echo "$(BLUE)▶ Actualizando $(ENVIRONMENT)...$(NC)"
	@helm upgrade $(RELEASE_NAME) $(CHART_PATH) \
		--namespace $(NAMESPACE) \
		-f $(CHART_PATH)/values-$(ENVIRONMENT).yaml \
		--timeout 10m \
		--wait

.PHONY: rollback
rollback: check-prereqs ## Rollback a versión anterior
	@echo "$(BLUE)▶ Rollback en $(ENVIRONMENT)...$(NC)"
	@./scripts/k8s-rollback.sh $(ENVIRONMENT)

.PHONY: uninstall
uninstall: check-prereqs ## Desinstalar release
	@echo "$(YELLOW)⚠️  Desinstalando $(RELEASE_NAME) en $(NAMESPACE)...$(NC)"
	@./scripts/k8s-cleanup.sh $(ENVIRONMENT)

# =============================================================================
# Status & Monitoring
# =============================================================================

.PHONY: status
status: check-prereqs ## Ver estado del deployment
	@./scripts/k8s-status.sh $(ENVIRONMENT)

.PHONY: pods
pods: check-prereqs ## Ver pods
	@kubectl get pods -n $(NAMESPACE) -o wide

.PHONY: services
services: check-prereqs ## Ver servicios
	@kubectl get svc -n $(NAMESPACE)

.PHONY: ingress
ingress: check-prereqs ## Ver ingress
	@kubectl get ingress -n $(NAMESPACE)

.PHONY: hpa
hpa: check-prereqs ## Ver HPA
	@kubectl get hpa -n $(NAMESPACE)

.PHONY: events
events: check-prereqs ## Ver eventos recientes
	@kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp' | tail -20

.PHONY: top
top: check-prereqs ## Ver uso de recursos
	@kubectl top pods -n $(NAMESPACE)

# =============================================================================
# Logs
# =============================================================================

.PHONY: logs
logs: check-prereqs ## Ver logs de todos los servicios
	@./scripts/k8s-logs.sh $(ENVIRONMENT) all

.PHONY: logs-auth
logs-auth: check-prereqs ## Ver logs de auth-service
	@kubectl logs -f -n $(NAMESPACE) -l app=auth-service --tail=100

.PHONY: logs-order
logs-order: check-prereqs ## Ver logs de order-service
	@kubectl logs -f -n $(NAMESPACE) -l app=order-service --tail=100

.PHONY: logs-payment
logs-payment: check-prereqs ## Ver logs de payment-service
	@kubectl logs -f -n $(NAMESPACE) -l app=payment-service --tail=100

.PHONY: logs-product
logs-product: check-prereqs ## Ver logs de product-service
	@kubectl logs -f -n $(NAMESPACE) -l app=product-service --tail=100

.PHONY: logs-inventory
logs-inventory: check-prereqs ## Ver logs de inventory-service
	@kubectl logs -f -n $(NAMESPACE) -l app=inventory-service --tail=100

# =============================================================================
# Port Forwarding
# =============================================================================

.PHONY: port-auth
port-auth: check-prereqs ## Port forward auth-service
	@echo "$(GREEN)Port forwarding auth-service: http://localhost:3001$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/auth-service 3001:3001

.PHONY: port-product
port-product: check-prereqs ## Port forward product-service
	@echo "$(GREEN)Port forwarding product-service: http://localhost:3003$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/product-service 3003:3003

.PHONY: port-order
port-order: check-prereqs ## Port forward order-service
	@echo "$(GREEN)Port forwarding order-service: http://localhost:3004$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/order-service 3004:3004

.PHONY: port-payment
port-payment: check-prereqs ## Port forward payment-service
	@echo "$(GREEN)Port forwarding payment-service: http://localhost:3006$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/payment-service 3006:3006

.PHONY: port-inventory
port-inventory: check-prereqs ## Port forward inventory-service
	@echo "$(GREEN)Port forwarding inventory-service: http://localhost:3007$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/inventory-service 3007:3007

.PHONY: port-prometheus
port-prometheus: check-prereqs ## Port forward Prometheus
	@echo "$(GREEN)Port forwarding Prometheus: http://localhost:9090$(NC)"
	@kubectl port-forward -n a4co-observability svc/prometheus-server 9090:80

.PHONY: port-grafana
port-grafana: check-prereqs ## Port forward Grafana
	@echo "$(GREEN)Port forwarding Grafana: http://localhost:3000$(NC)"
	@kubectl port-forward -n a4co-observability svc/grafana 3000:80

.PHONY: port-jaeger
port-jaeger: check-prereqs ## Port forward Jaeger
	@echo "$(GREEN)Port forwarding Jaeger: http://localhost:16686$(NC)"
	@kubectl port-forward -n a4co-observability svc/jaeger-query 16686:16686

# =============================================================================
# Debug & Troubleshooting
# =============================================================================

.PHONY: describe-pod
describe-pod: check-prereqs ## Describir un pod (POD=nombre)
	@kubectl describe pod $(POD) -n $(NAMESPACE)

.PHONY: exec-pod
exec-pod: check-prereqs ## Shell en un pod (POD=nombre)
	@kubectl exec -it $(POD) -n $(NAMESPACE) -- sh

.PHONY: restart
restart: check-prereqs ## Reiniciar un deployment (SERVICE=nombre)
	@echo "$(BLUE)▶ Reiniciando $(SERVICE)-service...$(NC)"
	@kubectl rollout restart deployment/$(SERVICE)-service -n $(NAMESPACE)
	@kubectl rollout status deployment/$(SERVICE)-service -n $(NAMESPACE)

.PHONY: scale
scale: check-prereqs ## Escalar un deployment (SERVICE=nombre REPLICAS=num)
	@echo "$(BLUE)▶ Escalando $(SERVICE)-service a $(REPLICAS) réplicas...$(NC)"
	@kubectl scale deployment/$(SERVICE)-service --replicas=$(REPLICAS) -n $(NAMESPACE)

# =============================================================================
# Secrets Management
# =============================================================================

.PHONY: secrets-list
secrets-list: check-prereqs ## Listar secrets
	@kubectl get secrets -n $(NAMESPACE)

.PHONY: secrets-external
secrets-external: check-prereqs ## Ver external secrets
	@kubectl get externalsecrets -n $(NAMESPACE)

.PHONY: secrets-describe
secrets-describe: check-prereqs ## Describir external secret (SECRET=nombre)
	@kubectl describe externalsecret $(SECRET) -n $(NAMESPACE)

# =============================================================================
# Database Operations
# =============================================================================

.PHONY: db-connect
db-connect: check-prereqs ## Conectar a PostgreSQL
	@kubectl exec -it -n $(NAMESPACE) postgresql-0 -- psql -U a4co_user -d a4co_$(ENVIRONMENT)

.PHONY: db-logs
db-logs: check-prereqs ## Ver logs de PostgreSQL
	@kubectl logs -f -n $(NAMESPACE) -l app.kubernetes.io/name=postgresql --tail=100

.PHONY: db-backup
db-backup: check-prereqs ## Crear backup de PostgreSQL
	@echo "$(BLUE)▶ Creando backup...$(NC)"
	@kubectl exec -n $(NAMESPACE) postgresql-0 -- pg_dump -U a4co_user a4co_$(ENVIRONMENT) > backup-$(ENVIRONMENT)-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)✓ Backup creado$(NC)"

# =============================================================================
# Development
# =============================================================================

.PHONY: dev-deploy
dev-deploy: ## Deploy en desarrollo local
	@$(MAKE) deploy ENVIRONMENT=dev

.PHONY: dev-logs
dev-logs: ## Ver logs en desarrollo
	@$(MAKE) logs ENVIRONMENT=dev

.PHONY: dev-status
dev-status: ## Ver status en desarrollo
	@$(MAKE) status ENVIRONMENT=dev

# =============================================================================
# CI/CD
# =============================================================================

.PHONY: ci-lint
ci-lint: helm-repos helm-deps helm-lint ## Validación para CI

.PHONY: ci-deploy-staging
ci-deploy-staging: ## Deploy staging para CI
	@$(MAKE) deploy ENVIRONMENT=staging

.PHONY: ci-deploy-production
ci-deploy-production: ## Deploy production para CI
	@$(MAKE) deploy ENVIRONMENT=production

# =============================================================================
# Cleanup
# =============================================================================

.PHONY: clean-pods
clean-pods: check-prereqs ## Limpiar pods terminados
	@kubectl delete pods --field-selector=status.phase==Succeeded -n $(NAMESPACE) 2>/dev/null || true
	@kubectl delete pods --field-selector=status.phase==Failed -n $(NAMESPACE) 2>/dev/null || true
	@echo "$(GREEN)✓ Pods limpiados$(NC)"

.PHONY: clean-all
clean-all: check-prereqs ## Limpiar todo el namespace
	@echo "$(YELLOW)⚠️  Esto eliminará TODOS los recursos en $(NAMESPACE)$(NC)"
	@read -p "¿Continuar? (yes/no): " confirm && [ "$$confirm" = "yes" ]
	@./scripts/k8s-cleanup.sh $(ENVIRONMENT)
