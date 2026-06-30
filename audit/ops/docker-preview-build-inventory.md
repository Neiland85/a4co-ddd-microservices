<!-- markdownlint-disable MD013 -->

# A4CO Docker Preview Build Inventory

Date: 2026-06-30

Branch: `ops/docker-preview-build-inventory`

## Objective

Document the Docker preview build failure and performance signals before changing Dockerfiles, Compose configuration or runtime ports.

This PR does not change Docker behavior.

This PR does not change dependencies.

This PR does not change ports.

This PR does not rebuild images.

## Observed failure

The Docker preview run built several images and created preview containers, but failed when PostgreSQL attempted to bind the local port:

- `127.0.0.1:5432`

The daemon reported that the address was already in use.

## Build performance signals

The preview build took more than forty minutes before failing.

Observed timings included:

- `payment-service` image built after approximately 2425 seconds;
- `auth-service` image built after approximately 2425 seconds;
- `api-gateway`, `order-service` and `inventory-service` were still building after approximately 2494 seconds.

This indicates a build-performance issue independent from the final port-binding failure.

## Repository observations

The local root `node_modules` directory was approximately 2.2 GB.

Multiple nested `node_modules` directories were also present under `apps` and `packages`.

The current `.dockerignore` did not list `node_modules`.

The repository also contains `Dockerfile.universal` with these relevant patterns:

- `COPY node_modules ./node_modules`
- `RUN chown -R node:node /app`

## Interpretation

There are two separate issues:

1. Local preview startup conflict: port `5432` is already occupied.
2. Docker build inefficiency: large dependency trees may be copied into image context or processed during ownership changes.

The port conflict explains the immediate runtime failure.

The dependency-copy and recursive ownership patterns may explain the very slow build path.

## Current decision

Do not change Dockerfiles in this PR.

Do not change Compose ports in this PR.

Do not remove local dependencies in this PR.

Do not rerun the long Docker build as part of this PR.

## Recommended next steps

Open a separate fix PR after this inventory.

Candidate fixes to evaluate separately:

- avoid binding preview PostgreSQL to `127.0.0.1:5432` when that port is already used locally;
- add `node_modules` exclusions to Docker context where safe;
- remove direct `COPY node_modules` patterns from preview images where safe;
- replace broad recursive `chown -R /app` with narrower ownership handling;
- validate preview build with a bounded command and captured timing.

## Non-goals

This PR does not claim Docker preview is fixed.

This PR does not change buyer-runtime validation.

This PR only records the observed Docker preview build and startup boundary.
