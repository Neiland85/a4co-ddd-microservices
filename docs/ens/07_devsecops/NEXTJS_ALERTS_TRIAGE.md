# Triage de alertas Next.js / Dependabot

## Alerta

Dependabot reporta alertas de Next.js asociadas a SSRF mediante WebSocket upgrades.

Referencia técnica:

- GHSA-c4j6-fc7j-m34r
- CVE-2026-44578
- Severidad: High
- Paquete: `next`

## Riesgo

El riesgo aplica especialmente a aplicaciones Next.js self-hosted usando el servidor Node.js integrado y expuestas a tráfico no confiable.

## Versiones afectadas

- `>=13.4.13 <15.5.16`
- `>=16.0.0 <16.2.5`

## Versiones parcheadas

- `15.5.16`
- `16.2.5`

## Criterio de clasificación

1. Identificar qué `package.json` declara `next`.
2. Identificar qué lockfiles contienen `next`.
3. Separar:
   - aplicaciones Next reales;
   - paquetes demo/design-system;
   - lockfiles obsoletos;
   - servicios backend que no deberían tener Next;
   - dependencias de test/dev.
4. No borrar lockfiles ni actualizar Next sin confirmar el uso real.

## Acciones posibles

- Actualizar Next en aplicaciones reales.
- Eliminar lockfiles obsoletos si no forman parte del workspace activo.
- Documentar excepción temporal si no hay exposición runtime.
- Bloquear WebSocket upgrades en proxy/load balancer si no son necesarios.
- Evitar exposición directa del origin server a redes no confiables.
