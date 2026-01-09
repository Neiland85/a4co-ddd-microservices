const fs = require('fs');
const path = require('path');

function findAllPackageJson(root) {
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
  walk(root);
  return results;
}

const root = process.cwd();
const files = findAllPackageJson(root);
let changed = 0;
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  let mod = false;
  for (const sec of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ]) {
    if (!j[sec]) continue;
    for (const [k, v] of Object.entries(j[sec])) {
      if (k.startsWith('@a4co/') && typeof v === 'string' && v.startsWith('file:')) {
        j[sec][k] = 'workspace:*';
        mod = true;
        console.log(`${f}: ${k} -> workspace:*`);
      }
    }
  }
  if (mod) {
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n', 'utf8');
    changed++;
  }
}
console.log('done', changed);
