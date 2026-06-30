<!-- markdownlint-disable MD013 -->

# A4CO Buyer-Baseline Security Remediation Plan

Date: 2026-06-30

Branch: `security/buyer-baseline-remediation-plan`

## Objective

Define a safe remediation plan for Dependabot alerts that affect the buyer-ready baseline.

This PR does not change dependencies. It defines the execution order, validation gates and risk boundaries before remediation begins.

## Current source documents

- `audit/security/dependabot-triage-summary.md`
- `audit/security/buyer-baseline-alerts-map.md`

## Current buyer-baseline alert picture

The buyer-baseline map identifies 929 alerts classified as buyer-baseline related:

- 20 critical
- 450 high
- 383 medium
- 76 low

The count must be interpreted carefully because several alerts are repeated across root and nested lockfiles.

## Key finding

The current alert count is inflated by multiple lockfile sources:

- root `pnpm-lock.yaml`
- service-level `pnpm-lock.yaml` files
- non-canonical `package-lock.json` files
- historical package manifests
- duplicated service locations

Before applying upgrades, the repository must distinguish canonical buyer-runtime dependency state from stale or duplicated lockfiles.

## Remediation principle

Do not start with mass dependency upgrades.

Start by reducing ambiguity:

1. Identify canonical lockfiles.
2. Separate stale lockfiles from active buyer-runtime dependency sources.
3. Remove or quarantine non-canonical lockfiles only after confirming they are not used by CI, Docker or buyer validation.
4. Apply dependency upgrades in small, reversible PRs.
5. Validate every change with the buyer-ready gates.

## Phase 1 — Lockfile authority review

Goal: determine which lockfiles are authoritative for the buyer baseline.

Candidate canonical source:

- root `pnpm-lock.yaml`

Candidate non-canonical or stale sources requiring verification:

- `apps/infrastructure/gateway/pnpm-lock.yaml`
- `apps/services/order-service/pnpm-lock.yaml`
- `apps/services/inventory-service/pnpm-lock.yaml`
- `apps/infrastructure/gateway/package-lock.json`
- `package-lock.json`
- package-level `package-lock.json` files under packages

Decision criteria:

- used by CI;
- used by Dockerfile.beta;
- used by `pnpm install --frozen-lockfile`;
- used by buyer validation scripts;
- required by any package manager workflow documented in README;
- generated accidentally by npm.

Expected output:

- list of canonical lockfiles;
- list of stale lockfiles;
- list of lockfiles to remove in a separate cleanup PR.

## Phase 2 — Non-canonical lockfile cleanup

Goal: remove stale lockfiles that inflate Dependabot alerts but are not part of the buyer runtime.

Potential cleanup targets, subject to Phase 1 confirmation:

- root `package-lock.json`
- package-level `package-lock.json`
- service-level lockfiles that are not used by pnpm workspace install

Validation gate:

```bash
pnpm install --frozen-lockfile
pnpm run buyer:check
Runtime gate when Docker is available:

pnpm run buyer:validate
Phase 3 — Root pnpm buyer-runtime remediation

Goal: remediate alerts in canonical dependency state.

Start with root pnpm-lock.yaml and packages used by:

apps/infrastructure/gateway
apps/services/order-service
apps/services/inventory-service
packages/shared-utils
packages/shared-events
packages/observability
packages/domain

Priority order:

critical alerts with patched versions available;
high alerts on runtime dependencies;
high alerts on build/test tooling used by buyer validation;
medium alerts;
low alerts.
Phase 4 — Controlled dependency updates

Rules:

one dependency family per PR where possible;
avoid major upgrades unless required by a critical alert;
do not upgrade frontend/design-system dependencies in buyer-runtime PRs;
do not mix legacy services with buyer baseline;
record before/after alert counts.

Validation gate for each remediation PR:

pnpm install --frozen-lockfile
pnpm run buyer:check
pnpm run test:preview
pnpm run build:preview

Runtime gate when Docker is available:

pnpm run buyer:validate
Phase 5 — Runtime proof update

After each successful remediation batch, update:

VALIDATION_REPORT.md
relevant security/audit document
PR body with before/after alert summary
Non-goals

This plan does not remediate all repository-wide Dependabot alerts.

Excluded from buyer-baseline remediation unless separately promoted:

frontend workspaces;
design-system packages;
legacy services;
experimental services;
duplicated historical service paths;
inactive package manager files.
Next PR recommendation

The next PR should be:

security: classify canonical lockfiles for buyer baseline

It should inspect the repository, document which lockfiles are canonical, and propose removal candidates without changing dependency versions.

