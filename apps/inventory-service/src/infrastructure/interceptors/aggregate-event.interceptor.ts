import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AggregateEventPublisher } from '../infrastructure/events/aggregate-event-publisher.service';

@Injectable()
export class AggregateEventInterceptor implements NestInterceptor {
  constructor(private readonly eventPublisher: AggregateEventPublisher) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (result) => {
        // If the result is a Product aggregate, publish its events
        if (result && typeof result.getUncommittedEvents === 'function') {
          await this.eventPublisher.publishAggregateEvents(result);
        }
        // If the result is an array, check for aggregates
        if (Array.isArray(result)) {
          for (const item of result) {
            if (item && typeof item.getUncommittedEvents === 'function') {
              await this.eventPublisher.publishAggregateEvents(item);
            }
          }
        }
      })
    );
  }
}
