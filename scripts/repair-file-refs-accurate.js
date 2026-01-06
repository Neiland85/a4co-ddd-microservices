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

function load(file){ try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e){ return null } }

const packageFiles = findAllPackageJson(root);
const nameToPath = new Map();
for (const f of packageFiles) {
  const pkg = load(f);
  if (pkg && pkg.name) {
    nameToPath.set(pkg.name, path.dirname(f));
  }
}

let changed = 0;
for (const f of packageFiles) {
  const pkg = load(f);
  if (!pkg) continue;
  let modified = false;
  for (const sec of ['dependencies','devDependencies','optionalDependencies','peerDependencies']) {
    if (!pkg[sec]) continue;
    for (const [dep, ver] of Object.entries(pkg[sec])) {
      if (typeof ver === 'string' && ver.startsWith('file:')) {
        const rel = ver.slice(5);
        const abs = path.resolve(path.dirname(f), rel);
        if (!fs.existsSync(abs)) {
          // try to find target by name
          const target = nameToPath.get(dep);
          if (target) {
            const newRel = path.relative(path.dirname(f), target).replace(/\\/g,'/');
            pkg[sec][dep] = `file:${newRel}`;
            modified = true;
            console.log(`${f}: fixed ${dep} -> file:${newRel}`);
          } else {
            console.warn(`${f}: cannot find workspace package for ${dep}`);
          }
        }
      }
    }
  }
  if (modified) {
    fs.writeFileSync(f, JSON.stringify(pkg,null,2)+'\n','utf8');
    changed++;
  }
}
console.log(`Done. Modified ${changed} files.`);
