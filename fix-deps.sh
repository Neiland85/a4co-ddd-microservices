#!/usr/bin/env bash
set -e

echo "🛠  A4CO – Fix de dependencias compartidas"

# 1️⃣ Ir a la raíz del monorepo
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "📦 Instalando dependencias runtime en el workspace..."
pnpm add -Dw \
  class-validator \
  class-transformer \
  axios \
  micromatch \
  express \
  jsdom

echo "📘 Instalando tipos de desarrollo..."
pnpm add -D -w \
  @types/express \
  @types/jsdom \
  @types/micromatch

# 2️⃣ Reescribir tsconfig del package @a4co/shared-utils
echo "🧩 Corrigiendo tsconfig de packages/shared-utils..."
cat << 'TSCFG' > packages/shared-utils/tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "es2022",
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "strictPropertyInitialization": false,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": [
    "src/index.ts",
    "src/events/**/*.ts"
  ],
  "exclude": [
    "**/__tests__/**",
    "**/*.test.ts",
    "src/api-clients/**",
    "src/components/**",
    "src/dto/**",
    "src/

# 3️⃣ Reescribir package.json de @a4co/shared-utils
echo "📦 Asegurando package.json correcto en packages/shared-utils..."
cat << 'PKG' > packages/shared-utils/package.json
{
  "name": "@a4co/shared-utils",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "nats": "^2.15.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/common": "^10.3.2",
    "typescript": "^5.6.3"
  }
}
PKG

# 4️⃣ Reinstalar y compilar
echo "📥 Instalando todo..."
pnpm install

echo "🏗️ Compilando @a4co/shared-utils..."
pnpm --filter @a4co/shared-utils run build

echo "✅ Fix de dependencias completado."
