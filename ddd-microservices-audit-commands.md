# Comandos para Auditoría de Código DDD en Microservicios

## 1. Análisis de Arquitectura DDD

### Verificación de Estructura de Capas


```bash
# Verificar estructura de capas DDD
find . -type d -name "domain" | head -20
find . -type d -name "application" | head -20
find . -type d -name "infrastructure" | head -20
find . -type d -name "presentation" | head -20

# Analizar distribución de código por capas
cloc --by-dir domain/ application/ infrastructure/ presentation/

```


### Detección de Bounded Contexts


```bash
# Buscar contextos delimitados
grep -r "BoundedContext\|Context\|Module" --include="*.java" --include="*.cs" --include="*.ts" --include="*.go" .

# Analizar agregados
grep -r "Aggregate\|AggregateRoot" --include="*.java" --include="*.cs" --include="*.ts" --include="*.go" .

```


### Análisis de Entidades y Value Objects


```bash
# Contar entidades
find . -name "*Entity*" -o -name "*entity*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l

# Contar value objects
find . -name "*ValueObject*" -o -name "*VO*" | grep -E "\.(java|cs|ts|go|py)$" | wc -l

# Ratio entidades vs value objects
echo "scale=2; $(find . -name "*ValueObject*" | wc -l) / $(find . -name "*Entity*" | wc -l)" | bc

```


## 2. Métricas de Calidad de Código

### SonarQube (Estándares Internacionales)


```bash
# Ejecutar análisis SonarQube
sonar-scanner \
  -Dsonar.projectKey=ddd-microservices \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN

# Obtener métricas específicas
curl -u $SONAR_TOKEN: "http://localhost:9000/api/measures/component?component=ddd-microservices&metricKeys=coverage,bugs,vulnerabilities,code_smells,duplicated_lines_density,complexity"

```


### PMD (Pattern Matching Detection)


```bash
# Análisis con PMD para Java
pmd -d ./src -R rulesets/java/quickstart.xml -f text -r pmd-report.txt

# Para .NET
dotnet tool install -g dotnet-pmd
dotnet pmd analyze -d ./src -R rulesets/net/quickstart.xml

```


### Complejidad Ciclomática


```bash
# Para Java
lizard -l java -o report.html ./src

# Para múltiples lenguajes
lizard -l java,csharp,python,javascript -o complexity-report.html .

# Obtener métricas específicas
lizard -C 10 -L 100 -a 5 . | grep -E "NLOC|CCN|token|PARAM"

```


## 3. Análisis de Microservicios

### Detección de Anti-patrones


```bash
# Chatty APIs (demasiadas llamadas entre servicios)
grep -r "RestTemplate\|WebClient\|HttpClient" --include="*.java" . | wc -l

# Shared Database (anti-patrón)
find . -name "*.sql" -o -name "*.ddl" | xargs grep -l "CREATE TABLE" | sort | uniq -d

# Distributed Monolith (alto acoplamiento)
grep -r "import.*\.domain\." --include="*.java" | grep -v "same.package" | wc -l

```


### Análisis de APIs REST


```bash
# Contar endpoints
grep -r "@RestController\|@RequestMapping\|@GetMapping\|@PostMapping" --include="*.java" . | wc -l

# Verificar versionado de APIs
grep -r "v[0-9]\|version" --include="*.yaml" --include="*.yml" api/ swagger/

# Analizar contratos OpenAPI/Swagger
swagger-cli validate api-docs/*.yaml
spectral lint api-docs/*.yaml

```


### Métricas de Independencia


```bash
# Análisis de dependencias con jdeps (Java)
jdeps -s -recursive target/*.jar

# Para .NET
dotnet list package --include-transitive

# Análisis de acoplamiento
madge --circular --extensions js,ts src/

```


## 4. Herramientas de Análisis Avanzado

### ArchUnit (Java)


```java
// Archivo: ArchitectureTest.java
@Test
public void domainShouldNotDependOnInfrastructure() {
    noClasses()
        .that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAPackage("..infrastructure..")
        .check(classes);
}

```


### Ejecutar tests de arquitectura


```bash
mvn test -Dtest=ArchitectureTest
gradle test --tests ArchitectureTest

```


### Structure101 (Análisis de Estructura)


```bash
# Generar reporte de estructura
java -jar structure101-java.jar -project myproject.prj -report -outputDirectory reports/

# Análisis de complejidad estructural
s101 -project myproject.s101prj -report-tangles -report-fat -report-xl

```


## 5. Benchmarking contra Estándares

### Métricas Internacionales (ISO/IEC 25010)


```bash
# Script para calcular métricas ISO
cat > iso-metrics.sh << 'EOF'
#!/bin/bash
echo "=== Métricas ISO/IEC 25010 ==="
echo "Mantenibilidad:"
echo "- Modularidad: $(find . -name "*.java" | xargs grep -l "interface" | wc -l)"
echo "- Reusabilidad: $(find . -name "*Utils*" -o -name "*Helper*" | wc -l)"
echo "- Analizabilidad: $(lizard -C 10 . | grep "NLOC" | awk '{sum+=$2} END {print sum/NR}')"
echo "- Modificabilidad: $(git log --since="6 months ago" --oneline | wc -l)"
echo "- Testeabilidad: $(find . -name "*Test*" | wc -l)"
EOF
chmod +x iso-metrics.sh
./iso-metrics.sh

```


### Estándares Europeos (ECSS)


