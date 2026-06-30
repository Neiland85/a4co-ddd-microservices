<!-- markdownlint-disable MD013 -->

# A4CO Buyer-Baseline Dependabot Alert Map

Date: 2026-06-30

Branch: `security/buyer-baseline-alerts-map`

Source JSON: ignored local file `dependabot-alerts-20260630-042559.json`

## Objective

Map Dependabot alerts that affect the current buyer-ready baseline before applying dependency upgrades.

This document does not remediate dependencies. It defines the remediation scope.

## Buyer baseline considered

- root `pnpm-lock.yaml`
- root `package.json`
- `apps/infrastructure/gateway`
- `apps/services/order-service`
- `apps/services/inventory-service`
- `packages/shared-utils`
- `packages/shared-events`
- `packages/observability`
- `packages/domain`

## Classification summary

| Classification | Count |
| --- | ---: |
| legacy-or-partial-service | 900 |
| buyer-baseline/path | 633 |
| non-core/frontend-design | 514 |
| buyer-baseline/root | 210 |
| root/non-canonical-lock | 102 |
| buyer-path/non-canonical-lock | 86 |
| out-of-baseline | 28 |

## Buyer-baseline alerts by severity

| Severity | Count |
| --- | ---: |
| critical | 20 |
| high | 450 |
| medium | 383 |
| low | 76 |

## Buyer-baseline manifests by alert count

| Count | Manifest |
| ---: | --- |
| 209 | `pnpm-lock.yaml` |
| 208 | `apps/services/order-service/pnpm-lock.yaml` |
| 208 | `apps/services/inventory-service/pnpm-lock.yaml` |
| 208 | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 76 | `apps/infrastructure/gateway/package-lock.json` |
| 10 | `packages/shared-utils/package-lock.json` |
| 5 | `packages/observability/package.json` |
| 1 | `apps/services/order-service/package.json` |
| 1 | `apps/services/inventory-service/package.json` |
| 1 | `packages/domain/package.json` |
| 1 | `packages/shared-events/package.json` |
| 1 | `package.json` |

## Top buyer-baseline vulnerable packages

| Count | Ecosystem | Package | Severity |
| ---: | --- | --- | --- |
| 53 | npm | `axios` | high |
| 52 | npm | `axios` | medium |
| 45 | npm | `minimatch` | high |
| 44 | npm | `next` | medium |
| 41 | npm | `pnpm` | medium |
| 41 | npm | `next` | high |
| 36 | npm | `pnpm` | high |
| 20 | npm | `multer` | high |
| 20 | npm | `handlebars` | high |
| 19 | npm | `vite` | high |
| 19 | npm | `protobufjs` | medium |
| 19 | npm | `protobufjs` | high |
| 18 | npm | `node-forge` | high |
| 18 | npm | `tar` | high |
| 17 | npm | `hono` | medium |
| 16 | npm | `vite` | medium |
| 14 | npm | `uuid` | medium |
| 13 | npm | `js-yaml` | medium |
| 12 | npm | `@grpc/grpc-js` | high |
| 12 | npm | `lodash` | medium |
| 12 | npm | `file-type` | medium |
| 11 | npm | `next` | low |
| 10 | npm | `qs` | medium |
| 10 | npm | `fast-uri` | high |
| 10 | npm | `picomatch` | medium |
| 10 | npm | `picomatch` | high |
| 10 | npm | `handlebars` | medium |
| 10 | npm | `ajv` | medium |
| 10 | npm | `webpack` | low |
| 9 | npm | `form-data` | high |
| 9 | npm | `path-to-regexp` | high |
| 8 | npm | `markdown-it` | medium |
| 8 | npm | `fast-xml-parser` | medium |
| 8 | npm | `brace-expansion` | medium |
| 8 | npm | `fast-xml-parser` | high |
| 8 | npm | `flatted` | high |
| 8 | npm | `storybook` | high |
| 8 | npm | `jws` | high |
| 7 | npm | `@nestjs/core` | medium |
| 6 | npm | `lodash` | high |
| 6 | npm | `path-to-regexp` | medium |
| 6 | npm | `bn.js` | medium |
| 5 | npm | `@babel/core` | low |
| 5 | npm | `multer` | medium |
| 5 | npm | `serialize-javascript` | medium |
| 5 | npm | `@opentelemetry/sdk-node` | high |
| 5 | npm | `@opentelemetry/auto-instrumentations-node` | high |
| 5 | npm | `@opentelemetry/exporter-prometheus` | high |
| 5 | npm | `axios` | low |
| 5 | npm | `follow-redirects` | medium |
| 5 | npm | `handlebars` | low |
| 5 | npm | `handlebars` | critical |
| 5 | npm | `yaml` | medium |
| 5 | npm | `serialize-javascript` | high |
| 5 | npm | `qs` | low |
| 5 | npm | `@isaacs/brace-expansion` | high |
| 5 | npm | `diff` | low |
| 5 | npm | `glob` | high |
| 5 | npm | `@sentry/node` | low |
| 4 | npm | `linkify-it` | high |

