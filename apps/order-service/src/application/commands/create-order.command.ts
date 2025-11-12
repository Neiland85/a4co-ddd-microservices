export class CreateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly items: Array<{ productId: string; quantity: number; unitPrice: number }>,
    public readonly total: number,
  ) {}
}
