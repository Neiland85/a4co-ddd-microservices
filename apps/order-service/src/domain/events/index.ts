export class OrderCreatedEvent {
  constructor(public readonly orderId: string, public readonly items: any[]) {}
}

export class OrderCancelledEvent {
  constructor(public readonly orderId: string) {}
}

export class PaymentSucceededEvent {
  constructor(public readonly orderId: string, public readonly paymentId: string) {}
}

export class PaymentFailedEvent {
  constructor(public readonly orderId: string, public readonly reason: string) {}
}
