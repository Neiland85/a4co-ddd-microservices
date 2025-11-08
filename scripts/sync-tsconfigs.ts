import fs from "fs";
import path from "path";

const root = process.cwd();

const backendTemplate = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    target: "ES2022",
    module: "NodeNext",
    moduleResolution: "NodeNext",
    declaration: true,
    declarationMap: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    useDefineForClassFields: false,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    strictPropertyInitialization: false,
    skipLibCheck: true,
    resolveJsonModule: true,
    outDir: "dist",
    rootDir: "src",
    types: ["node", "reflect-metadata"],
    lib: ["ES2022", "DOM"],
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"],
      "@a4co/shared-utils": ["../shared-utils/src"],
      "@a4co/shared-utils/*": ["../shared-utils/src/*"]
    }
  },
  include: ["src/**/*.ts"],
  exclude: [
    "**/__tests__/**",
    "**/*.spec.ts",
    "**/*.test.ts",
    "dist",
    "node_modules"
  ]
};

const frontendTemplate = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    target: "ES2022",
    lib: ["DOM", "DOM.Iterable", "ESNext"],
    jsx: "react-jsx",
    module: "ESNext",
    moduleResolution: "Bundler",
    allowJs: true,
    resolveJsonModule: true,
    isolatedModules: true,
    incremental: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./*"],
      "@a4co/shared-utils": ["../../packages/shared-utils/src"],
      "@a4co/design-system": ["../../packages/design-system/src"]
    },
    plugins: [{ name: "next" }]
  },
  include: [
    "next-env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    ".next/types/**/*.ts"
  ],
  exclude: ["node_modules", "dist", "coverage"]
};

function detectProjectType(dir: string): "backend" | "frontend" | null {
  const pkgPath = path.join(dir, "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.dependencies?.next || pkg.devDependencies?.next) return "frontend";
  if (pkg.dependencies?.["@nestjs/core"]) return "backend";
  if (pkg.name?.includes("service")) return "backend";
  if (pkg.name?.includes("dashboard")) return "frontend";
  return null;
}

function writeConfig(dir: string, type: "backend" | "frontend") {
  const config = type === "backend" ? backendTemplate : frontendTemplate;
  const filePath = path.join(dir, "tsconfig.json");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n");
  console.log(`✅ Updated ${type.toUpperCase()} tsconfig: ${filePath}`);
}

function scanRepo() {
  const appsDir = path.join(root, "apps");
  const packagesDir = path.join(root, "packages");

  const dirs = [appsDir, packagesDir].flatMap((base) =>
    fs.existsSync(base)
      ? fs.readdirSync(base).map((d) => path.join(base, d))
      : []
  );

  for (const dir of dirs) {
    if (!fs.statSync(dir).isDirectory()) continue;
    const type = detectProjectType(dir);
    if (type) writeConfig(dir, type);
  }
}

console.log("🔧 Synchronizing TypeScript configs across monorepo...");
scanRepo();
console.log("🎯 All tsconfig.json files are now aligned.");

