import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import { execSync } from 'child_process';

/**
 * Palabras base del usuario (VSCode global)
 */
const userDict = [
  'a4co',
  'DDD',
  'monorepo',
  'observabilidad',
  'loguear',
  'prisma',
  'nestjs',
  'microservicios',
  'TypeORM',
  'Prometheus',
  'Grafana',
  'DTO',
  'pnpm',
  'middleware',
  'esquema',
  'repositorio',
];

/**
 * Palabras base del workspace (proyecto)
 */
const workspaceDict = [
  'Saga',
  'NATS',
  'JetStream',
  'CQRS',
  'Prisma',
  'Hexagonal',
  'observabilidad',
  'PostgreSQL',
  'Prometheus',
  'Grafana',
  'Jaeger',
  'Loki',
];

/**
 * Rutas
 * ⚠️ Acceso seguro a process.env (TS 5.9 compatible)
 */
const userHome = process.env['HOME'] ?? '';

const userPath = path.join(userHome, 'Library/Application Support/Code/User/settings.json');

const workspacePath = path.resolve('.vscode/settings.json');
const mdOutputPath = path.resolve('docs/cspell-dictionary.md');

/**
 * Mergea palabras en un fichero JSON5 (VSCode settings)
 */
function mergeWords(filePath: string, words: string[], key = 'cSpell.words'): string[] {
  const added: string[] = [];

  if (!fs.existsSync(filePath)) return added;

  const raw = fs.readFileSync(filePath, 'utf8');
  let json: Record<string, unknown>;

  try {
    json = JSON5.parse(raw);
  } catch {
    return added;
  }

  const existing = Array.isArray((json as any)[key]) ? (json as any)[key] : [];
  const merged = new Set<string>([...existing, ...words]);

  const newWords = [...merged].filter((w) => !existing.includes(w));
  if (newWords.length > 0) added.push(...newWords);

  (json as any)[key] = Array.from(merged).sort();
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

  return added;
}

/**
 * Extrae palabras nuevas desde mensajes de commit recientes
 */
function extractNewWordsFromCommits(): string[] {
  try {
    const log = execSync('git log -10 --pretty=format:%B', {
      encoding: 'utf8',
    });

    const matches = log.match(/[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]{4,}/g) ?? [];

    const cleaned = matches
      .map((w) => w.trim())
      .filter(
        (w) =>
          w.length > 3 &&
          !/^(Merge|fix|feat|docs|style|chore|test|update|version|refactor)$/i.test(w),
      );

    return Array.from(new Set(cleaned.map((w) => w.toLowerCase())));
  } catch {
    return [];
  }
}

/**
 * Exporta resumen en Markdown (auditable)
 */
function exportMarkdownSummary(groups: { user: string[]; workspace: string[]; commits: string[] }) {
  const date = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
  });

  const header = `# Diccionario del Proyecto

Última sincronización: ${date}

---
`;

  const formatGroup = (title: string, words: string[]) => {
    if (!words.length) {
      return `### ${title}\nSin nuevas palabras.\n\n`;
    }

    const list = words.map((w) => `- ${w}`).join('\n');
    return `### ${title} (${words.length})\n${list}\n\n`;
  };

  const content =
    header +
    formatGroup('User (VSCode global)', groups.user) +
    formatGroup('Workspace (proyecto)', groups.workspace) +
    formatGroup('Commits recientes detectados', groups.commits);

  fs.mkdirSync(path.dirname(mdOutputPath), { recursive: true });
  fs.writeFileSync(mdOutputPath, content);
}

/**
 * Main
 */
(function main() {
  const commitWords = extractNewWordsFromCommits();

  const addedUser = mergeWords(userPath, [...userDict, ...commitWords]);

  const addedWorkspace = mergeWords(workspacePath, [...workspaceDict, ...commitWords]);

  exportMarkdownSummary({
    user: addedUser.sort(),
    workspace: addedWorkspace.sort(),
    commits: commitWords.sort(),
  });
})();
