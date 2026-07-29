# 🏗️ DDD Microservices Audit Tools

Conjunto completo de herramientas y comandos para auditar código de microservicios con Domain-Driven Design (DDD) y comparar métricas con estándares internacionales, europeos y nacionales.

## 📋 Contenido

- **Comandos de auditoría DDD**
- **Scripts automatizados**
- **Pipelines CI/CD**
- **Comparación con estándares de la industria**
- **Reportes HTML interactivos**

## 🚀 Inicio Rápido

### 1. Ejecutar Auditoría Completa


```bash
# Dar permisos de ejecución
chmod +x scripts/*.sh

# Ejecutar auditoría completa
./scripts/ddd-audit-runner.sh


```


### 2. Análisis por Lenguaje


```bash
# Detecta automáticamente el lenguaje y ejecuta análisis específico
./scripts/language-specific-metrics.sh


```


## 📊 Métricas Evaluadas

### Estructura DDD

- ✅ Bounded Contexts
- ✅ Aggregates
- ✅ Entities
- ✅ Value Objects
- ✅ Domain Events
- ✅ Repositories
- ✅ Domain Services

### Calidad de Código

- 📈 Cobertura de tests
- 📉 Complejidad ciclomática
- 🔄 Duplicación de código
- 🐛 Bugs y vulnerabilidades
- 💰 Deuda técnica

### Patrones de Microservicios

- 🌐 APIs REST
- 📡 Comunicación entre servicios
- 🚫 Anti-patrones detectados
- 🔗 Acoplamiento entre dominios

## 📏 Estándares de Comparación

### Internacional (ISO/IEC 25010)

- Coverage: 80%
- Complejidad: <10
- Duplicación: <5%
- Deuda técnica: <5 días

### Europeo (ECSS)

- Coverage: 75%
- Complejidad: <12
- Duplicación: <7%
- Deuda técnica: <10 días

### Nacional

- Coverage: 70%
- Complejidad: <15
- Duplicación: <10%
- Deuda técnica: <15 días

## 🛠️ Herramientas Utilizadas

### Análisis General

- **Lizard**: Complejidad ciclomática
- **CLOC**: Líneas de código
- **SonarQube**: Análisis completo de calidad

### Por Lenguaje

#### Java

- Maven/Gradle
- SpotBugs
- JaCoCo (coverage)
- Checkstyle
- ArchUnit

#### C#/.NET

- dotnet CLI
- SonarScanner for .NET
- Coverlet
- StyleCop

#### TypeScript/JavaScript

- ESLint/TSLint
- Jest (coverage)
- npm audit
- Madge (dependencias)

#### Python

- Pylint
- Coverage.py
- Bandit (seguridad)
- Black (formato)

#### Go

- go vet
- golint
- gocyclo
- go test -cover

## 🔄 Integración CI/CD

### GitHub Actions

El workflow incluido (`./github/workflows/ddd-audit.yml`) ejecuta automáticamente:

1. Análisis de estructura DDD
2. Métricas de calidad
3. Análisis específico por lenguaje
4. Comparación con estándares
5. Generación de reportes

### Configuración


```yaml
# Ejecutar en
- Push a main/develop
- Pull requests
- Programado (lunes 9 AM)
- Manual (workflow_dispatch)

```


### Secrets Necesarios


```bash
SONAR_TOKEN      # Token de SonarQube
SONAR_HOST_URL   # URL del servidor SonarQube


```


## 📈 Reportes Generados

### 1. Reporte de Estructura (`ddd-structure-analysis.txt`)


```


=== ANÁLISIS DE ESTRUCTURA DDD ===
Bounded Contexts: 3
Aggregates: 7
Entities: 15
Value Objects: 32
Domain Events: 18


```


### 2. Reporte HTML Interactivo

- Dashboard visual con métricas
- Comparación con estándares
- Recomendaciones específicas
- Gráficos de progreso

### 3. Reporte de Lenguaje Específico

- Métricas propias del lenguaje
- Herramientas específicas
- Mejores prácticas

## 🎯 Cómo Interpretar los Resultados

### 🟢 Verde (Bueno)

- Cumple o supera estándares internacionales
- No requiere acción inmediata

### 🟡 Amarillo (Advertencia)

- Por debajo de estándares pero aceptable
- Considerar mejoras a mediano plazo

### 🔴 Rojo (Crítico)

- Significativamente por debajo de estándares
- Requiere atención inmediata

## 📝 Personalización

### Ajustar Umbrales

Edita los scripts para cambiar umbrales según tu contexto:


```bash
# En scripts/ddd-audit-runner.sh
INTL_COVERAGE=80    # Cambiar a tu estándar
EU_COVERAGE=75      # Ajustar según necesidad
NATIONAL_COVERAGE=70 # Basado en tu país/industria


```


### Agregar Herramientas

Para agregar nuevas herramientas de análisis:

1. Edita `scripts/language-specific-metrics.sh`
2. Agrega la herramienta en la función del lenguaje
3. Actualiza el reporte de comparación

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📚 Recursos Adicionales

- [Domain-Driven Design Reference](https://domainlanguage.com/ddd/reference/)
- [ISO/IEC 25010 Standards](https://iso25000.com/)
- [Microservices Patterns](https://microservices.io/patterns/)
- [SonarQube Documentation](https://docs.sonarqube.org/)

## 🐛 Troubleshooting

### Error: Herramienta no encontrada


```bash
# Instalar herramientas básicas
pip install lizard
sudo apt-get install cloc
npm install -g madge


```


### Error: Permisos denegados


```bash
chmod +x scripts/*.sh


```


### Error: No se encuentran archivos DDD

- Verifica que tu proyecto siga convenciones de nomenclatura DDD
- Ajusta los patrones de búsqueda en los scripts

## 📄 Licencia

La baseline controlada actual de estas herramientas está sujeta a la
**Clarity Structures Commercial Source-Available License v1.1**. Consulta
[`../LICENSE`](../LICENSE) y [`../NOTICE.md`](../NOTICE.md).

Las copias históricas que hubieran incluido expresamente una declaración MIT
conservan únicamente los derechos correspondientes a esas copias identificadas.

---

**Nota**: Ajusta los estándares y umbrales según las necesidades específicas de tu organización, industria y país.
