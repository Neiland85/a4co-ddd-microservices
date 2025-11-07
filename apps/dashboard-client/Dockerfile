# --- A4CO Dashboard (Next.js 16 Turbopack) ---
FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install --filter dashboard-client --frozen-lockfile=false

EXPOSE 3001

# Healthcheck — esperará a que Next.js responda en 3001
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=5 \
  CMD wget -qO- http://localhost:3001/ || exit 1

CMD ["pnpm", "--filter", "dashboard-client", "run", "dev"]
