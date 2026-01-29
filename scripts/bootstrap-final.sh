#!/usr/bin/env bash
set -e

echo "🚀 A4CO Bootstrap – Fase Final"
echo "================================="

# --- Helpers --------------------------------------------------
fail() {
  echo "❌ ERROR: $1"
  exit 1
}

ok() {
  echo "✅ $1"
}

# --- 1. Validaciones base ------------------------------------
command -v node >/dev/null 2>&1 || fail "Node.js no está instalado"
command -v pnpm >/dev/null 2>&1 || fail "pnpm no está instalado"
command -v docker >/dev/null 2>&1 || fail "Docker no está instalado"
command -v docker-compose >/dev/null 2>&1 || fail "docker-compose no está instalado"

NODE_VERSION=$(node -v | sed 's/v//')
PNPM_VERSION=$(pnpm -v)

[[ "${NODE_VERSION%%.*}" -ge 22 ]] || fail "Node >= 22 requerido (actual: $NODE_VERSION)"
ok "Node.js $NODE_VERSION"

ok "pnpm $PNPM_VERSION"

# --- 2. Rama correcta ----------------------------------------
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" != "feature/phase1-saga-integration" ]]; then
  echo "ℹ️ Cambiando a rama feature/phase1-saga-integration"
  git checkout -B feature/phase1-saga-integration
fi

ok "Rama activa: feature/phase1-saga-integration"

# --- 3. Dependencias -----------------------------------------
echo "📦 Instalando dependencias..."
pnpm install
ok "Dependencias instaladas"

# --- 4. Build de paquetes compartidos ------------------------
echo "🔨 Compilando paquetes compartidos..."
pnpm --filter @a4co/observability build
pnpm --filter @a4co/shared-utils build
pnpm --filter @a4co/design-system build
ok "Packages compartidos compilados"

# --- 5. Infraestructura (Docker + NATS) ----------------------
echo "🐳 Levantando infraestructura (Docker)..."
docker compose -f compose.dev.yaml up -d
ok "Infraestructura levantada"

echo "⏳ Esperando a NATS..."
sleep 5

docker ps | grep nats >/dev/null 2>&1 || fail "NATS no está corriendo"
ok "NATS activo"

# --- 6. JetStream --------------------------------------------
echo "📡 Verificando JetStream..."
docker exec a4co-nats nats stream ls >/dev/null 2>&1 || \
  docker exec a4co-nats nats server check jetstream

ok "JetStream disponible"

# --- 7. Tests rápidos ----------------------------------------
echo "🧪 Ejecutando smoke tests..."
pnpm test --filter order-service || echo "⚠️ Tests aún incompletos (esperado en esta fase)"
ok "Bootstrap completado"

# --- 8. Resumen ----------------------------------------------
echo ""
echo "🎯 ENTORNO LISTO"
echo "---------------------------------"
echo "• Rama: feature/phase1-saga-integration"
echo "• Infraestructura: Docker + NATS JetStream"
echo "• Packages: compilados"
echo ""
echo "👉 Próximo paso recomendado:"
echo "   apps/services/order-service → implementar OrderSaga"

