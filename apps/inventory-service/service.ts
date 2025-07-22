export class InventoryService {
  updateStock(productId: string, quantity: number): string {
    return `Stock del producto ${productId} actualizado a ${quantity}.`;
  }

  getStock(productId: string): string {
    return `Stock actual del producto ${productId}.`;
  }
}
