<!-- markdownlint-disable MD013 -->

# A4CO Canonical Lockfile Classification

Date: 2026-06-30

Branch: `security/canonical-lockfile-classification`

## Objective

Classify which lockfiles are authoritative for the buyer-ready baseline and which lockfiles are non-canonical, stale, duplicated or out of buyer scope.

This PR does not remove lockfiles and does not change dependency versions.

## Evidence inspected

The repository was inspected for lockfiles using:

- `find . -name 'pnpm-lock.yaml' -o -name 'package-lock.json' -o -name 'yarn.lock' | sort`

Repository documentation, CI, Docker and scripts were inspected for package-manager usage using:

- `grep -R "pnpm-lock.yaml|package-lock.json|npm install|pnpm install" README.md docs .github Dockerfile.beta docker-compose.beta.yml scripts package.json`

## Buyer-ready package manager authority

The buyer-ready baseline is currently governed by the root pnpm workspace install.

Canonical install command:

- `pnpm install --frozen-lockfile`

This command appears in the buyer-relevant execution path:

- `README.md`
- `.github/workflows/beta-runtime.yml`
- `.github/workflows/ci.yml`
- `.github/actions/setup-monorepo/action.yml`
- `Dockerfile.beta`
- root `package.json` CI scripts

## Canonical lockfile

| Lockfile | Classification | Rationale |
| --- | --- | --- |
| `pnpm-lock.yaml` | Canonical | Root pnpm lockfile used by root workspace install, CI, Docker and buyer validation path. |

## Non-canonical npm lockfiles

| Lockfile | Classification | Rationale |
| --- | --- | --- |
| `package-lock.json` | Non-canonical/root npm lock | Buyer-ready baseline uses pnpm, not npm. Candidate for removal after validation. |
| `apps/infrastructure/gateway/package-lock.json` | Non-canonical buyer-path npm lock | Gateway is in buyer scope, but buyer install is root pnpm. Candidate for removal after validation. |
| `packages/copilot-dashboard/package-lock.json` | Non-canonical package npm lock | Not part of buyer runtime baseline. Candidate for separate cleanup. |
| `packages/design-system/f-modern-backoffice/package-lock.json` | Non-canonical design-system npm lock | Design-system/frontoffice scope, not buyer runtime. Candidate for separate cleanup. |
| `packages/shared-utils/package-lock.json` | Non-canonical package npm lock | Shared-utils is in buyer build path, but dependency authority is root pnpm. Candidate for removal after validation. |

## Nested pnpm lockfiles in buyer paths

| Lockfile | Classification | Rationale |
| --- | --- | --- |
| `apps/infrastructure/gateway/pnpm-lock.yaml` | Non-canonical buyer-path pnpm lock | Buyer runtime builds from root workspace and root `pnpm-lock.yaml`. Candidate for removal after validation. |
| `apps/services/order-service/pnpm-lock.yaml` | Non-canonical buyer-path pnpm lock | Buyer runtime builds from root workspace and root `pnpm-lock.yaml`. Candidate for removal after validation. |
| `apps/services/inventory-service/pnpm-lock.yaml` | Non-canonical buyer-path pnpm lock | Buyer runtime builds from root workspace and root `pnpm-lock.yaml`. Candidate for removal after validation. |

## Nested pnpm lockfiles outside buyer runtime

| Lockfile | Classification | Rationale |
| --- | --- | --- |
| `apps/dashboard-client/pnpm-lock.yaml` | Non-core frontend lockfile | Frontend/dashboard scope, outside current buyer runtime. |
| `apps/frontend/pnpm-lock.yaml` | Non-core frontend lockfile | Frontend scope, outside current buyer runtime. |
| `apps/infrastructure/notification-service/pnpm-lock.yaml` | Non-buyer infrastructure lockfile | Not part of current buyer runtime baseline. |
| `apps/services/auth-service/pnpm-lock.yaml` | Legacy or partial service lockfile | Not part of current buyer runtime baseline. |
| `apps/services/payment-service/pnpm-lock.yaml` | Legacy or partial service lockfile | Not part of current buyer runtime baseline. |
| `apps/services/user-service/pnpm-lock.yaml` | Legacy or partial service lockfile | Not part of current buyer runtime baseline. |

## Ignored local artifacts

The `find` command may show lockfiles under `node_modules`.

These are ignored dependency artifacts and are not repository remediation targets:

- `node_modules/.pnpm/combined-stream@1.0.8/node_modules/combined-stream/yarn.lock`
- `node_modules/.pnpm/uri-js@4.4.1/node_modules/uri-js/yarn.lock`

## Classification decision

At this stage, the only canonical lockfile for the buyer-ready baseline is:

- root `pnpm-lock.yaml`

All other lockfiles should be treated as one of:

- non-canonical npm lockfiles;
- nested pnpm lockfiles;
- non-core frontend/design-system lockfiles;
- legacy service lockfiles;
- ignored local dependency artifacts.

## Recommended cleanup order

Do not remove all lockfiles in one PR.

Recommended next PR:

`security: remove non-canonical npm lockfiles`

Candidate files for the first cleanup batch:

- `package-lock.json`
- `apps/infrastructure/gateway/package-lock.json`
- `packages/shared-utils/package-lock.json`
- `packages/copilot-dashboard/package-lock.json`
- `packages/design-system/f-modern-backoffice/package-lock.json`

Validation gate:

- `pnpm install --frozen-lockfile`
- `pnpm run buyer:check`
- `pnpm run test:preview`
- `pnpm run build:preview`

Runtime gate when Docker is available:

- `pnpm run buyer:validate`

## Second cleanup batch

After npm lockfile removal is validated, evaluate nested pnpm lockfile removal in a separate PR.

Candidate buyer-path nested pnpm lockfiles:

- `apps/infrastructure/gateway/pnpm-lock.yaml`
- `apps/services/order-service/pnpm-lock.yaml`
- `apps/services/inventory-service/pnpm-lock.yaml`

Candidate non-buyer nested pnpm lockfiles:

- `apps/dashboard-client/pnpm-lock.yaml`
- `apps/frontend/pnpm-lock.yaml`
- `apps/infrastructure/notification-service/pnpm-lock.yaml`
- `apps/services/auth-service/pnpm-lock.yaml`
- `apps/services/payment-service/pnpm-lock.yaml`
- `apps/services/user-service/pnpm-lock.yaml`

## Non-goals

This classification does not remediate vulnerabilities.

This classification does not upgrade dependencies.

This classification does not remove lockfiles.

This classification defines the dependency-authority model before cleanup begins.
