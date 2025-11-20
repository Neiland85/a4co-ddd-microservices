"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCheckInventoryResponseDto = exports.BulkCheckInventoryRequestDto = exports.InventoryItemDto = exports.ReleaseStockResponseDto = exports.ReleaseStockRequestDto = exports.ReserveStockResponseDto = exports.ReserveStockRequestDto = exports.CheckInventoryResponseDto = exports.CheckInventoryRequestDto = void 0;
const class_validator_1 = require("class-validator");
class CheckInventoryRequestDto {
}
exports.CheckInventoryRequestDto = CheckInventoryRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckInventoryRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CheckInventoryRequestDto.prototype, "quantity", void 0);
class CheckInventoryResponseDto {
}
exports.CheckInventoryResponseDto = CheckInventoryResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CheckInventoryResponseDto.prototype, "available", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CheckInventoryResponseDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CheckInventoryResponseDto.prototype, "reservedStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CheckInventoryResponseDto.prototype, "availableStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInventoryResponseDto.prototype, "message", void 0);
class ReserveStockRequestDto {
}
exports.ReserveStockRequestDto = ReserveStockRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReserveStockRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReserveStockRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReserveStockRequestDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReserveStockRequestDto.prototype, "customerId", void 0);
class ReserveStockResponseDto {
}
exports.ReserveStockResponseDto = ReserveStockResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReserveStockResponseDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReserveStockResponseDto.prototype, "reservationId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReserveStockResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReserveStockResponseDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReserveStockResponseDto.prototype, "reservedQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReserveStockResponseDto.prototype, "message", void 0);
class ReleaseStockRequestDto {
}
exports.ReleaseStockRequestDto = ReleaseStockRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReleaseStockRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReleaseStockRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReleaseStockRequestDto.prototype, "quantity", void 0);
class ReleaseStockResponseDto {
}
exports.ReleaseStockResponseDto = ReleaseStockResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReleaseStockResponseDto.prototype, "success", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReleaseStockResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReleaseStockResponseDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReleaseStockResponseDto.prototype, "releasedQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReleaseStockResponseDto.prototype, "message", void 0);
class InventoryItemDto {
}
exports.InventoryItemDto = InventoryItemDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InventoryItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryItemDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InventoryItemDto.prototype, "currentStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InventoryItemDto.prototype, "reservedStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InventoryItemDto.prototype, "availableStock", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InventoryItemDto.prototype, "status", void 0);
class BulkCheckInventoryRequestDto {
}
exports.BulkCheckInventoryRequestDto = BulkCheckInventoryRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], BulkCheckInventoryRequestDto.prototype, "items", void 0);
class BulkCheckInventoryResponseDto {
}
exports.BulkCheckInventoryResponseDto = BulkCheckInventoryResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkCheckInventoryResponseDto.prototype, "allAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkCheckInventoryResponseDto.prototype, "summary", void 0);
//# sourceMappingURL=inventory.dto.js.map