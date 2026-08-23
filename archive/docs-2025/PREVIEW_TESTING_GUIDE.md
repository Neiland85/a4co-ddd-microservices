# 🧪 Preview Environment Testing Guide

## Overview

This document provides step-by-step instructions for testing the preview environment to ensure frontend and backend connectivity.

**Last Updated**: 2026-01-04

---

## Prerequisites Verification

Before starting, ensure all prerequisites are met:

```bash
./verify-preview-setup.sh
```

Expected output: **All checks passed! ✅**

---

## 1. Initial Setup

### Step 1.1: Clone and Navigate

```bash
git clone https://github.com/Neiland85/a4co-ddd-microservices.git
cd a4co-ddd-microservices
```

### Step 1.2: Verify Configuration

```bash
# Ensure .env.preview exists
ls -la .env.preview

# If not, create from template
cp .env.preview.example .env.preview
```

### Step 1.3: Review Environment Variables

```bash
cat .env.preview
```

**Key variables to verify**:
- `POSTGRES_PASSWORD` - Database password
- `JWT_SECRET` - JWT token secret
- `CORS_ORIGIN` - Includes frontend URLs
- `NEXT_PUBLIC_API_URL` - Points to API Gateway

---

## 2. Start Preview Environment

### Option A: Automated Startup (Recommended)

```bash
./start-preview.sh
```

This script will:
1. Check prerequisites
2. Build Docker images
3. Start all services
4. Wait for health checks
5. Display access URLs

**Expected output**:
```
Preview environment is ready!

Frontend Applications:
  • Dashboard (Next.js):     http://localhost:3001
  • Main Frontend (Vite):    http://localhost:5173

Backend Services:
  • API Gateway:             http://localhost:8080
  • API Gateway Health:      http://localhost:8080/api/v1/health
  ...
```

### Option B: Manual Startup

```bash
# Build images
docker compose -f docker-compose.preview.yml --env-file .env.preview build

# Start services
docker compose -f docker-compose.preview.yml --env-file .env.preview up -d

# Check status
docker compose -f docker-compose.preview.yml --env-file .env.preview ps
```

---

## 3. Verify Infrastructure Services

### 3.1 PostgreSQL Database

```bash
# Check if PostgreSQL is running
docker exec a4co-preview-postgres pg_isready -U postgres

# Expected output: postgres:5432 - accepting connections
```

**Test database connection**:
```bash
docker exec -it a4co-preview-postgres psql -U postgres -c "SELECT version();"
```

**Verify databases were created**:
```bash
docker exec -it a4co-preview-postgres psql -U postgres -c "\l"
```

Expected databases:
- `auth_db`
- `order_db`
- `payment_db`
- `inventory_db`
- `product_db`

### 3.2 NATS Message Broker

```bash
# Check NATS health
curl http://localhost:8222/healthz

# Expected output: ok
```

**View NATS monitoring dashboard**:
- Open browser: http://localhost:8222
- Should show NATS server status

### 3.3 Redis Cache

```bash
# Test Redis connection
docker exec a4co-preview-redis redis-cli -a preview_redis_password ping

# Expected output: PONG
```

---

## 4. Verify Backend Services

### 4.1 API Gateway

```bash
# Health check
curl http://localhost:8080/api/v1/health

# Expected output: {"status":"ok"}
```

**Access Swagger documentation**:
- Open browser: http://localhost:8080/api/docs
- Should show API documentation

### 4.2 Auth Service

```bash
# Health check
curl http://localhost:4000/health

# Expected output: {"status":"ok"}
```

**Test registration** (if endpoint exists):
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

### 4.3 Order Service

```bash
# Health check
curl http://localhost:3000/health

# Expected output: {"status":"ok"}
```

### 4.4 Payment Service

```bash
# Health check
curl http://localhost:3001/health

# Expected output: {"status":"ok"}
```

### 4.5 Inventory Service

```bash
# Health check
curl http://localhost:3002/health

# Expected output: {"status":"ok"}
```

