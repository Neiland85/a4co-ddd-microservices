# Compliance y Protección de Datos (enfoque ICANN)

Este directorio centraliza la documentación formal de cumplimiento (GDPR/LOPDGDD) y la Evaluación de Impacto en la Protección de Datos (DPIA) del programa A4CO. Su propósito es ofrecer trazabilidad directa entre obligaciones legales y los bloques de código que las soportan, con foco en seguridad, trazabilidad operativa y tratamiento de datos personales.

## Estructura

- [`DPIA-GDPR-LOPDGDD.md`](./DPIA-GDPR-LOPDGDD.md): DPIA completa, matriz de cumplimiento por artículo y referencias a código fuente.

## Alcance y principios

- La documentación de cumplimiento se mantiene en español para alinearse con las regulaciones aplicables (UE/ES) y con el resto de guías internas del proyecto.

- Cobertura de todos los servicios de la monorepo (`apps/*`) y librerías compartidas (`packages/*`, `libs/*`) donde se manejan datos personales o datos de trazabilidad.
- Alineación con GDPR (art. 5, 6, 25, 30, 32, 33/34) y LOPDGDD para mercados UE/ES.
- Evidencias técnicas basadas en código versionado para auditorías internas/externas (ICANN-level readiness).

## Cómo usar este directorio

1) Revisar la matriz en `DPIA-GDPR-LOPDGDD.md` antes de desplegar o modificar flujos de datos.
2) Cuando se altere un flujo de datos (nuevo endpoint, cambio de modelo), actualizar la sección correspondiente y añadir la nueva referencia de código.
3) Incorporar pruebas o verificaciones de seguridad asociadas (por ejemplo, middleware de autenticación o trazas) al mismo tiempo que el cambio funcional.
