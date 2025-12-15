import { Transportista } from '../aggregates/transportista.entity.js';

export interface TransportistaRepository {
  save(transportista: Transportista): Promise<Transportista>;
  findById(id: string): Promise<Transportista | null>;
  findByEmail(email: string): Promise<Transportista | null>;
  findActive(): Promise<Transportista[]>;
  findByServiceArea(area: string): Promise<Transportista[]>;
  findAll(): Promise<Transportista[]>;
  delete(id: string): Promise<void>;
}
