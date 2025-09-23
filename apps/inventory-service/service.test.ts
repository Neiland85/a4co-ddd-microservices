import { InventoryService } from './service';

describe('InventoryService', () => {
  let inventoryService: InventoryService;

  beforeEach(() => {
    inventoryService = new InventoryService();
  });

  it('should update stock', () => {
    const result = inventoryService.updateStock('product123', 50);
    expect(result).toBe('Inventory updated successfully: product123 to 50');
  });

  it('should get stock information', () => {
    const result = inventoryService.getStock('product123');
    expect(result).toBe('Inventory retrieved successfully: product123');
  });
});
