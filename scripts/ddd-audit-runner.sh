#!/bin/bash
# Script principal para ejecutar auditoría completa de DDD en microservicios

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Auditoría DDD Microservicios ===${NC}"
echo -e "${BLUE}Fecha: $(date)${NC}"
echo ""

# Crear directorio para reportes
mkdir -p audit-reports
cd audit-reports

# 1. Análisis de Estructura DDD
echo -e "${YELLOW}1. Analizando Estructura DDD...${NC}"
cat > ddd-structure-analysis.txt << EOF
=== ANÁLISIS DE ESTRUCTURA DDD ===
Fecha: $(date)

CAPAS DETECTADAS:
Domain: $(find .. -type d -name "domain" | wc -l) directorios
Application: $(find .. -type d -name "application" | wc -l) directorios
Infrastructure: $(find .. -type d -name "infrastructure" | wc -l) directorios
Presentation: $(find .. -type d -name "presentation" | wc -l) directorios

ELEMENTOS DDD:
Bounded Contexts: $(find .. -name "*BoundedContext*" -o -name "*Context*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Aggregates: $(find .. -name "*Aggregate*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Entities: $(find .. -name "*Entity*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Value Objects: $(find .. -name "*ValueObject*" -o -name "*VO*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Domain Services: $(find .. -name "*DomainService*" -o -name "*Service*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Repositories: $(find .. -name "*Repository*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
Domain Events: $(find .. -name "*Event*" -o -name "*DomainEvent*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)
EOF

# 2. Métricas de Calidad
echo -e "${YELLOW}2. Calculando Métricas de Calidad...${NC}"

# Verificar si existen herramientas
if command -v lizard &> /dev/null; then
    echo "Ejecutando análisis de complejidad con Lizard..."
    lizard .. -o lizard-report.html
    lizard .. -C 10 -L 100 -a 5 | tail -20 > complexity-summary.txt
else
    echo -e "${RED}Lizard no está instalado. Instálalo con: pip install lizard${NC}"
fi

if command -v cloc &> /dev/null; then
    echo "Analizando líneas de código..."
    cloc .. --out=cloc-report.txt --exclude-dir=node_modules,vendor,.git
else
    echo -e "${RED}CLOC no está instalado. Instálalo según tu sistema operativo${NC}"
fi

# 3. Análisis de Microservicios
echo -e "${YELLOW}3. Analizando Patrones de Microservicios...${NC}"
cat > microservices-analysis.txt << EOF
=== ANÁLISIS DE MICROSERVICIOS ===

APIS REST:
Total Endpoints: $(grep -r "@RestController\|@RequestMapping\|@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping" --include="*.java" .. 2>/dev/null | wc -l)
Controllers: $(find .. -name "*Controller*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)

COMUNICACIÓN ENTRE SERVICIOS:
HTTP Clients: $(grep -r "RestTemplate\|WebClient\|HttpClient\|FeignClient" --include="*.java" --include="*.cs" --include="*.ts" .. 2>/dev/null | wc -l)
Message Queues: $(grep -r "RabbitMQ\|Kafka\|AMQP\|JMS" --include="*.java" --include="*.cs" --include="*.ts" .. 2>/dev/null | wc -l)

POTENCIALES ANTI-PATRONES:
Shared Database References: $(find .. -name "*.sql" -o -name "*.ddl" 2>/dev/null | xargs grep -l "CREATE TABLE" 2>/dev/null | sort | uniq -d | wc -l)
Cross-Domain Imports: $(grep -r "import.*\.domain\." --include="*.java" .. 2>/dev/null | grep -v "same.domain" | wc -l)
EOF

# 4. Generar Métricas de Benchmarking
echo -e "${YELLOW}4. Generando Comparación con Estándares...${NC}"
cat > benchmark-comparison.txt << EOF
=== COMPARACIÓN CON ESTÁNDARES INTERNACIONALES ===

ESTÁNDARES DE REFERENCIA:
                    Internacional   Europeo    Nacional    Tu Proyecto
Coverage:           80%            75%        70%         [Ejecutar tests]
Complejidad Avg:    10             12         15          $(lizard .. 2>/dev/null | tail -1 | awk '{print $3}' || echo "N/A")
Duplicación:        < 5%           < 7%       < 10%       [Ejecutar análisis]
Deuda Técnica:      < 5 días       < 10 días  < 15 días   [Ejecutar SonarQube]

MÉTRICAS ISO/IEC 25010:
Mantenibilidad:
- Modularidad: $(find .. -name "*.java" -o -name "*.cs" -o -name "*.ts" 2>/dev/null | xargs grep -l "interface" 2>/dev/null | wc -l) interfaces
- Reusabilidad: $(find .. -name "*Utils*" -o -name "*Helper*" -o -name "*Common*" 2>/dev/null | wc -l) componentes reutilizables
- Testeabilidad: $(find .. -name "*Test*" -o -name "*Spec*" 2>/dev/null | wc -l) archivos de test

CUMPLIMIENTO DDD:
✓ Separación de capas: $([ $(find .. -type d -name "domain" | wc -l) -gt 0 ] && echo "SÍ" || echo "NO")
✓ Bounded Contexts: $([ $(find .. -name "*BoundedContext*" | wc -l) -gt 0 ] && echo "SÍ" || echo "NO")
✓ Aggregates definidos: $([ $(find .. -name "*Aggregate*" | wc -l) -gt 0 ] && echo "SÍ" || echo "NO")
✓ Value Objects: $([ $(find .. -name "*ValueObject*" | wc -l) -gt 0 ] && echo "SÍ" || echo "NO")
✓ Domain Events: $([ $(find .. -name "*Event*" | wc -l) -gt 0 ] && echo "SÍ" || echo "NO")
EOF

# 5. Generar Reporte HTML Consolidado
echo -e "${YELLOW}5. Generando Reporte HTML...${NC}"
cat > ddd-audit-report.html << HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Auditoría DDD Microservicios</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1, h2, h3 { color: #2c3e50; }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        .metric-card {
            background: white;
            padding: 1.5rem;
            margin: 1rem 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .metric-label {
            color: #666;
            font-size: 0.9rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        .status-good { color: #27ae60; }
        .status-warning { color: #f39c12; }
        .status-bad { color: #e74c3c; }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #27ae60 0%, #f39c12 50%, #e74c3c 100%);
            transition: width 0.3s ease;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .recommendation {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 1rem;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏗️ Reporte de Auditoría DDD Microservicios</h1>
        <p>Generado el: $(date)</p>
    </div>

    <section class="metric-card">
        <h2>📊 Resumen Ejecutivo</h2>
        <div class="grid">
            <div>
                <div class="metric-label">Bounded Contexts</div>
                <div class="metric-value">$(find .. -name "*BoundedContext*" | wc -l)</div>
            </div>
            <div>
                <div class="metric-label">Microservicios</div>
                <div class="metric-value">$(find .. -name "*Service*" -type d | wc -l)</div>
            </div>
            <div>
                <div class="metric-label">Total Entidades</div>
                <div class="metric-value">$(find .. -name "*Entity*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)</div>
            </div>
            <div>
                <div class="metric-label">Value Objects</div>
                <div class="metric-value">$(find .. -name "*ValueObject*" -o -name "*VO*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l)</div>
            </div>
        </div>
    </section>

    <section class="metric-card">
        <h2>🎯 Cumplimiento DDD</h2>
        <table>
            <tr>
                <th>Criterio</th>
                <th>Estado</th>
                <th>Detalles</th>
            </tr>
            <tr>
                <td>Separación de Capas</td>
                <td class="$([ $(find .. -type d -name "domain" | wc -l) -gt 0 ] && echo "status-good" || echo "status-bad")">
                    $([ $(find .. -type d -name "domain" | wc -l) -gt 0 ] && echo "✅ Cumple" || echo "❌ No Cumple")
                </td>
                <td>Domain, Application, Infrastructure, Presentation</td>
            </tr>
            <tr>
                <td>Bounded Contexts Definidos</td>
                <td class="$([ $(find .. -name "*BoundedContext*" | wc -l) -gt 0 ] && echo "status-good" || echo "status-bad")">
                    $([ $(find .. -name "*BoundedContext*" | wc -l) -gt 0 ] && echo "✅ Cumple" || echo "❌ No Cumple")
                </td>
                <td>$(find .. -name "*BoundedContext*" | wc -l) contextos encontrados</td>
            </tr>
            <tr>
                <td>Uso de Aggregates</td>
                <td class="$([ $(find .. -name "*Aggregate*" | wc -l) -gt 0 ] && echo "status-good" || echo "status-bad")">
                    $([ $(find .. -name "*Aggregate*" | wc -l) -gt 0 ] && echo "✅ Cumple" || echo "❌ No Cumple")
                </td>
                <td>$(find .. -name "*Aggregate*" | wc -l) aggregates definidos</td>
            </tr>
            <tr>
                <td>Domain Events</td>
                <td class="$([ $(find .. -name "*Event*" | wc -l) -gt 0 ] && echo "status-good" || echo "status-warning")">
                    $([ $(find .. -name "*Event*" | wc -l) -gt 0 ] && echo "✅ Cumple" || echo "⚠️ Revisar")
                </td>
                <td>$(find .. -name "*Event*" | wc -l) eventos de dominio</td>
            </tr>
        </table>
    </section>

    <section class="metric-card">
        <h2>📈 Métricas vs Estándares</h2>
        <table>
            <tr>
                <th>Métrica</th>
                <th>Tu Proyecto</th>
                <th>Media Nacional</th>
                <th>Media Europea</th>
                <th>Media Internacional</th>
            </tr>
            <tr>
                <td>Complejidad Ciclomática</td>
                <td>$(lizard .. 2>/dev/null | tail -1 | awk '{print $3}' || echo "N/A")</td>
                <td>15</td>
                <td>12</td>
                <td>10</td>
            </tr>
            <tr>
                <td>Coverage Objetivo</td>
                <td>Por medir</td>
                <td>70%</td>
                <td>75%</td>
                <td>80%</td>
            </tr>
            <tr>
                <td>Duplicación Máxima</td>
                <td>Por medir</td>
                <td>10%</td>
                <td>7%</td>
                <td>5%</td>
            </tr>
        </table>
    </section>

    <section class="metric-card">
        <h2>💡 Recomendaciones</h2>
        <div class="recommendation">
            <h3>Próximos Pasos</h3>
            <ol>
                <li>Configurar SonarQube para análisis continuo de calidad</li>
                <li>Implementar tests unitarios para alcanzar 80% de coverage</li>
                <li>Revisar y documentar los Bounded Contexts</li>
                <li>Establecer métricas de monitoreo en producción</li>
                <li>Automatizar estos análisis en el pipeline CI/CD</li>
            </ol>
        </div>
    </section>

    <footer style="text-align: center; margin-top: 3rem; color: #666;">
        <p>Reporte generado automáticamente | Para más detalles, revisar los archivos .txt en el directorio audit-reports/</p>
    </footer>
</body>
</html>
HTML

# 6. Resumen final
echo -e "${GREEN}=== Auditoría Completada ===${NC}"
echo -e "${GREEN}Reportes generados en: $(pwd)${NC}"
echo ""
echo "Archivos generados:"
ls -la *.txt *.html 2>/dev/null | awk '{print "  - " $9}'
echo ""
echo -e "${BLUE}Para ver el reporte HTML, abre: ${NC}"
echo "  file://$(pwd)/ddd-audit-report.html"
echo ""
echo -e "${YELLOW}Recomendaciones:${NC}"
echo "1. Instala herramientas faltantes para análisis más completo"
echo "2. Configura SonarQube para métricas detalladas"
echo "3. Ejecuta tests para obtener métricas de coverage"
echo "4. Automatiza este script en tu pipeline CI/CD"