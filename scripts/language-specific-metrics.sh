#!/bin/bash
# Script para análisis de métricas DDD específicas por lenguaje

# Detectar lenguaje principal del proyecto
detect_main_language() {
    local java_files=$(find . -name "*.java" | wc -l)
    local csharp_files=$(find . -name "*.cs" | wc -l)
    local typescript_files=$(find . -name "*.ts" | wc -l)
    local python_files=$(find . -name "*.py" | wc -l)
    local go_files=$(find . -name "*.go" | wc -l)
    
    local max_files=$java_files
    local language="java"
    
    if [ $csharp_files -gt $max_files ]; then
        max_files=$csharp_files
        language="csharp"
    fi
    
    if [ $typescript_files -gt $max_files ]; then
        max_files=$typescript_files
        language="typescript"
    fi
    
    if [ $python_files -gt $max_files ]; then
        max_files=$python_files
        language="python"
    fi
    
    if [ $go_files -gt $max_files ]; then
        max_files=$go_files
        language="go"
    fi
    
    echo $language
}

# Análisis para Java
analyze_java() {
    echo "=== Análisis DDD para Java ==="
    echo ""
    
    # Verificar anotaciones DDD
    echo "Anotaciones DDD encontradas:"
    grep -r "@Entity\|@ValueObject\|@AggregateRoot\|@DomainEvent" --include="*.java" . | wc -l
    
    # Análisis de Spring Boot (si aplica)
    if grep -r "org.springframework" --include="*.java" . > /dev/null 2>&1; then
        echo ""
        echo "Spring Boot detectado:"
        echo "- RestControllers: $(grep -r "@RestController" --include="*.java" . | wc -l)"
        echo "- Services: $(grep -r "@Service" --include="*.java" . | wc -l)"
        echo "- Repositories: $(grep -r "@Repository" --include="*.java" . | wc -l)"
    fi
    
    # Métricas con herramientas Java
    if command -v mvn &> /dev/null && [ -f "pom.xml" ]; then
        echo ""
        echo "Ejecutando análisis Maven..."
        mvn clean compile
        
        # SpotBugs
        if grep -q "spotbugs-maven-plugin" pom.xml; then
            mvn spotbugs:check || true
        fi
        
        # JaCoCo para coverage
        if grep -q "jacoco-maven-plugin" pom.xml; then
            mvn test jacoco:report || true
            echo "Coverage report generado en target/site/jacoco/"
        fi
    fi
    
    # Checkstyle
    if command -v checkstyle &> /dev/null; then
        echo ""
        echo "Ejecutando Checkstyle..."
        checkstyle -c /google_checks.xml src/ > checkstyle-report.txt 2>&1 || true
    fi
}

# Análisis para C#/.NET
analyze_csharp() {
    echo "=== Análisis DDD para C#/.NET ==="
    echo ""
    
    # Patrones DDD en C#
    echo "Elementos DDD encontrados:"
    echo "- Entities: $(grep -r "class.*Entity\|: Entity" --include="*.cs" . | wc -l)"
    echo "- Value Objects: $(grep -r "class.*ValueObject\|: ValueObject" --include="*.cs" . | wc -l)"
    echo "- Domain Events: $(grep -r "IDomainEvent\|: DomainEvent" --include="*.cs" . | wc -l)"
    echo "- Specifications: $(grep -r "ISpecification\|: Specification" --include="*.cs" . | wc -l)"
    
    # Análisis de .NET
    if command -v dotnet &> /dev/null; then
        echo ""
        echo "Analizando proyecto .NET..."
        
        # Restaurar dependencias
        dotnet restore
        
        # Análisis de código
        if dotnet tool list -g | grep -q "dotnet-sonarscanner"; then
            echo "Ejecutando SonarScanner para .NET..."
            dotnet sonarscanner begin /k:"ddd-microservices" /d:sonar.host.url="http://localhost:9000"
            dotnet build
            dotnet sonarscanner end
        fi
        
        # Code coverage con coverlet
        if [ -f "*.Tests.csproj" ]; then
            dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
        fi
    fi
}

