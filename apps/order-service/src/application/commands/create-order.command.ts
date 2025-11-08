export class CreateOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly items: any[],
    public readonly total: number,
  ) {}
}
