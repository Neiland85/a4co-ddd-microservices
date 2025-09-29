import { Injectable } from '@nestjs/common';
import { FLAGS_CONFIG } from './flags.config';

@Injectable()
export class FeatureFlagService {
  private flags: Map<string, boolean> = new Map();

  constructor() {
    this.initializeFlags();
  }

  private initializeFlags() {
    // En producción, esto vendría de una base de datos o servicio externo
    Object.entries(FLAGS_CONFIG).forEach(([key, config]) => {
      this.flags.set(key, process.env.NODE_ENV === 'production' ?
        config.production : config.development);
    });
  }

  isEnabled(flagName: string): boolean {
    return this.flags.get(flagName) ?? false;
  }

  getAllFlags(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    this.flags.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Método para toggles administrativos
  toggleFlag(flagName: string, enabled: boolean): void {
    if (this.flags.has(flagName)) {
      this.flags.set(flagName, enabled);
      console.log(`🚩 Feature flag '${flagName}' ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}
