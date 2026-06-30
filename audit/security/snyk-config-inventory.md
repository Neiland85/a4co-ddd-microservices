# A4CO Snyk Configuration Inventory

Date: 2026-06-30

## Objective

Document the repository-visible Snyk boundary before lockfile cleanup.

## Context

The buyer-ready baseline uses the root pnpm workspace lockfile.

A prior npm lockfile removal attempt was closed because Snyk failed with manifest-read errors.

## Finding

No repository-owned Snyk workflow or `.snyk` policy is changed here.

The active Snyk status appears to be controlled outside the repository, through the Snyk GitHub App or Snyk UI project imports.

## Decision

Do not remove npm lockfiles yet.

Do not bypass Snyk.

Do not commit raw Dependabot alert exports.

Do not upgrade dependencies in this PR.

## Next step

Review the external Snyk project configuration before reopening lockfile cleanup.
