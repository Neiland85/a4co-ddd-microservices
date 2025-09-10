# ADR-003: Estrategia de Reducción de Complejidad Ciclomática

**Fecha**: 2025-01-03  
**Estado**: Propuesto  
**Deciders**: Tech Lead, Domain Experts, QA Lead  
**Tags**: `code-quality`, `ddd`, `complexity`, `maintainability`

## Contexto y Problema

El análisis de complejidad ciclomática revela hotspots críticos:

| Capa DDD        | Complejidad Promedio | Target | Gap  |
| --------------- | -------------------- | ------ | ---- |
| Domain Entities | 8.2                  | 5      | -3.2 |
| Use Cases       | 12.5                 | 8      | -4.5 |
| Handlers        | 9.7                  | 5      | -4.7 |
| Repositories    | 7.3                  | 5      | -2.3 |

Impactos identificados:

- **Bugs**: Funciones con complejidad > 10 tienen 50% más bugs
- **Testing**: Cobertura difícil en funciones complejas
- **Onboarding**: Nuevos devs tardan más en entender el código
- **Mantenimiento**: Cambios tienen efectos secundarios no previstos

## Decisión

Implementaremos un programa de reducción de complejidad basado en:

### 1. Establecimiento de Límites por Capa


```typescript
// .eslintrc.js
module.exports = {
  rules: {
    complexity: [
      'error',
      {
        max: 5, // Default
      },
    ],
    overrides: [
      {
        files: ['**/domain/entities/**/*.ts'],
        rules: { complexity: ['error', 5] },
      },
      {
        files: ['**/domain/value-objects/**/*.ts'],
        rules: { complexity: ['error', 3] },
      },
      {
        files: ['**/application/use-cases/**/*.ts'],
        rules: { complexity: ['error', 8] },
      },
      {
        files: ['**/application/handlers/**/*.ts'],
        rules: { complexity: ['error', 5] },
      },
    ],
  },
};

```


### 2. Patrones de Refactoring por Tipo

#### Para Domain Entities (Target: 5)


```typescript
// ANTES: Complejidad 12
class Order {
  validate(): boolean {
    if (!this.id) return false;
    if (!this.customerId) return false;
    if (!this.items || this.items.length === 0) return false;
    if (this.status === 'draft' && this.paymentMethod) return false;
    if (this.status === 'paid' && !this.paymentMethod) return false;
    // ... más validaciones
  }
}

// DESPUÉS: Complejidad 3
class Order {
  validate(): boolean {
    return this.validateBasicFields() && this.validateItems() && this.validateStatusConsistency();
  }

  private validateBasicFields(): boolean {
    return !!this.id && !!this.customerId;
  }

  private validateItems(): boolean {
    return this.items?.length > 0;
  }

  private validateStatusConsistency(): boolean {
    const rules = this.getValidationRules();
    return rules[this.status]?.(this) ?? true;
  }
}

```


#### Para Use Cases (Target: 8)


```typescript
// ANTES: Complejidad 15
class CreateOrderUseCase {
  async execute(dto: CreateOrderDto): Promise<Order> {
    // Múltiples if anidados, switch cases, etc.
  }
}

// DESPUÉS: Complejidad 6
class CreateOrderUseCase {
  async execute(dto: CreateOrderDto): Promise<Order> {
    const validationResult = await this.validator.validate(dto);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors);
    }

    const order = this.orderFactory.create(dto);
    const pricedOrder = await this.pricingService.calculate(order);
    const savedOrder = await this.repository.save(pricedOrder);

    await this.eventBus.publish(new OrderCreatedEvent(savedOrder));

    return savedOrder;
  }
}

```


#### Para Handlers (Target: 5)


```typescript
// DESPUÉS: Handler simple que delega
class OrderHandler {
  @Post('/orders')
  async createOrder(@Body() dto: CreateOrderDto) {
    const result = await this.createOrderUseCase.execute(dto);
    return this.presenter.toResponse(result);
  }
}

```


### 3. Técnicas de Reducción

1. **Early Returns / Guard Clauses**
2. **Extract Method**
3. **Replace Conditional with Polymorphism**
4. **Strategy Pattern para lógica compleja**
5. **Chain of Responsibility para validaciones**
6. **Specification Pattern para reglas de negocio**

## Drivers de la Decisión

- **Calidad**: Reducir bugs en 30%
- **Mantenibilidad**: Facilitar cambios futuros
- **Testing**: Alcanzar 90% coverage
- **DDD Purity**: Mantener capas con responsabilidades claras

## Opciones Consideradas

### Opción 1: Refactor Manual Completo

- ❌ Tiempo excesivo (6+ meses)
- ❌ Alto riesgo de regresión
- ✅ Máximo control

### Opción 2: Herramientas Automatizadas

- ❌ Pueden romper lógica de negocio
- ❌ No entienden contexto DDD
- ✅ Rápido

### Opción 3: Refactor Incremental Guiado (SELECCIONADA)

- ✅ Riesgo controlado
- ✅ Aprendizaje continuo
- ✅ Métricas de progreso claras
- ✅ Se integra con desarrollo normal

## Consecuencias

### Positivas

- Código más legible y mantenible
- Reducción estimada 30% en bugs
- Tests más simples y rápidos
- Onboarding más eficiente

### Negativas

- Inversión inicial de tiempo
- Posibles conflictos con features en desarrollo
- Curva de aprendizaje para patterns

### Plan de Ataque por Prioridad


```typescript
// scripts/complexity-priorities.ts
export const REFACTOR_PRIORITIES = [
  {
    priority: 1,
    criteria: 'complexity > 20',
    action: 'Refactor inmediato',
    technique: 'Extract Use Cases',
  },
  {
    priority: 2,
    criteria: 'complexity > 15 && changes > 10',
    action: 'Refactor en próximo sprint',
    technique: 'Strategy Pattern',
  },
  {
    priority: 3,
    criteria: 'complexity > 10',
    action: 'Refactor oportunista',
    technique: 'Extract Methods',
  },
];

```


## Métricas de Éxito

- **Complejidad Promedio Global**: < 5
- **Funciones > 10 complejidad**: < 5%
- **Coverage en refactored code**: > 90%
- **Bugs post-refactor**: -30%

## Recursos y Herramientas


```bash
# Herramientas de análisis
npm install -D \
  eslint-plugin-complexity \
  complexity-report \
  jscomplexity \
  plato

# Scripts de monitoreo
"scripts": {
  "complexity:check": "eslint . --rule 'complexity: [error, 10]'",
  "complexity:report": "cr --format json --output reports/complexity.json src/",
  "complexity:visualize": "plato -r -d reports/complexity-visual src/"
}

```


## Timeline

- **Semana 1-2**: Refactor funciones críticas (complexity > 20)
- **Semana 3-4**: Refactor hotspots (high complexity + high churn)
- **Semana 5-6**: Establecer gates en CI/CD
- **Ongoing**: Refactor oportunista durante desarrollo normal

## Referencias

- [Cyclomatic Complexity](https://www.mccabe.com/pdf/mccabe-nist235r.pdf)
- [DDD Refactoring Patterns](https://www.dddcommunity.org/library/vernon_2011/)
- [Working Effectively with Legacy Code](https://www.goodreads.com/book/show/44919.Working_Effectively_with_Legacy_Code)
