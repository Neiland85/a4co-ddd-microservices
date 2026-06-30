<!-- markdownlint-disable MD013 -->

# A4CO Non-Canonical npm Lockfile Removal

Date: 2026-06-30

Branch: `security/remove-noncanonical-npm-lockfiles`

## Objective

Remove npm `package-lock.json` files that are not authoritative for the buyer-ready baseline.

This PR does not upgrade dependencies.

This PR does not remove nested pnpm lockfiles.

## Dependency authority

The buyer-ready baseline uses the root pnpm workspace install:

- `pnpm install --frozen-lockfile`

The canonical buyer-baseline lockfile is:

- root `pnpm-lock.yaml`

## Removed npm lockfiles

The following npm lockfiles were classified as non-canonical and removed:

- `package-lock.json`
- `apps/infrastructure/gateway/package-lock.json`
- `packages/shared-utils/package-lock.json`
- `packages/copilot-dashboard/package-lock.json`
- `packages/design-system/f-modern-backoffice/package-lock.json`

## Reason

These files inflate Dependabot findings but are not the dependency authority for the current buyer-ready runtime.

The buyer-ready path is governed by the root pnpm install, CI, Docker and buyer validation scripts.

## Validation gate

Required validation:

- `pnpm install --frozen-lockfile`
- `pnpm run check:fast`
- `pnpm run test:preview`
- `pnpm run build:preview`

Runtime validation when Docker is available:

- `pnpm run buyer:validate`

## Non-goals

This PR does not remove nested `pnpm-lock.yaml` files.

This PR does not remediate all Dependabot alerts.

This PR does not upgrade dependency versions.

This PR only removes npm lockfiles that are not canonical for the buyer-ready baseline.