```bash
# Verificar cumplimiento ECSS-Q-ST-80C
echo "=== ECSS Software Quality Metrics ==="
echo "Code Coverage: $(grep -oP 'coverage="\K[^"]+' coverage.xml | head -1)%"
echo "Static Analysis Violations: $(wc -l < pmd-report.txt)"
echo "Cyclomatic Complexity Average: $(lizard . | tail -1 | awk '{print $3}')"

```


### Comparación con Medias Nacionales


```bash
# Script de comparación
cat > benchmark-comparison.sh << 'EOF'
#!/bin/bash
# Medias de referencia (ajustar según país)
INTL_COVERAGE=80
EU_COVERAGE=75
NATIONAL_COVERAGE=70

INTL_COMPLEXITY=10
EU_COMPLEXITY=12
NATIONAL_COMPLEXITY=15

# Obtener métricas actuales
CURRENT_COVERAGE=$(grep -oP 'coverage="\K[^"]+' coverage.xml | head -1)
CURRENT_COMPLEXITY=$(lizard . | tail -1 | awk '{print $3}')

echo "=== Comparación de Métricas ==="
echo "Coverage:"
echo "  Tu proyecto: $CURRENT_COVERAGE%"
echo "  Media Internacional: $INTL_COVERAGE%"
echo "  Media Europea: $EU_COVERAGE%"
echo "  Media Nacional: $NATIONAL_COVERAGE%"
echo ""
echo "Complejidad Ciclomática:"
echo "  Tu proyecto: $CURRENT_COMPLEXITY"
echo "  Media Internacional: $INTL_COMPLEXITY"
echo "  Media Europea: $EU_COMPLEXITY"
echo "  Media Nacional: $NATIONAL_COMPLEXITY"
EOF
chmod +x benchmark-comparison.sh

```


## 6. Automatización con CI/CD

### GitLab CI Pipeline


```yaml
# .gitlab-ci.yml
stages:
  - analysis
  - benchmark

ddd-analysis:
  stage: analysis
  script:
    - ./check-ddd-structure.sh
    - lizard -C 10 -o complexity.xml .
    - sonar-scanner
  artifacts:
    reports:
      junit: complexity.xml

benchmark:
  stage: benchmark
  script:
    - ./benchmark-comparison.sh > benchmark-report.txt
  artifacts:
    paths:
      - benchmark-report.txt

```


### GitHub Actions


```yaml
# .github/workflows/ddd-audit.yml
name: DDD Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run DDD Structure Analysis
        run: |
          ./check-ddd-structure.sh

      - name: Calculate Metrics
        run: |
          lizard -C 10 -o complexity.xml .

      - name: Compare with Standards
        run: |
          ./benchmark-comparison.sh

```


## 7. Dashboard de Métricas

### Script para Generar Reporte HTML


```bash
cat > generate-report.sh << 'EOF'
#!/bin/bash
# Generar reporte HTML con todas las métricas

cat > ddd-audit-report.html << HTML
<!DOCTYPE html>
<html>
<head>
    <title>DDD Microservices Audit Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .metric { margin: 20px; padding: 20px; border: 1px solid #ddd; }
        .good { background-color: #d4edda; }
        .warning { background-color: #fff3cd; }
        .bad { background-color: #f8d7da; }
    </style>
</head>
<body>
    <h1>DDD Microservices Audit Report</h1>
    <div class="metric">
        <h2>Estructura DDD</h2>
        <p>Bounded Contexts: $(find . -name "*Context*" | wc -l)</p>
        <p>Aggregates: $(find . -name "*Aggregate*" | wc -l)</p>
        <p>Entities: $(find . -name "*Entity*" | wc -l)</p>
        <p>Value Objects: $(find . -name "*ValueObject*" | wc -l)</p>
    </div>
    <div class="metric">
        <h2>Métricas de Calidad</h2>
        <p>Coverage: $(grep -oP 'coverage="\K[^"]+' coverage.xml | head -1)%</p>
        <p>Complejidad Promedio: $(lizard . | tail -1 | awk '{print $3}')</p>
        <p>Duplicación: $(grep "duplication" sonar-report.json | grep -oP '\d+\.\d+')%</p>
    </div>
</body>
</html>
HTML
EOF
chmod +x generate-report.sh

```


## 8. Checklist de Auditoría DDD


```bash
# Script de validación DDD
cat > ddd-checklist.sh << 'EOF'
#!/bin/bash
echo "=== DDD Audit Checklist ==="
echo "[$(find . -name "*BoundedContext*" | wc -l) > 0] ✓ Bounded Contexts definidos"
echo "[$(find . -name "*Repository*" | wc -l) > 0] ✓ Repositorios implementados"
echo "[$(find . -name "*Service*" | wc -l) > 0] ✓ Servicios de dominio"
echo "[$(find . -name "*Event*" | wc -l) > 0] ✓ Domain Events"
echo "[$(find . -name "*Specification*" | wc -l) > 0] ✓ Specifications pattern"
echo "[$(find . -name "*Factory*" | wc -l) > 0] ✓ Factories"
echo "[$(find . -name "*DTO*" | wc -l) > 0] ✓ DTOs para comunicación"
EOF
chmod +x ddd-checklist.sh

```


## Recursos Adicionales

- **ISO/IEC 25010**: https://iso25000.com/index.php/en/iso-25000-standards/iso-25010
- **ECSS Standards**: https://ecss.nl/standards/
- **DDD Reference**: https://domainlanguage.com/ddd/reference/
- **Microservices Patterns**: https://microservices.io/patterns/

## Notas

- Ajusta los umbrales según los estándares de tu país/industria
- Considera usar herramientas específicas del lenguaje de tu proyecto
- Automatiza estos comandos en tu pipeline CI/CD
- Genera reportes periódicos para tracking de mejoras
