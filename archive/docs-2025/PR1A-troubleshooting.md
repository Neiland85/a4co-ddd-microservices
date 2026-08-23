# Troubleshooting Guide - A4CO DDD Microservices

## Table of Contents
1. [Common Errors & Solutions](#common-errors--solutions)
2. [Debugging Commands](#debugging-commands)
3. [Service-Specific Issues](#service-specific-issues)
4. [Docker Issues](#docker-issues)
5. [Database Issues](#database-issues)
6. [Health Checks](#health-checks)

---

## Common Errors & Solutions

### 1. Connection Refused / Port Already in Use

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:PORT
Address already in use :::PORT
```

**Causes:**
- Service is not running
- Port is already bound by another process
- Firewall blocking the connection
- Service crashed unexpectedly

**Solutions:**
```bash
# Check which process is using the port
lsof -i :PORT
# or on Windows
netstat -ano | findstr :PORT

# Kill the process using the port
kill -9 PID
# or on Windows
taskkill /PID PID /F

# Change the port in configuration file
# Update .env or config file with different PORT

# Verify the service is running
docker ps | grep SERVICE_NAME
```

---

### 2. Authentication Failures

**Error Message:**
```
401 Unauthorized
Invalid token
Authentication failed
```

**Causes:**
- Missing or expired JWT token
- Invalid credentials
- Token signature mismatch
- CORS policy violation

**Solutions:**
```bash
# Verify authentication environment variables
echo $JWT_SECRET
echo $AUTH_SERVICE_URL

# Check token expiration
node -e "console.log(require('jsonwebtoken').decode('TOKEN_HERE'))"

# Restart authentication service
docker restart auth-service

# Clear and regenerate tokens
# Delete token cache/storage and re-authenticate
```

---

### 3. Service Not Found / 404 Errors

**Error Message:**
```
404 Not Found
Service unreachable
Cannot GET /endpoint
```

**Causes:**
- Incorrect API endpoint
- Service not running
- API routing misconfiguration
- Wrong base URL

**Solutions:**
```bash
# Verify service is running
docker ps
docker logs SERVICE_NAME

# Check API routes
curl -X GET http://localhost:PORT/health

# Verify network connectivity between services
docker network ls
docker network inspect NETWORK_NAME

# Check service registry/discovery
# Verify service registration in service mesh (if using Consul, Eureka, etc.)
```

---

### 4. Database Connection Errors

**Error Message:**
```
Error: connect ECONNREFUSED (database)
FATAL: remaining connection slots are reserved
Database locked
```

**Causes:**
- Database service not running
- Connection pool exhausted
- Invalid connection string
- Database credentials incorrect
- Insufficient database permissions

**Solutions:**
```bash
# Verify database is running
docker ps | grep database

# Check connection string in environment
echo $DATABASE_URL

# Test database connection directly
psql postgresql://user:password@host:5432/dbname
# or for MongoDB
mongo mongodb://user:password@host:27017/dbname

# Check connection pool settings
# Modify connection pool size in database config

# Verify database user permissions
# Grant necessary permissions to database user
```

---

### 5. Memory/Resource Exhaustion

**Error Message:**
```
Cannot allocate memory
Out of memory
Process exited with code 137
```

**Causes:**
- Memory leak in application
- Insufficient container memory allocation
- Unbounded cache growth
- Memory not released properly

**Solutions:**
```bash
# Monitor resource usage
docker stats

# Check logs for memory issues
docker logs SERVICE_NAME | grep -i memory

# Increase memory limit
docker run -m 2G SERVICE_IMAGE

# Check for memory leaks in code
# Use profiling tools: node --prof, heap snapshots

# Clear cache/temporary files
docker exec CONTAINER_NAME rm -rf /tmp/*
```

---

## Debugging Commands

### Docker Debugging

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Check container logs
docker logs CONTAINER_NAME
docker logs -f CONTAINER_NAME  # Follow logs
docker logs --tail 100 CONTAINER_NAME  # Last 100 lines

# Inspect container details
docker inspect CONTAINER_NAME

# Execute command in running container
docker exec -it CONTAINER_NAME /bin/bash

# Monitor container resource usage
docker stats

# Check network
docker network ls
docker network inspect NETWORK_NAME

# Build image with verbose output
docker build -t IMAGE_NAME:TAG . --progress=plain

# Push to registry with debug
docker push IMAGE_NAME:TAG -v
```

### Application Debugging

```bash
# Enable debug logging
DEBUG=* npm start
DEBUG=a4co:* npm start

# Check environment variables
printenv | grep -i service
printenv | grep -i database

# View active network connections
netstat -tuln | grep LISTEN
lsof -i -P -n | grep LISTEN

# Check system resources
free -h
df -h
ps aux | grep NODE_NAME

# Trace API requests
curl -v http://localhost:PORT/endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"key":"value"}' http://localhost:PORT/endpoint

# Check DNS resolution
nslookup SERVICE_NAME
dig SERVICE_NAME
```

### Git Debugging

```bash
# Check git status
git status
git log --oneline -10

# Verify branch and commit
git branch -v
git rev-parse HEAD

# Check for uncommitted changes
git diff
git diff --cached
```

---

## Service-Specific Issues

### API Gateway Service

**Issue: Gateway not routing requests**
```bash
# Check gateway logs
docker logs gateway-service

# Verify service registration
curl http://localhost:GATEWAY_PORT/admin/routes

# Test direct service connection
curl http://SERVICE_NAME:PORT/health

# Check gateway configuration
docker exec gateway-service cat /app/config/routes.json

# Restart gateway
docker restart gateway-service
```

**Issue: CORS errors**
```bash
# Verify CORS configuration
grep -r "cors" /path/to/config/

# Check allowed origins
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:GATEWAY_PORT/api/endpoint -v

# Update CORS settings
# Modify gateway configuration to include your domain
```

### User Service

**Issue: User registration failing**
```bash
# Check user service logs
docker logs user-service

# Verify database connection
docker exec user-service psql -U USER -d DATABASE -c "SELECT COUNT(*) FROM users;"

# Check email validation
docker logs user-service | grep -i email

# Verify JWT secret configuration
echo $JWT_SECRET
```

**Issue: Password reset not working**
```bash
# Check email service configuration
docker logs email-service

# Verify SMTP settings
grep -r "SMTP" /path/to/config/

# Test email sending
curl -X POST http://localhost:EMAIL_PORT/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","body":"Test"}'

# Check reset token expiration
docker logs user-service | grep -i token
```

### Product Service

**Issue: Product retrieval slow**
```bash
# Check database query performance
docker exec product-db psql -U USER -d DATABASE \
  -c "EXPLAIN ANALYZE SELECT * FROM products WHERE id = 1;"

# Monitor database connections
docker exec product-db psql -U USER -d DATABASE \
  -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Check cache status (if using Redis)
docker exec redis redis-cli INFO stats

# Rebuild indexes if necessary
docker exec product-db psql -U USER -d DATABASE \
  -c "REINDEX DATABASE DATABASE_NAME;"
```

**Issue: Inventory sync problems**
```bash
# Check inventory service
docker logs inventory-service

# Verify event publishing
docker logs product-service | grep -i event

# Monitor message queue
# Check RabbitMQ/Kafka queue status

# Retry failed sync
curl -X POST http://localhost:PORT/api/sync-inventory \
  -H "Authorization: Bearer TOKEN"
```

### Order Service

**Issue: Order creation failing**
```bash
# Check order service logs
docker logs order-service

# Verify payment service integration
curl http://localhost:PAYMENT_PORT/health

# Check order database
docker exec order-db psql -U USER -d DATABASE \
  -c "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;"

# Review transaction logs
docker logs order-service | grep -i transaction
```

**Issue: Order status not updating**
```bash
# Check event consumer
docker logs order-service | grep -i consumer

# Verify message queue connectivity
docker logs order-service | grep -i queue

# Monitor event processing
docker exec order-service tail -f /var/log/order-service.log

# Manually trigger status update (if supported)
curl -X POST http://localhost:PORT/api/orders/ORDER_ID/process
```

---

## Docker Issues

### Container Won't Start

```bash
# Check error logs
docker logs CONTAINER_NAME

# Inspect container configuration
docker inspect CONTAINER_NAME

# Check image exists
docker images | grep IMAGE_NAME

# Rebuild image
docker build -t IMAGE_NAME:TAG .

# Check Docker daemon
docker system info

# View Docker daemon logs (Linux)
journalctl -u docker
```

### Image Build Failures

```bash
# Build with verbose output
docker build -t IMAGE_NAME:TAG . --progress=plain

# Build specific stage (multi-stage)
docker build -t IMAGE_NAME:TAG --target STAGE .

# Clear build cache and rebuild
docker build --no-cache -t IMAGE_NAME:TAG .

# Check Dockerfile for issues
docker run --rm -i hadolint/hadolint < Dockerfile

# Verify base image
docker pull BASE_IMAGE:TAG
```

### Network Issues

```bash
# Create network if missing
docker network create NETWORK_NAME

# Connect container to network
docker network connect NETWORK_NAME CONTAINER_NAME

# List all networks
docker network ls

# Inspect network
docker network inspect NETWORK_NAME

# Remove unused networks
docker network prune

# Test network connectivity between containers
docker exec CONTAINER_1 ping CONTAINER_2
```

### Volume Issues

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect VOLUME_NAME

# Check volume mount in container
docker inspect CONTAINER_NAME | grep -A 10 Mounts

# Verify permissions
docker exec CONTAINER_NAME ls -la /path/to/mount

# Clean up unused volumes
docker volume prune
```

### Docker Compose Issues

```bash
# Validate docker-compose file
docker-compose config

# Build services
docker-compose build

# Start services with logs
docker-compose up -d
docker-compose logs -f

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart SERVICE_NAME

# Recreate containers
docker-compose up -d --force-recreate

# Remove all containers/volumes
docker-compose down -v
```

---

## Database Issues

### PostgreSQL Issues

**Connection Problems**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Verify connection string
echo $DATABASE_URL

# Test connection
docker exec postgres-container psql -U USERNAME -d DBNAME -c "SELECT 1;"

# Check PostgreSQL logs
docker logs postgres-container | tail -50

# Verify credentials
# Check username, password, and database name match
```

**Performance Issues**
```bash
# Check active connections
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Check slow queries
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Analyze query plan
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "EXPLAIN ANALYZE SELECT * FROM TABLE_NAME WHERE condition;"

# Vacuum database
docker exec postgres-container psql -U USERNAME -d DBNAME -c "VACUUM ANALYZE;"

# Reindex tables
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "REINDEX DATABASE DBNAME;"
```

**Data Corruption**
```bash
# Check database integrity
docker exec postgres-container psql -U USERNAME -d DBNAME -c "VACUUM FULL ANALYZE;"

# Rebuild indexes
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "REINDEX DATABASE DBNAME;"

# Restore from backup
# Locate backup file and restore using pg_restore
```

### MongoDB Issues (if applicable)

**Connection Problems**
```bash
# Check MongoDB status
docker logs mongodb-container

# Test connection
docker exec mongodb-container mongo --eval "db.adminCommand('ping')"

# Check credentials
echo $MONGO_URI

# Verify replica set status
docker exec mongodb-container mongo --eval "rs.status()"
```

**Performance Issues**
```bash
# Check indexes
docker exec mongodb-container mongo --eval "db.COLLECTION.getIndexes()"

# Create missing indexes
docker exec mongodb-container mongo --eval \
  "db.COLLECTION.createIndex({field: 1})"

# Monitor queries
docker exec mongodb-container mongo --eval "db.setProfilingLevel(1)"

# Analyze query execution
docker exec mongodb-container mongo --eval \
  "db.COLLECTION.find({query}).explain('executionStats')"
```

### Database Migration Issues

```bash
# Check migration status
docker logs migration-container

# View migration history
docker exec DATABASE-container psql -U USERNAME -d DBNAME \
  -c "SELECT * FROM migrations ORDER BY executed_at DESC;"

# Rollback migration (if supported)
npm run migrate:rollback

# Run migrations again
npm run migrate

# Check for pending migrations
npm run migrate:status
```

---

## Health Checks

### Service Health Checks

```bash
# General health endpoint (common pattern)
curl http://localhost:PORT/health
curl http://localhost:PORT/api/health
curl http://localhost:PORT/actuator/health

# Check multiple services
for service in user-service product-service order-service; do
  echo "Checking $service..."
  curl http://localhost:PORT/health
done

# Detailed health with dependencies
curl http://localhost:PORT/health/detailed

# Liveness probe (service running)
curl http://localhost:PORT/health/live

# Readiness probe (ready to accept traffic)
curl http://localhost:PORT/health/ready
```

### Database Health

```bash
# PostgreSQL health
docker exec postgres-container pg_isready -U USERNAME

# MongoDB health
docker exec mongodb-container mongo --eval "db.adminCommand('ping')"

# Redis health
docker exec redis-container redis-cli ping

# Check database connections
docker exec postgres-container psql -U USERNAME -d DBNAME \
  -c "SELECT count(*) as connected_users FROM pg_stat_activity WHERE datname is not null;"
```

### Application Health Monitoring

```bash
# Check memory usage
docker stats --no-stream CONTAINER_NAME

# Monitor CPU usage
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Check disk space
df -h

# Monitor logs for errors
docker logs CONTAINER_NAME | grep -i error

# Check uptime
docker inspect CONTAINER_NAME | grep -i uptime
```

### Network Health Checks

```bash
# Test DNS resolution
nslookup SERVICE_NAME
dig SERVICE_NAME

# Test service connectivity
nc -zv SERVICE_NAME PORT
telnet SERVICE_NAME PORT

# Trace network path
traceroute SERVICE_NAME

# Check open ports
netstat -tlnp | grep LISTEN
```

### System Health Commands

```bash
# Overall system status
docker system df

# Check for issues
docker system info | grep -i warning

# Prune unused resources
docker system prune -a  # Remove unused images, containers, networks

# Check disk usage
docker exec CONTAINER_NAME df -h

# Monitor real-time resource usage
docker stats --all
```

---

## Quick Reference - Most Common Commands

```bash
# View all logs
docker-compose logs -f

# Check service status
docker-compose ps

# Restart all services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Full restart (clean)
docker-compose down -v && docker-compose up -d

# Access service logs filtered
docker logs SERVICE_NAME | grep -i ERROR

# Database connection test
docker exec DATABASE_CONTAINER psql -U USER -d DATABASE -c "SELECT 1;"

# Health check
curl http://localhost:PORT/health -w "\n"

# Monitor resources
docker stats
```

---

## Getting Help

1. **Check logs first**: `docker-compose logs -f SERVICE_NAME`
2. **Verify services are running**: `docker-compose ps`
3. **Test connectivity**: `curl http://localhost:PORT/health`
4. **Review configuration**: Check .env and docker-compose.yml
5. **Check resource usage**: `docker stats`
6. **Review recent commits**: `git log --oneline -10`
7. **Contact the team**: Provide logs, error messages, and steps taken

---

**Last Updated**: 2025-12-15
**Version**: 1.0
