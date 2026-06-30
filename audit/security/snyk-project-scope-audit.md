<!-- markdownlint-disable MD013 -->

# A4CO Snyk Project Scope Audit

Date: 2026-06-30

Branch: `security/snyk-project-scope-audit`

## Objective

Document why npm `package-lock.json` removal is blocked by the current Snyk PR-check model.

This PR does not remove lockfiles.

This PR does not upgrade dependencies.

This PR does not change Snyk policy.

## Context

The buyer-ready baseline uses pnpm as the dependency authority:

- root `pnpm-lock.yaml`
- `pnpm install --frozen-lockfile`
- CI and Docker buyer validation using pnpm

A previous cleanup branch attempted to remove non-canonical npm `package-lock.json` files.

Local validation passed:

- `pnpm install --frozen-lockfile`
- `pnpm run check:fast`
- `pnpm run test:preview`
- `pnpm run build:preview`

However, the Snyk PR check failed.

## Snyk failure mode observed

Snyk reported errored projects with messages equivalent to:

- `Failed to read manifest`

Affected examples included package manifests such as:

- `backend/package.json`
- `packages/domain/package.json`
- `packages/outbox-publisher/package.json`
- `packages/shared-utils/package.json`
- `packages/shared-events/package.json`
- `packages/observability/package.json`
- `packages/domain/inventory/package.json`
- `packages/domain/order/package.json`
- `libs/shared-events/package.json`
- `packages/design-system/package.json`
- `libs/config/package.json`
- `packages/copilot-dashboard/package.json`
- `apps/package.json`
- `packages/domain/payment/package.json`
- `src/generated/prisma/package.json`
- `apps/services/product-service/package.json`
- `apps/infrastructure/gateway/package.json`
- `apps/transportista-service/package.json`

The failure was not a buyer-runtime build failure.

The failure was a Snyk project-resolution failure.

## Interpretation

The repository currently has two overlapping dependency models:

1. pnpm workspace authority used by buyer runtime and CI;
2. Snyk-monitored npm/package manifests that may expect npm lockfiles or per-project resolution.

Because of this, deleting npm lockfiles without first updating Snyk project scope causes the security gate to fail.

## Decision

Do not remove `package-lock.json` files until Snyk project scope is audited and aligned.

The lockfile cleanup remains conceptually valid for the pnpm buyer baseline, but it must not be merged while Snyk treats those manifests as required npm projects.

## Recommended next steps

1. Inspect GitHub Actions for Snyk configuration.
2. Inspect `.snyk`, Snyk UI project list and monitored package managers.
3. Decide whether Snyk should monitor:
   - root pnpm workspace only;
   - selected buyer-runtime package manifests;
   - all package manifests;
   - legacy/frontend manifests separately.
4. Only after Snyk scope is explicit, re-open lockfile cleanup in a new PR.
5. Avoid using `Mark as successful in SCM` as a normal workflow.

## Non-goals

This PR does not silence Snyk.

This PR does not bypass Snyk.

This PR does not claim vulnerabilities are resolved.

This PR documents why lockfile removal must be sequenced after Snyk scope alignment.