### 4.6 Product Service

```bash
# Health check
curl http://localhost:3003/health

# Expected output: {"status":"ok"}
```

---

## 5. Verify Frontend Applications

### 5.1 Dashboard Client (Next.js)

**Access the dashboard**:
```bash
# Open in browser
open http://localhost:3001

# Or test with curl
curl -I http://localhost:3001
```

**Expected**:
- ✅ Page loads successfully
- ✅ HTTP 200 status code
- ✅ No console errors in browser

**Check browser console**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for API connection attempts
4. Should see requests to `http://localhost:8080/api`

### 5.2 Main Frontend (Vite)

**Access the frontend**:
```bash
# Open in browser
open http://localhost:5173

# Or test with curl
curl -I http://localhost:5173
```

**Expected**:
- ✅ Page loads successfully
- ✅ HTTP 200 status code
- ✅ Vite development server running

---

## 6. Test Frontend-Backend Integration

### 6.1 Browser Network Inspection

1. **Open Dashboard**: http://localhost:3001
2. **Open DevTools**: Press F12
3. **Go to Network tab**
4. **Perform actions** on the dashboard (navigate, click buttons)
5. **Observe API calls**:
   - Should see requests to `http://localhost:8080/api/...`
   - Status codes should be 200 or expected codes
   - No CORS errors

### 6.2 CORS Verification

**Test CORS from browser console**:
```javascript
fetch('http://localhost:8080/api/v1/health')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

**Expected**:
- ✅ No CORS error
- ✅ Response received successfully
- ✅ Console shows: `Success: {status: "ok"}`

### 6.3 Authentication Flow Test

If authentication is implemented:

1. **Navigate to login page**
2. **Enter credentials**
3. **Submit login**
4. **Verify**:
   - API call to `/api/v1/auth/login`
   - Response contains JWT token
   - Token stored (localStorage/cookie)
   - Redirect to protected route

**Check with curl**:
```bash
# Login
TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.token')

# Use token for authenticated request
curl http://localhost:8080/api/v1/protected-route \
  -H "Authorization: Bearer $TOKEN"
```

### 6.4 Product Catalog Test

1. **Navigate to products page**
2. **Verify**:
   - Products load from API
   - Images display correctly
   - Pagination works
   - Search/filter works

**Check API directly**:
```bash
curl http://localhost:8080/api/v1/products

# Expected: JSON array of products
```

### 6.5 Order Creation Test

1. **Add product to cart**
2. **Proceed to checkout**
3. **Create order**
4. **Verify**:
   - Order API call succeeds
   - Order created in database
   - Payment service called
   - Inventory updated

**Monitor logs**:
```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f api-gateway order-service payment-service
```

Look for:
- Order creation event
- Payment processing
- Inventory reservation
- NATS message flow

---

## 7. Check Service Logs

### 7.1 View All Logs

```bash
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f
```

### 7.2 View Specific Service

```bash
# API Gateway
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f api-gateway

# Dashboard
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f dashboard-client

# Auth Service
docker compose -f docker-compose.preview.yml --env-file .env.preview logs -f auth-service
```

### 7.3 Check for Errors

```bash
# Search for errors in all logs
docker compose -f docker-compose.preview.yml --env-file .env.preview logs | grep -i error

# Search for warnings
docker compose -f docker-compose.preview.yml --env-file .env.preview logs | grep -i warn
```

---

## 8. Performance Testing

### 8.1 Response Time Test

```bash
# Test API Gateway response time
time curl http://localhost:8080/api/v1/health

# Should be < 100ms
```

### 8.2 Load Test (Optional)

Using Apache Bench:
```bash
# Install ab (if not installed)
sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8080/api/v1/health
```

**Expected**:
- Requests per second: > 100
- No failed requests
- 95th percentile < 200ms

---

## 9. Troubleshooting Common Issues

### Issue 1: Services Not Starting

**Symptoms**: Container exits immediately or shows unhealthy

**Solutions**:
```bash
# Check logs
docker logs a4co-preview-api-gateway