# Análisis para TypeScript/Node.js
analyze_typescript() {
    echo "=== Análisis DDD para TypeScript ==="
    echo ""
    
    # Patrones DDD en TypeScript
    echo "Elementos DDD encontrados:"
    echo "- Entities: $(grep -r "class.*Entity\|extends Entity" --include="*.ts" . | wc -l)"
    echo "- Value Objects: $(grep -r "class.*ValueObject\|extends ValueObject" --include="*.ts" . | wc -l)"
    echo "- Aggregates: $(grep -r "class.*Aggregate\|extends AggregateRoot" --include="*.ts" . | wc -l)"
    echo "- Use Cases: $(grep -r "UseCase\|class.*UseCase" --include="*.ts" . | wc -l)"
    
    # Análisis con herramientas Node.js
    if [ -f "package.json" ]; then
        echo ""
        echo "Analizando proyecto Node.js..."
        
        # TSLint o ESLint
        if grep -q "eslint" package.json; then
            npm run lint || true
        fi
        
        # Jest para coverage
        if grep -q "jest" package.json; then
            npm test -- --coverage || true
        fi
        
        # Análisis de dependencias
        if command -v npm-audit &> /dev/null; then
            npm audit || true
        fi
    fi
}

# Análisis para Python
analyze_python() {
    echo "=== Análisis DDD para Python ==="
    echo ""
    
    # Patrones DDD en Python
    echo "Elementos DDD encontrados:"
    echo "- Entities: $(grep -r "class.*Entity\|Entity):" --include="*.py" . | wc -l)"
    echo "- Value Objects: $(grep -r "class.*ValueObject\|@dataclass" --include="*.py" . | wc -l)"
    echo "- Repositories: $(grep -r "class.*Repository\|Repository):" --include="*.py" . | wc -l)"
    echo "- Domain Services: $(grep -r "class.*Service\|Service):" --include="*.py" . | wc -l)"
    
    # Análisis con herramientas Python
    if command -v python3 &> /dev/null; then
        echo ""
        echo "Analizando proyecto Python..."
        
        # Pylint
        if command -v pylint &> /dev/null; then
            pylint src/ > pylint-report.txt 2>&1 || true
            echo "Pylint score: $(tail -2 pylint-report.txt | head -1)"
        fi
        
        # Coverage.py
        if command -v coverage &> /dev/null; then
            coverage run -m pytest || true
            coverage report
            coverage html
        fi
        
        # Bandit para seguridad
        if command -v bandit &> /dev/null; then
            bandit -r src/ -f json -o bandit-report.json || true
        fi
    fi
}

# Análisis para Go
analyze_go() {
    echo "=== Análisis DDD para Go ==="
    echo ""
    
    # Patrones DDD en Go
    echo "Elementos DDD encontrados:"
    echo "- Entities: $(grep -r "type.*Entity struct" --include="*.go" . | wc -l)"
    echo "- Value Objects: $(grep -r "type.*Value struct" --include="*.go" . | wc -l)"
    echo "- Interfaces de dominio: $(grep -r "type.*Repository interface" --include="*.go" . | wc -l)"
    echo "- Event handlers: $(grep -r "func.*Handle.*Event" --include="*.go" . | wc -l)"
    
    # Análisis con herramientas Go
    if command -v go &> /dev/null; then
        echo ""
        echo "Analizando proyecto Go..."
        
        # Go vet
        go vet ./... || true
        
        # Golint
        if command -v golint &> /dev/null; then
            golint ./... > golint-report.txt || true
        fi
        
        # Go test con coverage
        go test -coverprofile=coverage.out ./...
        go tool cover -html=coverage.out -o coverage.html
        
        # Análisis de complejidad ciclomática
        if command -v gocyclo &> /dev/null; then
            gocyclo -over 10 . || true
        fi
    fi
}

