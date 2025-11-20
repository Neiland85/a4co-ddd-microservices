# 🧩 A4CO CI/CD Pipeline Guide

This document describes the Continuous Integration and Deployment (CI/CD) process for the
**A4CO-DDD-Microservices** monorepo, powered by **GitHub Actions**.

---

## 🚀 Overview

The pipeline automatically builds and publishes Docker images for the following applications:

- **Frontend (Vite)**
- **Dashboard Client (Next.js 16 Turbopack)**

Both images are built using multi-stage Dockerfiles (`Dockerfile.prod`) and pushed to:

- `ghcr.io/Neiland85/a4co-ddd-microservices/frontend:<tag>`
- `ghcr.io/Neiland85/a4co-ddd-microservices/dashboard:<tag>`

---

## 🧱 Workflow Files

| File | Description |
| ---- | ----------- |
| `.github/workflows/ci.yml` | Main CI workflow for linting, testing and building |
| `.github/workflows/deploy-production.yml` | Production deployment workflow |
| `apps/*/Dockerfile.prod` | Production Dockerfiles for each service |

---

## 🛠️ Manual Execution (workflow_dispatch)

You can trigger the workflow manually from GitHub:

1. Go to **Actions → Build & Publish CI/CD**  
2. Click **"Run workflow"**  
3. Select:
   - **Branch:** `ci/github-actions` (for development)  
   - **Tag:** optional (e.g. `v0.3.0-ci` or `dev`)  

This will trigger the full pipeline and publish the Docker images.

---

## 🧪 Local Testing

You can build and test the images locally before pushing to GHCR:

```bash
# Build frontend image
docker build -t a4co/frontend:local -f apps/frontend/Dockerfile.prod .

# Build dashboard image
docker build -t a4co/dashboard:local -f apps/dashboard-client/Dockerfile.prod .

# Run locally using docker-compose
docker compose -f infra/docker/docker-compose.prod.yml up
