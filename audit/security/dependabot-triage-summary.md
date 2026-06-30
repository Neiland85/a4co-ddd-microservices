<!-- markdownlint-disable MD013 -->

# A4CO Dependabot Triage — Buyer-Ready Baseline

Date: 2026-06-30  
Branch: `security/dependabot-triage-buyer-ready`

## Objective

Classify Dependabot alerts by relevance to the current buyer-ready baseline.

This is not a mass dependency-upgrade PR. The goal is to distinguish:

- buyer-baseline risk;
- non-core workspace risk;
- frontend/design-system risk;
- legacy/experimental risk;
- transitive/noise alerts.

## Buyer baseline scope

The current buyer baseline is:

- `apps/infrastructure/gateway`
- `apps/services/order-service`
- `apps/services/inventory-service`
- `packages/shared-utils`
- `packages/shared-events`
- `packages/observability`
- `packages/domain/order`
- `packages/domain/inventory`
- `Dockerfile.beta`
- `docker-compose.beta.yml`
- root workspace scripts used by `buyer:check`, `buyer:validate`, and CI

## Initial position

Dependabot reports a large number of alerts on the default branch. These alerts must not be interpreted as a single production-blocking finding without path and runtime classification.

## Triage rules

1. Alerts affecting the buyer runtime/build path are priority.
2. Alerts in excluded skeleton services are not buyer-baseline blockers.
3. Alerts in frontend/design-system packages are separated unless used by buyer validation.
4. Alerts in legacy/experimental services are documented, not mixed into the buyer baseline.
5. No dependency upgrades are applied without build/test validation.
6. Major upgrades are deferred unless necessary for a critical buyer-baseline vulnerability.

## Commands used