## Critical/high buyer-baseline package locations

| Count | Severity | Package | Manifest |
| ---: | --- | --- | --- |
| 12 | high | `axios` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 12 | high | `axios` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 12 | high | `axios` | `apps/services/order-service/pnpm-lock.yaml` |
| 12 | high | `axios` | `apps/infrastructure/gateway/package-lock.json` |
| 12 | high | `minimatch` | `pnpm-lock.yaml` |
| 11 | high | `pnpm` | `apps/services/order-service/pnpm-lock.yaml` |
| 11 | high | `pnpm` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 11 | high | `pnpm` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 11 | high | `next` | `pnpm-lock.yaml` |
| 10 | high | `next` | `apps/services/order-service/pnpm-lock.yaml` |
| 10 | high | `next` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 10 | high | `next` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 9 | high | `minimatch` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 9 | high | `minimatch` | `apps/services/order-service/pnpm-lock.yaml` |
| 9 | high | `minimatch` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 6 | high | `node-forge` | `pnpm-lock.yaml` |
| 6 | high | `tar` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 6 | high | `tar` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 6 | high | `tar` | `apps/services/order-service/pnpm-lock.yaml` |
| 6 | high | `minimatch` | `apps/infrastructure/gateway/package-lock.json` |
| 5 | high | `vite` | `apps/services/order-service/pnpm-lock.yaml` |
| 5 | high | `vite` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 5 | high | `vite` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 5 | high | `protobufjs` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 5 | high | `protobufjs` | `apps/services/order-service/pnpm-lock.yaml` |
| 5 | high | `protobufjs` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 5 | high | `axios` | `pnpm-lock.yaml` |
| 4 | high | `vite` | `pnpm-lock.yaml` |
| 4 | high | `multer` | `pnpm-lock.yaml` |
| 4 | high | `multer` | `apps/services/order-service/pnpm-lock.yaml` |
| 4 | high | `multer` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 4 | high | `multer` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 4 | high | `multer` | `apps/infrastructure/gateway/package-lock.json` |
| 4 | high | `@grpc/grpc-js` | `apps/services/order-service/pnpm-lock.yaml` |
| 4 | high | `@grpc/grpc-js` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 4 | high | `@grpc/grpc-js` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 4 | high | `protobufjs` | `pnpm-lock.yaml` |
| 4 | high | `node-forge` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 4 | high | `node-forge` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 4 | high | `node-forge` | `apps/services/order-service/pnpm-lock.yaml` |
| 4 | high | `handlebars` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 4 | high | `handlebars` | `apps/services/order-service/pnpm-lock.yaml` |
| 4 | high | `handlebars` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 4 | high | `handlebars` | `apps/infrastructure/gateway/package-lock.json` |
| 4 | high | `handlebars` | `pnpm-lock.yaml` |
| 3 | high | `undici` | `pnpm-lock.yaml` |
| 3 | high | `pnpm` | `pnpm-lock.yaml` |
| 2 | high | `form-data` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `form-data` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `form-data` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `form-data` | `pnpm-lock.yaml` |
| 2 | high | `fast-uri` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `fast-uri` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `fast-uri` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `fast-uri` | `apps/infrastructure/gateway/package-lock.json` |
| 2 | high | `fast-uri` | `pnpm-lock.yaml` |
| 2 | high | `picomatch` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `picomatch` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `picomatch` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `picomatch` | `apps/infrastructure/gateway/package-lock.json` |
| 2 | high | `picomatch` | `pnpm-lock.yaml` |
| 2 | high | `path-to-regexp` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `path-to-regexp` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `path-to-regexp` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `fast-xml-parser` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `fast-xml-parser` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `fast-xml-parser` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `fast-xml-parser` | `pnpm-lock.yaml` |
| 2 | high | `flatted` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `flatted` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `flatted` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `flatted` | `pnpm-lock.yaml` |
| 2 | high | `storybook` | `pnpm-lock.yaml` |
| 2 | high | `storybook` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `storybook` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `storybook` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `jws` | `apps/services/order-service/pnpm-lock.yaml` |
| 2 | high | `jws` | `apps/services/inventory-service/pnpm-lock.yaml` |
| 2 | high | `jws` | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 2 | high | `jws` | `pnpm-lock.yaml` |

## Remediation order

1. Start with root `pnpm-lock.yaml` and buyer runtime packages.
2. Separate non-canonical `package-lock.json` alerts from the pnpm buyer baseline.
3. Avoid major dependency upgrades unless required by a critical buyer-baseline alert.
4. After each dependency change, run `pnpm install --frozen-lockfile`.
5. Validate with `pnpm run buyer:check`.
6. Validate runtime with `pnpm run buyer:validate` when Docker is available.

## Non-goal

This map does not claim that all repository-wide Dependabot alerts are buyer-baseline blockers.
Frontend, design-system, duplicated service paths, legacy services and experimental areas require separate remediation branches.
