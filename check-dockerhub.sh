#!/bin/bash

# Script para monitorear el estado de Docker Hub
# Uso: ./check-dockerhub.sh

echo "🔍 Verificando estado de Docker Hub..."

# Verificar conectividad básica
if curl -s --max-time 10 https://hub.docker.com > /dev/null 2>&1; then
    echo "✅ Docker Hub website: OK"
else
    echo "❌ Docker Hub website: DOWN"
fi

# Verificar API
if curl -s --max-time 10 https://hub.docker.com/v2/ > /dev/null 2>&1; then
    echo "✅ Docker Hub API: OK"
else
    echo "❌ Docker Hub API: DOWN"
fi

# Verificar login (requiere credenciales)
if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
    if echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin > /dev/null 2>&1; then
        echo "✅ Docker Hub login: OK"
    else
        echo "❌ Docker Hub login: FAILED"
    fi
else
    echo "⚠️  Docker Hub login: SKIPPED (no credentials provided)"
fi

echo ""
echo "📊 Estado actual:"
echo "- Website: $(curl -s -o /dev/null -w "%{http_code}" https://hub.docker.com)"
echo "- API: $(curl -s -o /dev/null -w "%{http_code}" https://hub.docker.com/v2/)"
echo ""
echo "🔄 Monitoreo continuo cada 5 minutos... (Ctrl+C para detener)"

while true; do
    if curl -s --max-time 5 https://hub.docker.com/v2/ > /dev/null 2>&1; then
        echo "$(date): ✅ Docker Hub está funcionando"
        break
    else
        echo "$(date): ❌ Docker Hub sigue caído"
    fi
    sleep 300  # 5 minutos
done

echo ""
echo "🎉 ¡Docker Hub ha vuelto! Puedes reanudar los builds normales."