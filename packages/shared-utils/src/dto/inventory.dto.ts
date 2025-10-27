import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsUUID } from 'class-validator';

// INVENTORY SERVICE DTOs

export class CheckInventoryRequestDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CheckInventoryResponseDto {
  @IsBoolean()
  available: boolean;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsNumber()
  @Min(0)
  reservedStock: number;

  @IsNumber()
  @Min(0)
  availableStock: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class ReserveStockRequestDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  customerId?: string;
}

export class ReserveStockResponseDto {
  @IsBoolean()
  success: boolean;

  @IsUUID()
  reservationId: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  reservedQuantity: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class ReleaseStockRequestDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ReleaseStockResponseDto {
  @IsBoolean()
  success: boolean;

  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0)
  releasedQuantity: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class InventoryItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsNumber()
  @Min(0)
  reservedStock: number;

  @IsNumber()
  @Min(0)
  availableStock: number;

  @IsString()
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
}

export class BulkCheckInventoryRequestDto {
  @IsUUID(undefined, { each: true })
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export class BulkCheckInventoryResponseDto {
  @IsBoolean()
  allAvailable: boolean;

  items: Array<{
    productId: string;
    available: boolean;
    currentStock: number;
    availableStock: number;
    message?: string;
  }>;

  @IsOptional()
  @IsString()
  summary?: string;
}
