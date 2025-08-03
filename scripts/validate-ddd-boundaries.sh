#!/bin/bash

# Script para validar las fronteras DDD en el monorepo
# Detecta violaciones de arquitectura y dependencias no permitidas

set -e

echo "🔍 Validando fronteras DDD en el monorepo A4CO..."
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
VIOLATIONS=0
WARNINGS=0

# Función para reportar violaciones
report_violation() {
    echo -e "${RED}❌ VIOLACIÓN:${NC} $1"
    ((VIOLATIONS++))
}

# Función para reportar advertencias
report_warning() {
    echo -e "${YELLOW}⚠️  ADVERTENCIA:${NC} $1"
    ((WARNINGS++))
}

# Función para reportar éxito
report_success() {
    echo -e "${GREEN}✅ OK:${NC} $1"
}

echo ""
echo "1. Verificando importaciones directas entre microservicios..."
echo "------------------------------------------------------------"

# Lista de microservicios
SERVICES=(
    "auth-service"
    "admin-service"
    "analytics-service"
    "artisan-service"
    "chat-service"
    "cms-service"
    "event-service"
    "geo-service"
    "inventory-service"
    "loyalty-service"
    "notification-service"
    "order-service"
    "payment-service"
    "product-service"
    "user-service"
)

# Verificar importaciones cruzadas entre servicios
for service in "${SERVICES[@]}"; do
    if [ -d "apps/$service" ]; then
        echo "  Analizando $service..."
        
        for other_service in "${SERVICES[@]}"; do
            if [ "$service" != "$other_service" ]; then
                # Buscar importaciones del tipo: from '../../other-service'
                if grep -r "from ['\"].*$other_service" "apps/$service" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" --exclude-dir="dist" 2>/dev/null; then
                    report_violation "El servicio '$service' importa directamente desde '$other_service'"
                fi
                
                # Buscar importaciones del tipo: from '@a4co/other-service'
                if grep -r "from ['\"]@a4co/$other_service" "apps/$service" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" --exclude-dir="dist" 2>/dev/null; then
                    report_violation "El servicio '$service' importa el paquete '@a4co/$other_service'"
                fi
            fi
        done
    fi
done

echo ""
echo "2. Verificando duplicación de lógica de dominio..."
echo "------------------------------------------------------------"

# Buscar servicios duplicados en aplicaciones web
WEB_APPS=("web" "dashboard-web")

for app in "${WEB_APPS[@]}"; do
    if [ -d "apps/$app" ]; then
        echo "  Analizando $app..."
        
        # Buscar archivos que parezcan servicios de dominio
        SERVICE_FILES=$(find "apps/$app" -name "*service.ts" -o -name "*Service.ts" 2>/dev/null | grep -v node_modules || true)
        
        if [ ! -z "$SERVICE_FILES" ]; then
            while IFS= read -r file; do
                # Verificar si el archivo contiene lógica de dominio
                if grep -l "class.*Service" "$file" 2>/dev/null; then
                    SERVICE_NAME=$(basename "$file" .ts)
                    
                    # Verificar si existe un microservicio con nombre similar
                    for service in "${SERVICES[@]}"; do
                        if [[ "$SERVICE_NAME" == *"$service"* ]] || [[ "$service" == *"$SERVICE_NAME"* ]]; then
                            report_warning "Posible duplicación de lógica: '$file' puede duplicar funcionalidad de '$service'"
                        fi
                    done
                fi
            done <<< "$SERVICE_FILES"
        fi
    fi
done

echo ""
echo "3. Verificando acceso directo a repositorios de otros dominios..."
echo "------------------------------------------------------------"

