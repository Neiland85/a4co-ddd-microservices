# Troubleshooting Guide - PR1A

This document provides solutions for common errors, issues, and debugging commands for the A4CO DDD Microservices project.

## Table of Contents
- [Common Errors](#common-errors)
- [Debugging Commands](#debugging-commands)
- [Service-Specific Issues](#service-specific-issues)
- [Docker & Container Issues](#docker--container-issues)
- [Database Issues](#database-issues)

---

## Common Errors

### Error: "Connection Refused"

**Cause:**
- Service not running or not yet started
- Incorrect service port configuration
- Firewall blocking connections
- Service dependency not initialized

**Solutions:**
1. Verify service is running:
   ```bash
   docker ps | grep <service-name>
   ```

2. Check service logs:
   ```bash
   docker logs <container-id>
   ```

3. Verify port mapping:
   ```bash
   docker port <container-name>
   ```

4. Ensure dependencies are started in correct order
5. Check firewall rules and port availability

---

### Error: "Port Already in Use"

**Cause:**
- Another service or application using the same port
- Previous container not properly stopped
- Port binding conflict in docker-compose

**Solutions:**
1. Find process using the port:
   ```bash
   lsof -i :<port-number>
   netstat -tulpn | grep <port-number>
   ```

2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

3. Stop and remove all containers:
   ```bash
   docker-compose down
   docker system prune -a
   ```

4. Verify port is free before starting services

---

### Error: "Service Timeout / Slow Response"

**Cause:**
- High CPU or memory usage
- Network latency issues
- Service misconfiguration
- Database performance problems

**Solutions:**
1. Check resource usage:
   ```bash
   docker stats <container-name>
   ```

2. Monitor system resources:
   ```bash
   top
   free -h
   ```

3. Check service configuration files for performance settings
4. Review database query performance
5. Check network connectivity between services

---

### Error: "Database Connection Failed"

**Cause:**
- Database service not running
- Incorrect credentials
- Wrong connection string
- Network isolation

**Solutions:**
1. Verify database container is running:
   ```bash
   docker ps | grep db
   ```

2. Check database logs:
   ```bash
   docker logs <db-container-id>
   ```

3. Test connection manually:
   ```bash
   docker exec -it <db-container> psql -U <user> -d <database>
   ```

4. Verify credentials in environment variables:
   ```bash
   docker exec <service-container> env | grep DB
   ```

---

### Error: "Out of Memory"

**Cause:**
- Service memory limit exceeded
- Memory leak in application
- Insufficient host memory

**Solutions:**
1. Monitor memory usage:
   ```bash
   docker stats --no-stream
   ```

2. Increase container memory limit in docker-compose.yml:
   ```yaml
   services:
     service-name:
       memory: 1024m
   ```

3. Check for memory leaks in logs
4. Restart service and monitor:
   ```bash
   docker restart <container-name>
   ```

---

### Error: "Permission Denied"

**Cause:**
- File/directory permission issues
- Docker daemon access issues
- User not in docker group

**Solutions:**
1. Add current user to docker group:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. Fix file permissions:
   ```bash
   sudo chmod 644 <file>
   sudo chown <user>:<user> <directory>
   ```

3. Verify docker socket permissions:
   ```bash
   ls -l /var/run/docker.sock
   ```

---

## Debugging Commands

### General System Information

```bash
# Docker version and info
docker --version
docker info

# System resource status
df -h
du -sh *
free -h

# Running containers
docker ps
docker ps -a

# Docker network status
docker network ls
docker network inspect <network-name>
```

### Service Inspection

```bash
# View container logs
docker logs <container-id>
docker logs -f <container-id>  # Follow logs
docker logs --tail 100 <container-id>  # Last 100 lines

# Execute commands in container
docker exec -it <container-id> /bin/bash
docker exec <container-id> <command>

# Container statistics
docker stats <container-name>
docker inspect <container-id>

# Container processes
docker top <container-id>
```

### Network Debugging

```bash
# Test connectivity between containers
docker exec <container1> ping <container2>
docker exec <container1> curl http://<container2>:<port>

# DNS resolution
docker exec <container-id> nslookup <service-name>
docker exec <container-id> getent hosts <service-name>

# Port mapping verification
docker port <container-name>
netstat -tulpn
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop
docker-compose down

# View logs
docker-compose logs
docker-compose logs -f <service-name>
docker-compose logs --tail 50

# Restart services
docker-compose restart <service-name>

# Build images
docker-compose build
docker-compose build --no-cache

# Validate configuration
docker-compose config

# Service status
docker-compose ps
```

### Application Debugging

```bash
# View application logs
docker logs -f <service-container>

# Check environment variables
docker exec <container-id> env

# Interactive shell in container
docker exec -it <container-id> /bin/sh

# Health check status
docker inspect --format='{{.State.Health.Status}}' <container-id>

# Application processes inside container
docker exec <container-id> ps aux
```

---

## Service-Specific Issues

### API Gateway Issues

**Problem:** Gateway not routing requests correctly

**Debug Steps:**
```bash
# Check gateway logs
docker logs -f <gateway-container>

# Test routing
docker exec <gateway-container> curl -v http://localhost:8080/api/health

# Verify service registration
docker exec <gateway-container> curl http://localhost:8080/admin/services
```

### Microservice Communication Issues

**Problem:** Services unable to communicate

**Debug Steps:**
```bash
# Check service is accessible
docker exec <service1> ping <service2>
docker exec <service1> curl -v http://<service2>:<port>/health

# Verify network
docker network inspect <network-name>

# Check DNS resolution
docker exec <service1> nslookup <service2>
```

### Message Queue Issues

**Problem:** Events/messages not being processed

**Debug Steps:**
```bash
# Check queue status
docker logs -f <queue-container>

# Check message count
docker exec <queue-container> <queue-specific-command>

# Monitor queue metrics
docker stats <queue-container>
```

---

## Docker & Container Issues

### Container Won't Start

**Debug Steps:**
```bash
# Check container logs
docker logs <container-id>

# Inspect container configuration
docker inspect <container-id>

# Try running with verbose output
docker-compose up <service-name>  # Without -d flag

# Check image exists
docker images | grep <image-name>
```

### Image Build Failures

**Solutions:**
```bash
# Rebuild without cache
docker-compose build --no-cache <service-name>

# Check Dockerfile syntax
docker build --no-cache -f Dockerfile .

# Clean up unused images
docker image prune -a

# View build layers
docker history <image-name>
```

### Network Issues

```bash
# List all networks
docker network ls

# Inspect network
docker network inspect <network-name>

# Recreate network
docker network rm <network-name>
docker network create <network-name>

# Check container network connectivity
docker exec <container> nc -zv <service-name> <port>
```

---

## Database Issues

### Cannot Connect to Database

```bash
# Verify database is running
docker ps | grep postgres  # or mysql, mongo, etc.

# Check database logs
docker logs <db-container>

# Test connection
docker exec -it <db-container> psql -U <user> -d <database>

# Check environment variables
docker exec <app-container> env | grep DB
```

### Database Migration Failures

```bash
# Check migration status
docker exec <app-container> <migration-command> status

# View migration logs
docker logs <migration-container>

# Manual database access
docker exec -it <db-container> psql -U <user>

# Execute migration manually
docker exec <app-container> <migration-command> up
```

### Slow Queries

```bash
# Enable query logging (database-specific)
docker exec <db-container> <enable-logging-command>

# Monitor active queries
docker exec <db-container> <active-queries-command>

# Check connection pool status
docker logs <app-container> | grep -i "connection\|pool"
```

---

## Health Checks

### Verify Service Health

```bash
# Check all services health
docker-compose ps

# Manual health check
docker exec <container> curl http://localhost:<port>/health

# Check service readiness
docker exec <container> curl http://localhost:<port>/ready
```

---

## Performance Optimization

### Monitor Performance

```bash
# Real-time monitoring
docker stats --no-stream

# Historical monitoring
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Log monitoring
docker logs <container> | grep -i "error\|warn\|exception"
```

---

## Clean Up Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes

# Full reset (WARNING: Deletes all Docker data)
docker system prune -a --volumes
docker-compose down -v
```

---

## Useful Aliases

Add these to your `.bashrc` or `.zshrc` for convenience:

```bash
# Docker Compose shortcuts
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'

# Docker shortcuts
alias dk='docker'
alias dkl='docker logs -f'
alias dkps='docker ps'
alias dkst='docker stats --no-stream'
alias dkexec='docker exec -it'
```

---

## Getting Help

- Check Docker documentation: https://docs.docker.com
- Review service-specific logs: `docker logs <service>`
- Check docker-compose configuration: `docker-compose config`
- Review application error traces in service logs
- Check GitHub issues for known problems

---

**Last Updated:** 2025-12-15
**Document Version:** 1.0
