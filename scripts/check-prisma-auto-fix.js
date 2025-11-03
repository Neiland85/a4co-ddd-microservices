#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const servicesRoot = "apps";
const services = fs
  .readdirSync(servicesRoot)
  .filter((s) => fs.statSync(path.join(servicesRoot, s)).isDirectory());

console.log("🔍 Verificando integridad de Prisma Clients con auto-fix...\n");

for (const service of services) {
  const servicePath = path.join(servicesRoot, service);
  const prismaSchema = path.join(servicePath, "prisma/schema.prisma");
  const prismaClientPath = path.join(servicePath, "node_modules/@prisma/client/index.js");

  // Skip if no schema.prisma
  if (!fs.existsSync(prismaSchema)) {
    console.log(`⏩ ${service}: sin schema.prisma — omitido (no usa Prisma).`);
    continue;
  }

  try {
    if (!fs.existsSync(prismaClientPath)) {
      console.log(`⚠️  ${service}: Prisma Client no encontrado. Regenerando...`);
      execSync(`pnpm exec prisma generate --schema=${prismaSchema}`, { stdio: "inherit" });
    } else {
      // quick validation
      execSync(`node -e "import('@prisma/client').then(()=>process.exit(0)).catch(()=>process.exit(1))"`, {
        cwd: servicePath,
        stdio: "ignore"
      });
      console.log(`✅ ${service}: Prisma Client correcto.`);
    }
  } catch (error) {
    console.error(`❌ ${service}: Error al verificar o regenerar Prisma Client.`);
    console.error(error.message);
  }

  console.log("");
}

console.log("🎯 Verificación y auto-fix de Prisma completados ✅");

