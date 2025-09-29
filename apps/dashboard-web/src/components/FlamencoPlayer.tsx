'use client';

interface FlamencoPlayerProps {
  className?: string;
}

export default function FlamencoPlayer({ className }: FlamencoPlayerProps) {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-gray-100 p-4 ${className}`}>
      <div className="text-center">
        <div className="mb-2 text-2xl">🎵</div>
        <p className="text-sm text-gray-600">Flamenco Player</p>
        <p className="text-xs text-gray-500">Componente placeholder</p>
      </div>
    </div>
  );
}
