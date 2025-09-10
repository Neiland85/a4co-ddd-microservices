// Utilidades para clases CSS
type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: any }
  | ClassValue[];

function handleObjectInput(input: Record<string, any>, classes: string[]): void {
  for (const [key, value] of Object.entries(input)) {
    if (value) classes.push(key);
  }
}

function handleArrayInput(input: ClassValue[], classes: string[]): void {
  const result = cn(...input);
  if (result) classes.push(result);
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object' && !Array.isArray(input)) {
      handleObjectInput(input, classes);
    } else if (Array.isArray(input)) {
      handleArrayInput(input, classes);
    }
  }

  // Eliminar duplicados y unir
  return [...new Set(classes)].join(' ');
}

// Utilidades adicionales para el proyecto
export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
