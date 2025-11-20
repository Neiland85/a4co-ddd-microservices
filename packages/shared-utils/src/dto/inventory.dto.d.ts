export declare class CheckInventoryRequestDto {
    productId: string;
    quantity: number;
}
export declare class CheckInventoryResponseDto {
    available: boolean;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    message?: string;
}
export declare class ReserveStockRequestDto {
    orderId: string;
    productId: string;
    quantity: number;
    customerId?: string;
}
export declare class ReserveStockResponseDto {
    success: boolean;
    reservationId: string;
    orderId: string;
    productId: string;
    reservedQuantity: number;
    message?: string;
}
export declare class ReleaseStockRequestDto {
    orderId: string;
    productId: string;
    quantity: number;
}
export declare class ReleaseStockResponseDto {
    success: boolean;
    orderId: string;
    productId: string;
    releasedQuantity: number;
    message?: string;
}
export declare class InventoryItemDto {
    productId: string;
    productName: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
}
export declare class BulkCheckInventoryRequestDto {
    items: Array<{
        productId: string;
        quantity: number;
    }>;
}
export declare class BulkCheckInventoryResponseDto {
    allAvailable: boolean;
    items: Array<{
        productId: string;
        available: boolean;
        currentStock: number;
        availableStock: number;
        message?: string;
    }>;
    summary?: string;
}
//# sourceMappingURL=inventory.dto.d.ts.map