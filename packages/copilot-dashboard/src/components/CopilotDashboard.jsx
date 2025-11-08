import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

const shortcuts = [
  { label: 'Revisar UI', command: '✦ revisar-ui', role: 'frontend' },
  { label: 'Hook API', command: '✦ hook-api', role: 'frontend' },
  { label: 'Lazy Component', command: '✦ lazy-component', role: 'frontend' },
  { label: 'Animaciones Tailwind', command: '✦ animate-tailwind', role: 'frontend' },
  { label: 'DTO limpio', command: '✦ dto-clean', role: 'backend' },
  { label: 'Handler SRP', command: '✦ handler-srp', role: 'backend' },
  { label: 'Prisma Schema', command: '✦ prisma-schema', role: 'backend' },
  { label: 'Endpoint seguro', command: '✦ secure-endpoint', role: 'backend' },
  { label: 'Pipeline Deploy', command: '✦ deploy-pipeline', role: 'devops' },
  { label: 'Docker Healthcheck', command: '✦ docker-health', role: 'devops' },
  { label: 'Escalado ECS', command: '✦ ecs-scale-check', role: 'devops' },
  { label: 'Test unitario', command: '✦ test-unit', role: 'qa' },
  { label: 'Test E2E', command: '✦ test-e2e', role: 'qa' },
  { label: 'Test UI', command: '✦ test-ui', role: 'qa' },
  { label: 'Cobertura', command: '✦ test-coverage-check', role: 'qa' },
  { label: 'Refactor', command: '✦ refactor-mejorar', role: 'review' },
  { label: 'Revisión de errores', command: '✦ revisar-errores', role: 'review' },
  { label: 'Documentar', command: '✦ doc-export', role: 'review' },
  { label: 'Generar ADR', command: '✦ generar-adr', role: 'review' },
];

export default function CopilotDashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = shortcuts.filter(({ label, command, role }) => {
    const matchesQuery =
      label.toLowerCase().includes(query.toLowerCase()) ||
      command.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || role === filter;
    return matchesQuery && matchesFilter;
  });

  const handleCopy = command => {
    navigator.clipboard.writeText(command);
  };

  const roles = ['all', 'frontend', 'backend', 'devops', 'qa', 'review'];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">💬 Copilot Prompts Dashboard</h1>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar comando..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {roles.map(r => (
            <Button
              key={r}
              variant={filter === r ? 'default' : 'outline'}
              onClick={() => setFilter(r)}
            >
              {r === 'all' ? 'Todos' : r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[70vh] rounded-md border">
        <div className="grid grid-cols-2 gap-4 p-4">
          {filtered.map(({ label, command, role }) => (
            <Card key={label} className="transition-shadow hover:shadow-xl">
              <CardContent className="flex flex-col gap-2 p-4">
                <span className="text-lg font-semibold">{label}</span>
                <code className="bg-muted rounded p-2 text-sm">{command}</code>
                <Button variant="outline" onClick={() => handleCopy(command)}>
                  Copiar comando
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
