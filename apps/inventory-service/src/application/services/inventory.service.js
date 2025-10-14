"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const check_inventory_use_case_1 = require("../use-cases/check-inventory.use-case");
const reserve_stock_use_case_1 = require("../use-cases/reserve-stock.use-case");
const release_stock_use_case_1 = require("../use-cases/release-stock.use-case");
class InventoryService {
    repository;
    checkInventoryUseCase;
    reserveStockUseCase;
    releaseStockUseCase;
    constructor(repository) {
        this.repository = repository;
        this.checkInventoryUseCase = new check_inventory_use_case_1.CheckInventoryUseCase(repository);
        this.reserveStockUseCase = new reserve_stock_use_case_1.ReserveStockUseCase(repository);
        this.releaseStockUseCase = new release_stock_use_case_1.ReleaseStockUseCase(repository);
    }
    async checkInventory(request) {
        return this.checkInventoryUseCase.execute(request);
    }
    async bulkCheckInventory(request) {
        return this.checkInventoryUseCase.executeBulk(request);
    }
    async reserveStock(request) {
        return this.reserveStockUseCase.execute(request);
    }
    async releaseStock(request) {
        return this.releaseStockUseCase.execute(request);
    }
    async getProductById(id) {
        return this.repository.findById(id);
    }
    async getAllProducts() {
        return this.repository.findAll();
    }
    async getLowStockProducts() {
        return this.repository.findLowStock();
    }
    async getOutOfStockProducts() {
        return this.repository.findOutOfStock();
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map