import { InventoryService } from './service';

export class InventoryController {
  private inventoryService = new InventoryService();

  updateStock(req: { productId: string; quantity: number }): string {
    return this.inventoryService.updateStock(req.productId, req.quantity);
  }

  getStock(req: { productId: string }): string {
    return this.inventoryService.getStock(req.productId);
  }
}
