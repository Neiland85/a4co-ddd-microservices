# --- A4CO Frontend (Vite) ---
FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install --filter frontend --frozen-lockfile=false

EXPOSE 3000

# Healthcheck — esperará a que Vite sirva en 3000
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=5 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["pnpm", "--filter", "frontend", "run", "dev"]
