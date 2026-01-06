const fs = require('fs');
const path = require('path');

const root = process.cwd();

function findAllPackageJson(rootDir) {
  const results = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === '.git') continue;
        walk(full);
      } else if (ent.isFile() && ent.name === 'package.json') {
        results.push(full);
      }
    }
  }
  walk(rootDir);
  return results;
}

function loadPackageJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

const packageFiles = findAllPackageJson(root);
const nameToPath = new Map();
for (const f of packageFiles) {
  const pkg = loadPackageJson(f);
  if (pkg && pkg.name) {
    const dir = path.dirname(f);
    nameToPath.set(pkg.name, dir);
  }
}

let changed = 0;
for (const f of packageFiles) {
  const pkg = loadPackageJson(f);
  if (!pkg) continue;
  let modified = false;
  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const sec of sections) {
    if (!pkg[sec]) continue;
    for (const [dep, ver] of Object.entries(pkg[sec])) {
      if (ver === 'workspace:*' || ver === 'workspace:^' || ver === 'workspace:~') {
        const target = nameToPath.get(dep);
        if (target) {
          const rel = path.relative(path.dirname(f), target).replace(/\\/g, '/');
          pkg[sec][dep] = `file:${rel}`;
          modified = true;
          console.log(`${f}: ${dep} => file:${rel}`);
        } else {
          console.warn(`${f}: workspace dep ${dep} not found in workspace`);
        }
      }
    }
  }
  if (modified) {
    fs.writeFileSync(f, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    changed++;
  }
}
console.log(`Modified ${changed} package.json files.`);
process.exit(0);