```bash
gh api repos/Neiland85/a4co-ddd-microservices/dependabot/alerts --paginate \
  > audit/security/dependabot-alerts-YYYYMMDD-HHMMSS.json
## Alerts by severity

| Severity | Count |
| --- | ---: |
| critical | 69 |
| high | 1132 |
| low | 207 |
| medium | 927 |

## Top manifests by alert count

| Count | Manifest |
| ---: | --- |
| 208 | `apps/dashboard-client/pnpm-lock.yaml` |
| 208 | `apps/frontend/pnpm-lock.yaml` |
| 208 | `apps/infrastructure/gateway/pnpm-lock.yaml` |
| 204 | `pnpm-lock.yaml` |
| 189 | `apps/infrastructure/notification-service/pnpm-lock.yaml` |
| 189 | `apps/services/auth-service/pnpm-lock.yaml` |
| 189 | `apps/services/inventory-service/pnpm-lock.yaml` |
| 189 | `apps/services/order-service/pnpm-lock.yaml` |
| 189 | `apps/services/payment-service/pnpm-lock.yaml` |
| 189 | `apps/services/user-service/pnpm-lock.yaml` |
| 84 | `package-lock.json` |
| 76 | `apps/infrastructure/gateway/package-lock.json` |
| 45 | `packages/design-system/f-modern-backoffice/package-lock.json` |
| 15 | `apps/web/v0dev/a-head/package.json` |
| 15 | `apps/web/v0dev/g-banner-cookie/package.json` |
| 11 | `apps/auth-service/pnpm-lock.yaml` |
| 11 | `apps/gateway/pnpm-lock.yaml` |
| 11 | `apps/inventory-service/pnpm-lock.yaml` |
| 11 | `apps/notification-service/pnpm-lock.yaml` |
| 11 | `apps/order-service/pnpm-lock.yaml` |
| 11 | `apps/payment-service/pnpm-lock.yaml` |
| 11 | `apps/user-service/pnpm-lock.yaml` |
| 9 | `apps/transportista-service/pnpm-lock.yaml` |
| 9 | `packages/shared-utils/package-lock.json` |
| 6 | `apps/web/v0dev/e-gamified-dashboard/package.json` |
| 5 | `packages/observability/package.json` |
| 4 | `apps/web/v0dev/g-banner-cookie/package-lock.json` |
| 3 | `apps/dashboard-web/package.json` |
| 3 | `apps/web/v0dev/b-business-registration/package.json` |
| 3 | `apps/web/v0dev/d-user-registration/package.json` |
| 3 | `processor/Cargo.lock` |
| 2 | `apps/dashboard-client/package.json` |
| 2 | `apps/gateway/package-lock.json` |
| 2 | `apps/transportista-service/requirements.txt` |
| 1 | `apps/services/inventory-service/package.json` |
| 1 | `apps/services/legal-evidence-service/package.json` |
| 1 | `apps/services/order-service/package.json` |
| 1 | `apps/transportista-service/package.json` |
| 1 | `apps/web/v0dev/a-head/package-lock.json` |
| 1 | `apps/web/v0dev/e-gamified-dashboard/package-lock.json` |
| 1 | `backend/package.json` |
| 1 | `package.json` |
| 1 | `packages/domain/package.json` |
| 1 | `packages/shared-events/package.json` |

## Top vulnerable packages

| Count | Ecosystem | Package |
| ---: | --- | --- |
| 320 | npm | `next` |
| 278 | npm | `axios` |
| 133 | npm | `pnpm` |
| 110 | npm | `minimatch` |
| 108 | npm | `protobufjs` |
| 88 | npm | `handlebars` |
| 83 | npm | `vite` |
| 70 | npm | `tar` |
| 60 | npm | `fast-xml-parser` |
| 55 | npm | `multer` |
| 48 | npm | `picomatch` |
| 44 | npm | `qs` |
| 43 | npm | `lodash` |
| 43 | npm | `node-forge` |
| 36 | npm | `@grpc/grpc-js` |
| 36 | npm | `jws` |
| 35 | npm | `path-to-regexp` |
| 29 | npm | `tmp` |
| 28 | npm | `uuid` |
| 27 | npm | `storybook` |
| 26 | npm | `file-type` |
| 23 | npm | `ajv` |
| 22 | npm | `brace-expansion` |
| 22 | npm | `fast-uri` |
| 22 | npm | `flatted` |
| 22 | npm | `form-data` |
| 22 | npm | `markdown-it` |
| 22 | npm | `serialize-javascript` |
| 22 | npm | `webpack` |
| 22 | npm | `ws` |
| 20 | npm | `hono` |
| 20 | npm | `turbo` |
| 19 | npm | `@sentry/node` |
| 19 | npm | `esbuild` |
| 19 | npm | `glob` |
| 18 | npm | `bn.js` |
| 18 | npm | `next-auth` |
| 17 | npm | `dompurify` |
| 15 | npm | `@nestjs/core` |
| 13 | npm | `postcss` |
| 12 | npm | `@isaacs/brace-expansion` |
| 12 | npm | `diff` |
| 12 | npm | `follow-redirects` |
| 12 | npm | `yaml` |
| 11 | npm | `@babel/core` |
| 11 | npm | `@opentelemetry/auto-instrumentations-node` |
| 11 | npm | `@opentelemetry/core` |
| 11 | npm | `@opentelemetry/exporter-prometheus` |
| 11 | npm | `@opentelemetry/sdk-node` |
| 11 | npm | `defu` |
| 11 | npm | `effect` |
| 11 | npm | `koa` |
| 11 | npm | `smol-toml` |
| 10 | npm | `@nestjs/microservices` |
| 10 | npm | `@protobufjs/utf8` |
| 10 | npm | `@tootallnate/once` |
| 10 | npm | `js-yaml` |
| 10 | npm | `rollup` |
| 9 | npm | `@babel/plugin-transform-modules-systemjs` |
| 9 | npm | `elliptic` |
| 9 | npm | `undici` |
| 9 | npm | `vitest` |
| 6 | npm | `nodemailer` |
| 4 | npm | `http-proxy-middleware` |
| 3 | npm | `linkify-it` |
| 2 | npm | `@hono/node-server` |
| 2 | npm | `body-parser` |
| 2 | pip | `python-multipart` |
| 1 | npm | `braces` |
| 1 | rust | `bytes` |
| 1 | npm | `micromatch` |
| 1 | rust | `rand` |
| 1 | rust | `rsa` |
| 1 | npm | `tar-fs` |

## Executive conclusion

The large alert count is concentrated across multiple historical lockfiles, frontend workspaces, duplicated service locations and non-buyer-baseline manifests.

The buyer-ready baseline should not be blocked by the raw global alert count alone. The next remediation phase should prioritize manifests used by:

- root `pnpm-lock.yaml`
- `apps/infrastructure/gateway`
- `apps/services/order-service`
- `apps/services/inventory-service`
- `packages/shared-events`
- `packages/shared-utils`
- `packages/observability`
- `packages/domain/order`
- `packages/domain/inventory`

Non-core frontend, design-system, legacy and duplicated service manifests should be handled in separate cleanup or archival phases.
