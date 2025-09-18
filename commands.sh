#!/bin/bash

# 📋 A4CO DDD Microservices - Guía Rápida de Comandos
# Muestra todos los comandos disponibles organizadamente
# Versión: 1.0.0
# Fecha: $(date)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Función para mostrar banner
show_banner() {
    echo ""
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} ${WHITE}📋 A4CO DDD MICROSERVICES - GUÍA RÁPIDA DE COMANDOS${NC} ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Función para mostrar sección
show_section() {
    echo -e "${CYAN}┌─ $1${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────${NC}"
}

# Función para mostrar comando
show_command() {
    printf "  ${GREEN}%-35s${NC} %s\n" "$1" "$2"
}

# Función principal
main() {
    show_banner

    echo -e "${YELLOW}🚀 COMANDOS PARA EMPEZAR${NC}"
    echo ""
    show_command "./setup.sh" "Configuración inicial completa del entorno"
    show_command "./start.sh" "Menú interactivo principal (recomendado)"
    echo ""

    echo -e "${BLUE}💻 DESARROLLO${NC}"
    echo ""
    show_section "Desarrollo Completo"
    show_command "./dev.sh dev full" "Desarrollo completo con Docker"
    show_command "./dev.sh dev frontend" "Solo aplicaciones frontend"
    show_command "./dev.sh dev backend" "Solo servicios backend"
    show_command "./dev.sh dev dashboard" "Solo dashboard"
    echo ""
    show_section "Testing"
    show_command "./dev.sh test all" "Ejecutar todos los tests"
    show_command "./dev.sh test watch" "Tests en modo watch"
    show_command "./dev.sh test coverage" "Tests con cobertura"
    echo ""
    show_section "Linting"
    show_command "./dev.sh lint check" "Verificar código"
    show_command "./dev.sh lint fix" "Corregir código"
    echo ""

    echo -e "${PURPLE}🔨 COMPILACIÓN${NC}"
    echo ""
    show_section "Compilación"
    show_command "./build.sh all" "Compilación completa"
    show_command "./build.sh fast" "Compilación rápida"
    show_command "./build.sh backend" "Solo backend"
    show_command "./build.sh frontend" "Solo frontend"
    show_command "./build.sh packages" "Solo paquetes"
    echo ""
    show_section "Utilidades"
    show_command "./build.sh clean" "Limpiar builds"
    show_command "./build.sh check" "Verificaciones (types + lint)"
    show_command "./build.sh test" "Ejecutar tests"
    echo ""

    echo -e "${RED}🚀 DESPLIEGUE${NC}"
    echo ""
    show_section "Despliegue Principal"
    show_command "./deploy.sh deploy" "Despliegue completo"
    show_command "./deploy.sh start" "Iniciar servicios"
    show_command "./deploy.sh stop" "Detener servicios"
    show_command "./deploy.sh restart" "Reiniciar servicios"
    echo ""
    show_section "Monitoreo"
    show_command "./deploy.sh status" "Estado de servicios"
    show_command "./deploy.sh logs" "Ver logs de todos los servicios"
    show_command "./deploy.sh logs [service]" "Logs de un servicio específico"
    echo ""
    show_section "Utilidades"
    show_command "./deploy.sh build" "Construir imágenes Docker"
    show_command "./deploy.sh exec [srv] [cmd]" "Ejecutar comando en contenedor"
    show_command "./deploy.sh backup [name]" "Crear backup"
    show_command "./deploy.sh restore [name]" "Restaurar backup"
    echo ""

    echo -e "${YELLOW}🔧 GESTIÓN DE SERVICIOS${NC}"
    echo ""
    show_section "Servicios Individuales"
    show_command "./service.sh list" "Listar servicios disponibles"
    show_command "./service.sh start [service]" "Iniciar servicio específico"
    show_command "./service.sh build [service]" "Construir servicio"
    show_command "./service.sh test [service]" "Tests de servicio"
    show_command "./service.sh logs [service]" "Logs de servicio"
    show_command "./service.sh status" "Estado de todos los servicios"
    echo ""

    echo -e "${GREEN}🌐 URLs DE DESARROLLO${NC}"
    echo ""
    echo -e "Después del despliegue, accede a:"
    echo -e "  ${CYAN}Traefik Dashboard:${NC} http://localhost:8080"
    echo -e "  ${CYAN}Design System:${NC}     http://design.localhost:6006"
    echo -e "  ${CYAN}Web App:${NC}           http://localhost:3000"
    echo -e "  ${CYAN}Dashboard:${NC}         http://dashboard.localhost:3001"
    echo -e "  ${CYAN}API Gateway:${NC}       http://api.localhost:3333"
    echo ""

    echo -e "${PURPLE}📋 SERVICIOS DISPONIBLES${NC}"
    echo ""
    printf "  ${WHITE}%-20s${NC} ${WHITE}%-6s${NC} %s\n" "Servicio" "Puerto" "Descripción"
    printf "  ${WHITE}%-20s${NC} ${WHITE}%-6s${NC} %s\n" "--------" "------" "-----------"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "auth-service" "3001" "Autenticación"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "user-service" "3002" "Gestión de usuarios"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "product-service" "3003" "Catálogo de productos"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "order-service" "3004" "Gestión de pedidos"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "payment-service" "3005" "Procesamiento de pagos"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "notification-service" "3006" "Notificaciones"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "analytics-service" "3007" "Análisis y métricas"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "chat-service" "3008" "Mensajería"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "cms-service" "3009" "Gestión de contenido"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "event-service" "3010" "Sistema de eventos"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "geo-service" "3011" "Servicios geoespaciales"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "inventory-service" "3012" "Gestión de inventario"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "loyalty-service" "3013" "Programa de fidelización"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "transportista-service" "3014" "Transportistas"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "artisan-service" "3015" "Servicios para artesanos"
    printf "  ${CYAN}%-20s${NC} ${YELLOW}%-6s${NC} %s\n" "admin-service" "3016" "Panel de administración"
    echo ""

    echo -e "${BLUE}💡 TIPS ÚTILES${NC}"
    echo ""
    echo -e "• ${YELLOW}Primer uso:${NC} Ejecuta ${GREEN}./setup.sh${NC} para configurar el entorno"
    echo -e "• ${YELLOW}Desarrollo rápido:${NC} Usa ${GREEN}./start.sh${NC} para menú interactivo"
    echo -e "• ${YELLOW}Despliegue completo:${NC} Ejecuta ${GREEN}./deploy.sh deploy${NC}"
    echo -e "• ${YELLOW}Ver logs en tiempo real:${NC} ${GREEN}./deploy.sh logs:follow${NC}"
    echo -e "• ${YELLOW}Limpiar todo:${NC} ${GREEN}./deploy.sh clean${NC} y ${GREEN}./build.sh clean${NC}"
    echo ""

    echo -e "${PURPLE}📚 DOCUMENTACIÓN ADICIONAL${NC}"
    echo ""
    echo -e "• ${CYAN}README.md:${NC} Documentación completa del proyecto"
    echo -e "• ${CYAN}docs/:${NC} Documentación técnica y guías"
    echo -e "• ${CYAN}OPTIMIZACION_COMPLETADA.md:${NC} Resumen de optimizaciones"
    echo ""

    echo -e "${GREEN}🎯 ¿LISTO PARA EMPEZAR?${NC}"
    echo ""
    echo -e "Ejecuta ${GREEN}./start.sh${NC} para comenzar o ${GREEN}./setup.sh${NC} si es tu primera vez"
    echo ""
}

# Ejecutar función principal
main "$@"
