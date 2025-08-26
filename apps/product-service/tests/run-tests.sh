#!/bin/bash

# Script para ejecutar tests de Product Service
# Uso: ./run-tests.sh [opciones]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -h, --help          Mostrar esta ayuda"
    echo "  -c, --coverage      Ejecutar tests con coverage"
    echo "  -w, --watch         Ejecutar tests en modo watch"
    echo "  -v, --verbose       Ejecutar tests con output verbose"
    echo "  -f, --filter        Filtrar tests por patrón"
    echo "  -d, --debug         Ejecutar tests en modo debug"
    echo ""
    echo "Ejemplos:"
    echo "  $0                    # Ejecutar tests básicos"
    echo "  $0 -c                # Tests con coverage"
    echo "  $0 -w                # Tests en modo watch"
    echo "  $0 -f 'ProductService' # Solo tests del service"
    echo "  $0 -f 'Casos de Error' # Solo tests de error"
}

# Variables por defecto
COVERAGE=false
WATCH=false
VERBOSE=false
FILTER=""
DEBUG=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--coverage)
            COVERAGE=true
            shift
            ;;
        -w|--watch)
            WATCH=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--filter)
            FILTER="$2"
            shift 2
            ;;
        -d|--debug)
            DEBUG=true
            shift
            ;;
        *)
            echo -e "${RED}Error: Opción desconocida $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Verificar que estamos en el directorio correcto
if [[ ! -f "package.json" ]] || [[ ! -d "tests" ]]; then
    echo -e "${RED}Error: Debes ejecutar este script desde el directorio de product-service${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Ejecutando tests de Product Service...${NC}"
echo ""

# Construir comando base
CMD="pnpm test"

# Agregar opciones según argumentos
if [[ "$COVERAGE" == true ]]; then
    CMD="pnpm test:coverage"
    echo -e "${YELLOW}📊 Modo: Coverage${NC}"
fi

if [[ "$WATCH" == true ]]; then
    CMD="pnpm test:watch"
    echo -e "${YELLOW}👀 Modo: Watch${NC}"
fi

if [[ "$VERBOSE" == true ]]; then
    CMD="$CMD --verbose"
    echo -e "${YELLOW}🔍 Modo: Verbose${NC}"
fi

if [[ -n "$FILTER" ]]; then
    CMD="$CMD --testNamePattern=\"$FILTER\""
    echo -e "${YELLOW}🎯 Filtro: $FILTER${NC}"
fi

if [[ "$DEBUG" == true ]]; then
    CMD="$CMD --detectOpenHandles --forceExit"
    echo -e "${YELLOW}🐛 Modo: Debug${NC}"
fi

echo ""
echo -e "${BLUE}Comando a ejecutar:${NC}"
echo "$CMD"
echo ""

# Ejecutar tests
echo -e "${BLUE}Ejecutando tests...${NC}"
echo ""

if eval $CMD; then
    echo ""
    echo -e "${GREEN}✅ Tests ejecutados exitosamente!${NC}"
    
    if [[ "$COVERAGE" == true ]]; then
        echo ""
        echo -e "${BLUE}📊 Reporte de coverage generado en:${NC}"
        echo "  - HTML: coverage/lcov-report/index.html"
        echo "  - LCOV: coverage/lcov.info"
    fi
else
    echo ""
    echo -e "${RED}❌ Los tests fallaron${NC}"
    exit 1
fi
