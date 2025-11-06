import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventPublisherService } from '../infrastructure/events/event-publisher.service';

@Injectable()
export class EventPublisherInterceptor implements NestInterceptor {
  constructor(private readonly eventPublisher: EventPublisherService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (result) => {
        // Si el resultado contiene eventos de dominio, publicarlos
        if (result && typeof result === 'object') {
          if (Array.isArray(result.domainEvents)) {
            await this.eventPublisher.publishEvents(result.domainEvents);
          } else if (result.domainEvents) {
            await this.eventPublisher.publishEvents([result.domainEvents]);
          }
        }
      }),
    );
  }
}
