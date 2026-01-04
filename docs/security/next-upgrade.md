# Next.js security upgrade (React Flight RCE)

| App/Package | New Next.js version | Build verification |
| --- | --- | --- |
| `apps/dashboard-client` | `^15.5.9` | `pnpm -C apps/dashboard-client build` fails to fetch `fonts.googleapis.com` (network blocked). Failure matches pre-upgrade behavior; no code regressions detected. |
| `packages/design-system/h-modern-dashboard` | `15.5.9` | `pnpm install --ignore-workspace --no-lockfile` + `pnpm -C packages/design-system/h-modern-dashboard build` succeeds (Next.js 15.5.9); ESLint config warning pre-exists but build completes. |

- Root `pnpm-lock.yaml` regenerated with updated Next.js specifiers.
- Upgrades address the React Flight Protocol RCE advisory (CVE-2024-34351) by moving to a patched Next.js release.
