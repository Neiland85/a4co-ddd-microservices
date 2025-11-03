import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './application/services/inventory.service';
import { CheckInventoryUseCase } from './application/use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';

@ApiTags('inventory')
@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkInventoryUseCase: CheckInventoryUseCase,
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseStockUseCase: ReleaseStockUseCase,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'inventory-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check inventory for a product' })
  @ApiResponse({ status: 200, description: 'Inventory details' })
  async checkInventory(@Param('productId') productId: string) {
    return this.checkInventoryUseCase.execute({ productId });
  }

  @Post('check/bulk')
  @ApiOperation({ summary: 'Check inventory for multiple products' })
  @ApiResponse({ status: 200, description: 'Bulk inventory details' })
  async bulkCheckInventory(@Body() body: { productIds: string[] }) {
    return this.checkInventoryUseCase.executeBulk({ productIds: body.productIds });
  }

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve stock for an order' })
  @ApiResponse({ status: 200, description: 'Stock reserved successfully' })
  @ApiResponse({ status: 409, description: 'Cannot reserve stock' })
  @ApiBearerAuth()
  async reserveStock(@Body() body: any) {
    const { productId, quantity, orderId, customerId, expiresAt } = body;
    return this.reserveStockUseCase.execute({
      productId,
      quantity,
      orderId,
      customerId,
      expiresAt: new Date(expiresAt),
    });
  }

  @Post('release')
  @ApiOperation({ summary: 'Release reserved stock' })
  @ApiResponse({ status: 200, description: 'Stock released successfully' })
  @ApiBearerAuth()
  async releaseStock(@Body() body: any) {
    const { productId, quantity, reason } = body;
    return this.releaseStockUseCase.execute({
      productId,
      quantity,
      reason,
    });
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getAllProducts() {
    return this.inventoryService.getAllProducts();
  }

  @Get('products/low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  async getLowStockProducts() {
    return this.inventoryService.getLowStockProducts();
  }

  @Get('products/out-of-stock')
  @ApiOperation({ summary: 'Get out of stock products' })
  async getOutOfStockProducts() {
    return this.inventoryService.getOutOfStockProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProductById(@Param('id') id: string) {
    const product = await this.inventoryService.getProductById(id);
    if (!product) {
      return { error: 'Product not found' };
    }
    return product;
  }
}