# Generar reporte comparativo
generate_comparison_report() {
    local language=$1
    
    cat > language-metrics-report.md << EOF
# Reporte de Métricas DDD - $language

## Comparación con Estándares de la Industria

### Métricas de Arquitectura DDD

| Métrica | Tu Proyecto | Promedio Industria | Mejor Práctica |
|---------|-------------|-------------------|----------------|
| Entities por Bounded Context | $(find . -name "*Entity*" | wc -l) | 5-10 | 3-7 |
| Value Objects ratio | Calcular | 2:1 (VO:Entity) | 3:1 |
| Aggregates por BC | $(find . -name "*Aggregate*" | wc -l) | 2-4 | 1-3 |
| Domain Events | $(find . -name "*Event*" | wc -l) | 10+ | 15+ |

### Métricas de Calidad de Código

| Métrica | Tu Proyecto | Estándar Nacional | Estándar EU | Estándar Internacional |
|---------|-------------|-------------------|-------------|------------------------|
| Test Coverage | Por medir | 60% | 70% | 80% |
| Complejidad Ciclomática | Por medir | <20 | <15 | <10 |
| Duplicación de Código | Por medir | <15% | <10% | <5% |
| Deuda Técnica | Por medir | <30 días | <20 días | <10 días |

### Métricas Específicas de $language

EOF

    case $language in
        "java")
            cat >> language-metrics-report.md << EOF
| Métrica Java | Valor | Estándar |
|--------------|-------|----------|
| Uso de Interfaces | $(grep -r "interface" --include="*.java" . | wc -l) | Alto |
| Anotaciones personalizadas | $(grep -r "@interface" --include="*.java" . | wc -l) | Moderado |
| Clases abstractas | $(grep -r "abstract class" --include="*.java" . | wc -l) | Bajo |
EOF
            ;;
        "csharp")
            cat >> language-metrics-report.md << EOF
| Métrica C# | Valor | Estándar |
|------------|-------|----------|
| Interfaces | $(grep -r "interface I" --include="*.cs" . | wc -l) | Alto |
| Records | $(grep -r "record " --include="*.cs" . | wc -l) | Moderado |
| Async/Await | $(grep -r "async\|await" --include="*.cs" . | wc -l) | Alto |
EOF
            ;;
        "typescript")
            cat >> language-metrics-report.md << EOF
| Métrica TypeScript | Valor | Estándar |
|--------------------|-------|----------|
| Interfaces | $(grep -r "interface " --include="*.ts" . | wc -l) | Alto |
| Types | $(grep -r "type " --include="*.ts" . | wc -l) | Moderado |
| Decoradores | $(grep -r "@" --include="*.ts" . | wc -l) | Moderado |
EOF
            ;;
    esac

    echo "" >> language-metrics-report.md
    echo "## Recomendaciones" >> language-metrics-report.md
    echo "" >> language-metrics-report.md
    echo "1. Incrementar la cobertura de tests al 80% mínimo" >> language-metrics-report.md
    echo "2. Reducir la complejidad ciclomática en métodos complejos" >> language-metrics-report.md
    echo "3. Implementar más Value Objects para reducir primitivos" >> language-metrics-report.md
    echo "4. Documentar los Bounded Contexts claramente" >> language-metrics-report.md
}

# Main
main() {
    echo "Detectando lenguaje principal del proyecto..."
    language=$(detect_main_language)
    echo "Lenguaje detectado: $language"
    echo ""
    
    case $language in
        "java")
            analyze_java
            ;;
        "csharp")
            analyze_csharp
            ;;
        "typescript")
            analyze_typescript
            ;;
        "python")
            analyze_python
            ;;
        "go")
            analyze_go
            ;;
        *)
            echo "Lenguaje no soportado para análisis específico"
            exit 1
            ;;
    esac
    
    echo ""
    echo "Generando reporte comparativo..."
    generate_comparison_report $language
    echo ""
    echo "Reporte generado: language-metrics-report.md"
}

main