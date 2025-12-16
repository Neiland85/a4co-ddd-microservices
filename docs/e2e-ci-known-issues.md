# E2E CI Known Issues and Design Decisions

## Why We Don't Use Docker Healthchecks in CI

### Problem

The E2E test workflow was experiencing intermittent failures due to NATS container being marked as "unhealthy" in GitHub Actions CI environment, even though the NATS server was running correctly and tests could connect to it.

### Root Cause

1. **HTTP Healthcheck Instability**: NATS alpine images use `wget` for healthchecks, which can be unreliable in containerized CI environments with varying network latency
2. **Timing Sensitivity**: Docker's healthcheck mechanism is sensitive to:
   - CPU throttling in CI runners
   - Network latency between containers
   - Container startup overhead in CI environments
3. **False Negatives**: A container marked as "unhealthy" would block dependent services from starting, even when the service was functionally ready

### Solution

**Removed all Docker healthchecks from NATS in `docker-compose.test.yml`** and replaced with:

1. **TCP Port Checking**: Direct TCP port availability check using `nc -z`
   ```bash
   timeout 30 bash -c 'until nc -z localhost 4223; do sleep 1; done'
   ```

2. **Simple `depends_on`**: Changed from:
   ```yaml
   depends_on:
     nats-test:
       condition: service_healthy
   ```
   To:
   ```yaml
   depends_on:
     - nats-test
   ```

### Benefits

- ✅ **More Reliable**: TCP port checking is simpler and more reliable than HTTP healthchecks
- ✅ **Faster Startup**: No waiting for healthcheck retries (10 retries × 5s interval = 50s worst case)
- ✅ **CI-Friendly**: Works consistently across different CI environments
- ✅ **Simpler Logic**: Less moving parts = fewer failure points

### Trade-offs

- ⚠️ **Less Precise**: TCP port open ≠ service fully ready (but sufficient for tests)
- ⚠️ **Manual Waiting**: Need explicit wait commands in CI workflow
- ⚠️ **Production Difference**: Test infrastructure differs from production (where healthchecks are valuable)

## Test Infrastructure vs Production

### Test Environment (docker-compose.test.yml)

**Purpose**: Enable fast, reliable E2E tests in CI/CD

**Characteristics**:
- No healthchecks (see above)
- Simple `depends_on` without conditions
- TCP port checking for readiness
- Tolerant to transient failures

**Why**: CI environments need speed and reliability over precision. Tests will fail quickly if services aren't actually ready.

### Production Environment

**Purpose**: Ensure service availability and proper orchestration

**Characteristics**:
- Full healthchecks with HTTP endpoints
- `depends_on` with `service_healthy` conditions
- Kubernetes liveness/readiness probes
- Auto-restart on failure

**Why**: Production needs precise health status for load balancing, auto-scaling, and graceful degradation.

## NATS Configuration Details

### Ports

- **4223**: Client connection port (mapped from container's 4222)
  - Used by services to publish/subscribe to events
  - TCP check target in CI workflow
- **8222**: HTTP monitoring port
  - Provides server stats and health info
  - NOT used for CI healthchecks (too unreliable)

### Command

```yaml
command: "-js --http_port 8222"
```

- `-js`: Enable JetStream for persistent messaging
- `--http_port 8222`: Expose monitoring on standard NATS port

### Why No Healthcheck?

From NATS documentation: *"NATS is designed to be fast and lightweight. The server starts quickly and is ready to accept connections almost immediately."*

For E2E tests:
1. NATS starts in <2 seconds typically
2. TCP port opening is sufficient indicator
3. Services will retry connections if NATS isn't ready
4. Tests will fail fast if NATS is truly broken

## Debugging CI Failures

### If NATS Connection Fails

```bash
# Check if NATS port is accessible
nc -z localhost 4223

# View NATS logs
docker compose -f docker-compose.test.yml logs nats-test

# Check NATS server info (if monitoring port is exposed)
curl http://localhost:8222/varz
```

### If Services Can't Connect

1. **Check Service Logs**: Services log NATS connection attempts
   ```bash
   docker compose -f docker-compose.test.yml logs order-service-test
   ```

2. **Verify Network**: Ensure all services are on `test-net` network
   ```bash
   docker network inspect a4co-ddd-microservices_test-net
   ```

3. **Check Environment**: Verify `NATS_URL` environment variable
   ```bash
   docker compose -f docker-compose.test.yml exec order-service-test env | grep NATS
   ```

### If Tests Fail Intermittently

1. **Increase TCP Check Timeout**: Edit `.github/workflows/e2e.yml`
   ```yaml
   timeout 30 -> timeout 60  # Double the wait time
   ```

2. **Add Explicit Sleep**: After TCP check (last resort)
   ```bash
   nc -z localhost 4223 && sleep 5  # Give NATS extra time
   ```

3. **Check CI Runner Resources**: GitHub Actions runners can be slow
   - Review workflow run timing
   - Consider self-hosted runners for consistency

## References

- [NATS Documentation](https://docs.nats.io/)
- [Docker Compose Depends On](https://docs.docker.com/compose/compose-file/compose-file-v3/#depends_on)
- [Docker Healthchecks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [GitHub Actions Runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)

## History

- **v1** (Initial): Used HTTP healthcheck with `wget` on port 8222
  - **Issue**: Marked unhealthy in CI despite being functional
- **v2** (Current): Removed healthcheck, use TCP port check
  - **Result**: Stable CI runs, faster startup

---

**Last Updated**: December 15, 2025  
**Status**: Current approach for E2E tests in CI/CD
