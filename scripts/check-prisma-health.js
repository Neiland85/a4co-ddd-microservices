// scripts/check-prisma-health.js
import { execSync } from "child_process";
import fs from "fs";

const services = [
  "apps/product-service",
  "apps/inventory-service",
  "apps/order-service",
  "apps/payment-service"
];

console.log("🔍 Verificando integridad de Prisma Clients...\n");

for (const service of services) {
  const schemaPath = `${service}/prisma/schema.prisma`;
  const clientPath = `${service}/node_modules/@prisma/client/index.js`;

  if (!fs.existsSync(schemaPath)) {
    console.warn(`⚠️  ${service}: No se encontró schema.prisma`);
    continue;
  }

  if (!fs.existsSync(clientPath)) {
    console.log(`🧩 ${service}: Prisma Client faltante → regenerando...`);
    execSync(`pnpm exec prisma generate --schema=${schemaPath}`, {
      stdio: "inherit"
    });
  } else {
    console.log(`✅ ${service}: Prisma Client detectado correctamente.`);
  }
}

console.log("\n🎯 Verificación de Prisma completada ✅");

