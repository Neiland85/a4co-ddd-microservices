# Next Steps — React Flight / Next.js RCE Risk

## Objective

Close the React Flight protocol risk operationally, not only by dependency bump.

## Current Status

- Next.js was upgraded to a patched line in affected workspaces.
- CI already checks for `next` advisories in `pnpm audit` output.
- Security and license reports are uploaded as artifacts.

## Immediate Steps (P0, this week)

1. Make a focused release note for the security fix.
2. Run CI on `main` and keep evidence artifacts for audit trail.
3. Verify no rollback paths reintroduce vulnerable `next` versions.
4. Confirm all deploy environments use the updated lockfile.

## Short-Term Steps (1-2 weeks)

1. Convert additional high-impact advisories to blocking gates (not only `next`).
2. Add a lockfile guard in CI to fail if lockfile is out-of-sync with manifests.
3. Add a weekly dependency triage routine with owner + SLA.
4. Remove `--passWithNoTests` in critical services.

## Medium-Term Steps (1-3 months)

1. Add SBOM generation per release and retain artifacts.
2. Add policy for accepted licenses and CI enforcement.
3. Add contract tests for critical frontend-backend flows using RSC payload paths.
4. Publish an incident response playbook for dependency CVEs.

## Verification Checklist

- [ ] `pnpm audit --prod` has no advisories for module `next`.
- [ ] CI job fails when a `next` advisory is reintroduced.
- [ ] Security artifacts are attached to every CI run.
- [ ] Deploy pipeline consumes the same lockfile validated in CI.

## Suggested Owners

- Platform/DevEx: CI gates, lockfile policy, artifact retention.
- Security: advisory triage process, CVE response SLA.
- Frontend: Next.js upgrade lifecycle and compatibility checks.
- Tech Lead: release governance and sign-off.
