// Declaraciones de tipos globales para el proyecto dashboard-web
import * as React from 'react';

// Ambiente global extendido para navegador y Node.js
declare global {
  // Browser globals
  interface Window {
    [key: string]: any;
  }
  
  // Console methods
  interface Console {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  }
  
  // Node.js globals para archivos de configuración
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: string | undefined;
    }
    
    interface Process {
      env: ProcessEnv;
    }
  }
  
  // Jest globals para tests
  interface Jest {
    fn(): any;
    mock(moduleName: string, implementation?: any): any;
  }
  
  // Repository interfaces para DDD
  interface UserRepositoryPort {
    findById(id: string): Promise<any>;
    save(user: any): Promise<any>;
    delete(id: string): Promise<void>;
  }
}

// Declaraciones de módulos locales
declare module '@/components/ProductCatalogSimple' {
  export function ProductCatalogV0(): React.JSX.Element;
}

declare module '@/components/MainNavigation' {
  export function MainNavigation(): React.JSX.Element;
}

declare module '@/components/theme-provider' {
  interface ThemeProviderProps {
    children: React.ReactNode;
  }
  export function ThemeProvider(props: ThemeProviderProps): React.JSX.Element;
}

// Extensión para Lucide React
declare module 'lucide-react' {
  interface IconProps {
    size?: number;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }
  
  export const ShoppingBag: React.ComponentType<IconProps>;
  export const Settings: React.ComponentType<IconProps>;
  export const Menu: React.ComponentType<IconProps>;
  export const X: React.ComponentType<IconProps>;
  export const ChevronDown: React.ComponentType<IconProps>;
  export const Home: React.ComponentType<IconProps>;
  export const Users: React.ComponentType<IconProps>;
  export const BarChart3: React.ComponentType<IconProps>;
  export const Shield: React.ComponentType<IconProps>;
  export const Clock: React.ComponentType<IconProps>;
  export const MessageSquare: React.ComponentType<IconProps>;
  export const Search: React.ComponentType<IconProps>;
  export const Filter: React.ComponentType<IconProps>;
  export const Star: React.ComponentType<IconProps>;
  export const ShoppingCart: React.ComponentType<IconProps>;
  export const Activity: React.ComponentType<IconProps>;
  export const Bell: React.ComponentType<IconProps>;
}
