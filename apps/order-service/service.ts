export class OrderService {
  createOrder(orderId: string, items: string[]): string {
    return `Orden ${orderId} creada con los siguientes ítems: ${items.join(', ')}.`;
  }

  getOrder(orderId: string): string {
    return `Información de la orden ${orderId}.`;
  }
}
