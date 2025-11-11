#!/bin/bash
# NATS JetStream Setup Script
# Este script configura los streams y consumers necesarios para la Fase 1

set -e

echo "🚀 Configurando NATS JetStream para A4CO..."

# Esperar a que NATS esté listo
echo "⏳ Esperando a que NATS esté disponible..."
sleep 5

# Configurar stream para Orders
echo "📦 Creando stream 'ORDERS'..."
nats stream add ORDERS \
  --subjects "orders.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-age=7d \
  --max-msg-size=1048576 \
  --discard old \
  --replicas 1 || echo "Stream ORDERS ya existe"

# Configurar stream para Payments
echo "💳 Creando stream 'PAYMENTS'..."
nats stream add PAYMENTS \
  --subjects "payments.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-age=7d \
  --max-msg-size=1048576 \
  --discard old \
  --replicas 1 || echo "Stream PAYMENTS ya existe"

# Configurar stream para Inventory
echo "📊 Creando stream 'INVENTORY'..."
nats stream add INVENTORY \
  --subjects "inventory.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-age=7d \
  --max-msg-size=1048576 \
  --discard old \
  --replicas 1 || echo "Stream INVENTORY ya existe"

# Crear consumers
echo "👥 Creando consumers..."

# Consumer para Payment Service escuchando eventos de Order
nats consumer add ORDERS payment-service \
  --filter "orders.created" \
  --deliver all \
  --ack explicit \
  --max-deliver 3 \
  --wait 30s || echo "Consumer payment-service ya existe"

# Consumer para Inventory Service escuchando eventos de Order
nats consumer add ORDERS inventory-service \
  --filter "orders.created" \
  --deliver all \
  --ack explicit \
  --max-deliver 3 \
  --wait 30s || echo "Consumer inventory-service ya existe"

# Consumer para Order Service escuchando eventos de Payment
nats consumer add PAYMENTS order-service-payment \
  --filter "payments.*" \
  --deliver all \
  --ack explicit \
  --max-deliver 3 \
  --wait 30s || echo "Consumer order-service-payment ya existe"

# Consumer para Order Service escuchando eventos de Inventory
nats consumer add INVENTORY order-service-inventory \
  --filter "inventory.*" \
  --deliver all \
  --ack explicit \
  --max-deliver 3 \
  --wait 30s || echo "Consumer order-service-inventory ya existe"

echo "✅ NATS JetStream configurado exitosamente!"
echo ""
echo "📋 Resumen de configuración:"
nats stream ls
echo ""
echo "Para ver detalles de un stream:"
echo "  nats stream info ORDERS"
echo "  nats stream info PAYMENTS"
echo "  nats stream info INVENTORY"
