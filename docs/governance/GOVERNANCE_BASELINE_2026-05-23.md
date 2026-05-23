# A4CO Repository Governance Baseline — 2026-05-23

## Status

This repository is currently maintained as a controlled technical asset with a local-first validation strategy and commercial-transfer posture.

## Current repository state

- Default branch: `main`
- Open pull requests: `0`
- Local working tree expected state: clean
- CI strategy: manual validation workflow
- Docker Hub legacy build webhook: disabled
- GitHub Sponsors metadata: enabled via `.github/FUNDING.yml`
- Public open-source license: not granted
- Commercial transfer posture: proprietary notice with separate written agreement required

## Recent stabilization work

### Runtime and preview

- Local/hybrid preview runtime stabilized.
- Docker is limited to infrastructure for the current preview baseline.
- Nest services run locally for preview validation.
- Preview scripts are available under `scripts/preview/`.

Relevant runtime ports:

- API Gateway: `3000`
- Order Service: `3004`
- Inventory Service: `3006`
- NATS: `4222`
- PostgreSQL: `5433`

### Repository hygiene

- Unresolved Git conflict markers were removed.
- Obsolete and failing dependency PRs were reviewed, commented, and closed.
- Useful Snyk PRs were merged after local validation.
- `.vscode/settings.json` formatting was normalized to reduce recurring editor noise.

### CI and external integrations

- Broken GitHub Actions CI was replaced by a manual validation workflow.
- Docker Hub legacy automated build webhook was disabled.
- GitGuardian remains active.
- Snyk remains active, but Snyk external status errors should be reviewed case by case.

### Licensing and commercial transfer

- Repository license was replaced with a proprietary software notice.
- Package metadata was aligned toward `UNLICENSED` / private repository posture.
- The repository does not grant public exploitation rights.
- Broad commercial rights may be granted to a purchaser or licensee only through a separate written agreement.
- Third-party dependencies remain subject to their own licenses.

### Product service

- `product-service` Prisma dependency mismatch was corrected.
- `@prisma/client` and `prisma` were aligned.
- `product-service` Prisma client generation and direct build were validated.

### Frontend and design-system

- `apps/frontend` build passes.
- `packages/design-system` build passes.
- `h-modern-dashboard` build was stabilized by unsetting non-standard `NODE_ENV`.
- `h-modern-dashboard` Next tracing root was explicitly configured.
- Legacy ESLint loading during dashboard build was skipped for the frozen dashboard package.

## Baseline validation commands

```bash
git status --short
git branch --show-current
gh pr list --state open --limit 50

pnpm run check:fast

pnpm --filter ./packages/design-system/h-modern-dashboard run build
pnpm --filter ./apps/frontend run build
pnpm --filter ./packages/design-system run build

pnpm --filter @a4co/product-service run prisma:generate
pnpm --filter @a4co/product-service run build
```

## Expected baseline result

- `git status --short` returns empty output.
- Current branch is `main` unless working on a dedicated PR branch.
- No open pull requests unless intentionally opened.
- `pnpm run check:fast` passes.
- `h-modern-dashboard`, `apps/frontend`, and `packages/design-system` builds pass.
- `product-service` Prisma generation and build pass.

## Known warnings and non-blocking issues

The following may still appear and are currently non-blocking:

- Existing lint warnings in order-service and inventory-service.
- Frontend bundle size warning in `apps/frontend`.
- Snyk vulnerability count in repository dashboard.
- Third-party dependency license entries inside lockfiles.
- Legacy frontend/design-system dependency updates should be handled in dedicated PRs.

## Work deliberately not included in this baseline

- Full Dockerized app runtime.
- Production deployment hardening.
- Next.js major upgrade.
- React major/minor frontend refresh.
- Full ESLint flat-config migration.
- Full Snyk vulnerability remediation.
- Third-party dependency license audit report.
- Legal contract drafting for final software asset transfer.

## Recommended next branches

- `audit/frontend-dependency-refresh-v2`
- `hardening/lint-warning-reduction`
- `chore/third-party-license-inventory`
- `docs/software-transfer-agreement-outline`
- `hardening/docker-preview-modernization`

## Operating rule

All future changes should be small, scoped, and validated before merge.

Preferred PR structure:

- One concern per PR.
- No mixed dependency upgrades.
- No Docker app build changes mixed with local runtime changes.
- No license/governance changes mixed with code changes.
- No broad automated dependency merge without local validation.
