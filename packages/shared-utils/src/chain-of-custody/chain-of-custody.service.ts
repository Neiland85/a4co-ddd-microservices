import {
  ChainOfCustodyEvent,
  ChainOfCustodyEventType,
  CreateChainOfCustodyEventDto,
} from './chain-of-custody-event.types';

export interface IChainOfCustodyRepository {
  create(dto: CreateChainOfCustodyEventDto): Promise<ChainOfCustodyEvent>;
  findAll(): Promise<ChainOfCustodyEvent[]>;
  findByUserId(userId: string): Promise<ChainOfCustodyEvent[]>;
  findByEventType(eventType: ChainOfCustodyEventType): Promise<ChainOfCustodyEvent[]>;
  findById(id: string): Promise<ChainOfCustodyEvent | null>;
}

/**
 * ChainOfCustodyService
 *
 * Append-only audit trail for evidence lifecycle events.
 * Records are immutable once created: no update or delete operations are exposed.
 */
export class ChainOfCustodyService {
  constructor(private readonly repository: IChainOfCustodyRepository) {}

  /**
   * Record a new chain-of-custody event.
   * userId and eventType are required; timestamp is set automatically.
   */
  async record(dto: CreateChainOfCustodyEventDto): Promise<ChainOfCustodyEvent> {
    if (!dto.userId || dto.userId.trim() === '') {
      throw new Error('userId is required');
    }
    if (!dto.eventType) {
      throw new Error('eventType is required');
    }
    return this.repository.create(dto);
  }

  async findAll(): Promise<ChainOfCustodyEvent[]> {
    return this.repository.findAll();
  }

  async findByUserId(userId: string): Promise<ChainOfCustodyEvent[]> {
    if (!userId || userId.trim() === '') {
      throw new Error('userId is required');
    }
    return this.repository.findByUserId(userId);
  }

  async findByEventType(eventType: ChainOfCustodyEventType): Promise<ChainOfCustodyEvent[]> {
    return this.repository.findByEventType(eventType);
  }

  async findById(id: string): Promise<ChainOfCustodyEvent | null> {
    return this.repository.findById(id);
  }
}
