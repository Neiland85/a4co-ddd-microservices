## Summary

(Describe the changes and why they are needed)

---

## Security Checklist

- [ ] No hardcoded passwords, API keys, or secrets in code or config files
- [ ] Sensitive values reference GitHub secrets or environment variables
- [ ] SQL scripts use environment variable expansion and are documented
- [ ] Database users follow least-privilege principle (no SUPERUSER/CREATEDB/CREATEROLE)
- [ ] Secrets introduced by this PR are documented in the description

## CI/CD Workflow Changes

- [ ] YAML syntax validated (no orphaned properties)
- [ ] Workflow triggers are properly configured and tested
- [ ] Required secrets are documented
- [ ] Workflow permissions follow least-privilege principle

## Database Changes (if applicable)

- [ ] SQL scripts are idempotent (safe to run multiple times)
- [ ] Uses IF NOT EXISTS for object creation
- [ ] No hardcoded credentials
- [ ] Environment variables are documented
- [ ] Scripts tested against disposable database (CI)

## Security Scanning

- [ ] GitGuardian scan passed (no secrets detected)
- [ ] Codacy analysis (trivy) passed if dependencies added

## Breaking Changes / Upgrades

- [ ] Breaking changes documented
- [ ] Migration guide included if applicable

---

Please include any notes about required repository secrets or environment configuration below.
