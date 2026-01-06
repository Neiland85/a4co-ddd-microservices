export class NotificationEntity {
  id: string;
  orderId: string;
  customerId: string;
  correlationId: string;
  eventType: string;
  channel: string;
  recipient: string;
  subject?: string;
  content: string;
  status: string;
  errorMessage?: string;
  attempts: number;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