# Buscar uso de repositorios de otros servicios
for service in "${SERVICES[@]}"; do
    if [ -d "apps/$service" ]; then
        for other_service in "${SERVICES[@]}"; do
            if [ "$service" != "$other_service" ]; then
                # Convertir nombre del servicio a nombre de repositorio (ej: user-service -> userRepository)
                REPO_NAME=$(echo "$other_service" | sed 's/-service$//' | sed 's/-/_/g')Repository
                
                if grep -r "$REPO_NAME\." "apps/$service" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" --exclude-dir="dist" --exclude="*.test.ts" --exclude="*.spec.ts" 2>/dev/null; then
                    report_violation "El servicio '$service' accede directamente al repositorio '$REPO_NAME' de otro dominio"
                fi
            fi
        done
    fi
done

echo ""
echo "4. Verificando estructura de carpetas DDD..."
echo "------------------------------------------------------------"

# Estructura esperada para cada servicio
EXPECTED_FOLDERS=("domain" "application" "infrastructure")

for service in "${SERVICES[@]}"; do
    if [ -d "apps/$service/src" ]; then
        echo "  Verificando estructura de $service..."
        
        for folder in "${EXPECTED_FOLDERS[@]}"; do
            if [ ! -d "apps/$service/src/$folder" ]; then
                report_warning "El servicio '$service' no tiene la carpeta 'src/$folder' (estructura DDD recomendada)"
            fi
        done
    fi
done

echo ""
echo "5. Verificando contratos compartidos..."
echo "------------------------------------------------------------"

# Verificar si existe el paquete de contratos
if [ ! -d "packages/contracts" ]; then
    report_warning "No existe el paquete 'packages/contracts' para definir interfaces compartidas"
else
    report_success "Paquete de contratos encontrado"
fi

echo ""
echo "6. Verificando importaciones desde aplicaciones web..."
echo "------------------------------------------------------------"

# Verificar que las apps web no importen lógica de dominio directamente
for app in "${WEB_APPS[@]}"; do
    if [ -d "apps/$app" ]; then
        echo "  Analizando importaciones en $app..."
        
        # Buscar importaciones de servicios locales (no de paquetes npm)
        if grep -r "from ['\"].*notification-service['\"]" "apps/$app" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" 2>/dev/null; then
            report_violation "La aplicación '$app' importa directamente un servicio de dominio local"
        fi
    fi
done

echo ""
echo "7. Verificando uso de shared-utils..."
echo "------------------------------------------------------------"

# Verificar que solo se importen utilidades compartidas permitidas
ALLOWED_IMPORTS=(
    "@a4co/shared-utils"
    "@a4co/contracts"
    "@a4co/observability"
)

for service in "${SERVICES[@]}"; do
    if [ -d "apps/$service" ]; then
        # Buscar importaciones de @a4co/* que no estén en la lista permitida
        IMPORTS=$(grep -r "from ['\"]@a4co/" "apps/$service" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" 2>/dev/null || true)
        
        if [ ! -z "$IMPORTS" ]; then
            while IFS= read -r line; do
                ALLOWED=false
                for allowed in "${ALLOWED_IMPORTS[@]}"; do
                    if [[ "$line" == *"$allowed"* ]]; then
                        ALLOWED=true
                        break
                    fi
                done
                
                if [ "$ALLOWED" = false ]; then
                    FILE=$(echo "$line" | cut -d: -f1)
                    report_violation "Importación no permitida en $FILE: $line"
                fi
            done <<< "$IMPORTS"
        fi
    fi
done

echo ""
echo "=============================================="
echo "RESUMEN DE VALIDACIÓN DDD"
echo "=============================================="

if [ $VIOLATIONS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron violaciones de arquitectura DDD${NC}"
    exit 0
else
    echo -e "${RED}Violaciones encontradas: $VIOLATIONS${NC}"
    echo -e "${YELLOW}Advertencias encontradas: $WARNINGS${NC}"
    
    if [ $VIOLATIONS -gt 0 ]; then
        echo ""
        echo "Por favor, corrige las violaciones antes de continuar."
        echo "Consulta DDD_ARCHITECTURE_ANALYSIS.md para más detalles."
        exit 1
    else
        exit 0
    fi
fi