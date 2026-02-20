import {
  ChainOfCustodyService,
  IChainOfCustodyRepository,
} from '../chain-of-custody.service';
import {
  ChainOfCustodyEvent,
  ChainOfCustodyEventType,
  CreateChainOfCustodyEventDto,
} from '../chain-of-custody-event.types';

class InMemoryChainOfCustodyRepository implements IChainOfCustodyRepository {
  private readonly events: ChainOfCustodyEvent[] = [];
  private nextId = 1;

  async create(dto: CreateChainOfCustodyEventDto): Promise<ChainOfCustodyEvent> {
    const event: ChainOfCustodyEvent = {
      id: String(this.nextId++),
      eventType: dto.eventType,
      userId: dto.userId,
      metadata: dto.metadata ?? null,
      timestamp: new Date(),
    };
    this.events.push(event);
    return event;
  }

  async findAll(): Promise<ChainOfCustodyEvent[]> {
    return [...this.events];
  }

  async findByUserId(userId: string): Promise<ChainOfCustodyEvent[]> {
    return this.events.filter((e) => e.userId === userId);
  }

  async findByEventType(eventType: ChainOfCustodyEventType): Promise<ChainOfCustodyEvent[]> {
    return this.events.filter((e) => e.eventType === eventType);
  }

  async findById(id: string): Promise<ChainOfCustodyEvent | null> {
    return this.events.find((e) => e.id === id) ?? null;
  }
}

describe('ChainOfCustodyService', () => {
  let service: ChainOfCustodyService;
  let repository: InMemoryChainOfCustodyRepository;

  beforeEach(() => {
    repository = new InMemoryChainOfCustodyRepository();
    service = new ChainOfCustodyService(repository);
  });

  describe('record', () => {
    it('should create an event with all required fields', async () => {
      const event = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED,
        userId: 'user-1',
      });

      expect(event.id).toBeDefined();
      expect(event.eventType).toBe(ChainOfCustodyEventType.EVIDENCE_UPLOADED);
      expect(event.userId).toBe('user-1');
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should record all supported event types', async () => {
      const eventTypes = Object.values(ChainOfCustodyEventType);
      for (const eventType of eventTypes) {
        const event = await service.record({ eventType, userId: 'user-1' });
        expect(event.eventType).toBe(eventType);
      }
    });

    it('should store optional metadata when provided', async () => {
      const metadata = { hash: 'abc123', algorithm: 'SHA-256' };
      const event = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_HASHED,
        userId: 'user-2',
        metadata,
      });

      expect(event.metadata).toEqual(metadata);
    });

    it('should throw when userId is missing', async () => {
      await expect(
        service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_ACCESSED, userId: '' }),
      ).rejects.toThrow('userId is required');
    });

    it('should throw when userId is blank whitespace', async () => {
      await expect(
        service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_EXPORTED, userId: '   ' }),
      ).rejects.toThrow('userId is required');
    });

    it('should throw when eventType is missing', async () => {
      await expect(
        service.record({ eventType: undefined as unknown as ChainOfCustodyEventType, userId: 'u1' }),
      ).rejects.toThrow('eventType is required');
    });

    it('should be append-only: does not expose update or delete operations', () => {
      expect((service as any).update).toBeUndefined();
      expect((service as any).delete).toBeUndefined();
      expect((service as any).remove).toBeUndefined();
      expect((service as any).patch).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all recorded events', async () => {
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED, userId: 'u1' });
      await service.record({ eventType: ChainOfCustodyEventType.REPORT_GENERATED, userId: 'u2' });

      const all = await service.findAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no events exist', async () => {
      const all = await service.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('findByUserId', () => {
    it('should return only events for the specified user', async () => {
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED, userId: 'u1' });
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_HASHED, userId: 'u2' });
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_ACCESSED, userId: 'u1' });

      const events = await service.findByUserId('u1');
      expect(events).toHaveLength(2);
      expect(events.every((e) => e.userId === 'u1')).toBe(true);
    });

    it('should throw when userId is empty', async () => {
      await expect(service.findByUserId('')).rejects.toThrow('userId is required');
    });
  });

  describe('findByEventType', () => {
    it('should return events matching the given event type', async () => {
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED, userId: 'u1' });
      await service.record({ eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED, userId: 'u2' });
      await service.record({ eventType: ChainOfCustodyEventType.REPORT_GENERATED, userId: 'u3' });

      const uploaded = await service.findByEventType(ChainOfCustodyEventType.EVIDENCE_UPLOADED);
      expect(uploaded).toHaveLength(2);
      expect(uploaded.every((e) => e.eventType === ChainOfCustodyEventType.EVIDENCE_UPLOADED)).toBe(
        true,
      );
    });
  });

  describe('findById', () => {
    it('should return the event with the given id', async () => {
      const created = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_EXPORTED,
        userId: 'u1',
      });

      const found = await service.findById(created.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });

    it('should return null for an unknown id', async () => {
      const found = await service.findById('nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('immutability', () => {
    it('should preserve the original timestamp after multiple records', async () => {
      const first = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED,
        userId: 'u1',
      });
      await new Promise((r) => setTimeout(r, 5));
      const second = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_HASHED,
        userId: 'u1',
      });

      expect(second.timestamp.getTime()).toBeGreaterThanOrEqual(first.timestamp.getTime());
    });

    it('each event has a unique id', async () => {
      const e1 = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED,
        userId: 'u1',
      });
      const e2 = await service.record({
        eventType: ChainOfCustodyEventType.EVIDENCE_UPLOADED,
        userId: 'u1',
      });

      expect(e1.id).not.toBe(e2.id);
    });
  });
});