# Common issues:
# - Port already in use
# - Database connection failed
# - Missing environment variable

# Check if port is in use
netstat -tulpn | grep 8080

# Stop conflicting service
docker compose -f docker-compose.preview.yml --env-file .env.preview down
```

### Issue 2: Frontend Can't Connect to Backend

**Symptoms**: CORS errors, connection refused

**Solutions**:
```bash
# 1. Verify CORS configuration
cat .env.preview | grep CORS_ORIGIN

# Should include: http://localhost:3001,http://localhost:5173

# 2. Check API Gateway is running
curl http://localhost:8080/api/v1/health

# 3. Check browser console for exact error

# 4. Restart services
docker compose -f docker-compose.preview.yml --env-file .env.preview restart api-gateway
```

### Issue 3: Database Connection Errors

**Symptoms**: Services show database connection errors

**Solutions**:
```bash
# Check database is running
docker exec a4co-preview-postgres pg_isready

# Check connection string
cat .env.preview | grep DATABASE_URL

# Restart database
docker compose -f docker-compose.preview.yml --env-file .env.preview restart postgres

# Check database logs
docker logs a4co-preview-postgres
```

### Issue 4: 404 Not Found on API Calls

**Symptoms**: Frontend makes API calls but gets 404

**Solutions**:
```bash
# 1. Check API Gateway routes
docker logs a4co-preview-api-gateway | grep -i route

# 2. Test endpoint directly
curl http://localhost:8080/api/v1/health

# 3. Check service URLs in API Gateway config
docker exec a4co-preview-api-gateway env | grep SERVICE_URL
```

---

## 10. Success Criteria Checklist

Use this checklist to verify successful deployment:

### Infrastructure
- [ ] PostgreSQL running and accepting connections
- [ ] All databases created (auth, order, payment, inventory, product)
- [ ] NATS running and reachable
- [ ] Redis running and responsive

### Backend Services
- [ ] API Gateway responding (http://localhost:8080/api/v1/health)
- [ ] Auth Service healthy (http://localhost:4000/health)
- [ ] Order Service healthy (http://localhost:3000/health)
- [ ] Payment Service healthy (http://localhost:3001/health)
- [ ] Inventory Service healthy (http://localhost:3002/health)
- [ ] Product Service healthy (http://localhost:3003/health)

### Frontend Applications
- [ ] Dashboard Client loads (http://localhost:3001)
- [ ] Main Frontend loads (http://localhost:5173)
- [ ] No JavaScript errors in console
- [ ] API calls reach backend successfully

### Integration
- [ ] CORS working (no CORS errors)
- [ ] Authentication flow works
- [ ] Data flows from backend to frontend
- [ ] Forms submit successfully
- [ ] Service-to-service communication works
- [ ] NATS messaging working

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] No memory leaks
- [ ] No high CPU usage

---

## 11. Next Steps After Successful Testing

Once all tests pass:

1. **Document any issues found**
2. **Update configuration if needed**
3. **Plan production deployment**
4. **Complete [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md)**
5. **Set up monitoring and alerting**
6. **Prepare rollback plan**

---

## 12. Cleanup

When done testing:

```bash
# Stop all services
docker compose -f docker-compose.preview.yml --env-file .env.preview down

# Remove volumes (clean slate)
docker compose -f docker-compose.preview.yml --env-file .env.preview down -v

# Remove images (to rebuild from scratch)
docker compose -f docker-compose.preview.yml --env-file .env.preview down --rmi all
```

---

## Support

For issues or questions:
1. Check logs: `docker compose -f docker-compose.preview.yml --env-file .env.preview logs`
2. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Check [troubleshooting section](#9-troubleshooting-common-issues)
4. Open an issue on GitHub

---

**Testing Status**: ✅ Ready for Testing
**Last Updated**: 2026-01-04
**Version**: 1.0.0
