# 🧩 A4CO CI/CD Pipeline Guide

This document describes the Continuous Integration and Deployment (CI/CD) process for the **A4CO-DDD-Microservices** monorepo, powered by **GitHub Actions** and **GitHub Container Registry (GHCR)**.

---

## 🚀 Overview

The pipeline automatically builds and publishes Docker images for the following applications:

- **Frontend (Vite)**
- **Dashboard Client (Next.js 16 Turbopack)**

Both images are built using multi-stage Dockerfiles (`Dockerfile.prod`) and pushed to:

""ghcr.io/Neiland85/a4co-ddd-microservices/frontend:<tag>
ghcr.io/Neiland85/a4co-ddd-microservices/dashboard:<tag>""


---

## 🧱 Workflow Files

| File | Description |
|------|--------------|
| `.github/workflows/build-and-publish.yml` | Main CI/CD workflow for Docker builds |
| `apps/frontend/Dockerfile.prod` | Production Dockerfile for the Vite frontend |
| `apps/dashboard-client/Dockerfile.prod` | Production Dockerfile for the Next.js dashboard |
| `infra/docker/docker-compose.prod.yml` | Combined production stack (frontend + dashboard + nginx) |
| `infra/docker/nginx.prod.conf` | NGINX reverse proxy configuration for routing |

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

