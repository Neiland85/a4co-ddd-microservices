"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCheckInventoryResponseDto = exports.BulkCheckInventoryRequestDto = exports.InventoryItemDto = exports.ReleaseStockResponseDto = exports.ReleaseStockRequestDto = exports.ReserveStockResponseDto = exports.ReserveStockRequestDto = exports.CheckInventoryResponseDto = exports.CheckInventoryRequestDto = void 0;
const class_validator_1 = require("class-validator");
let CheckInventoryRequestDto = (() => {
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    return class CheckInventoryRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        productId = __runInitializers(this, _productId_initializers, void 0);
        quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
        constructor() {
            __runInitializers(this, _quantity_extraInitializers);
        }
    };
})();
exports.CheckInventoryRequestDto = CheckInventoryRequestDto;
let CheckInventoryResponseDto = (() => {
    let _available_decorators;
    let _available_initializers = [];
    let _available_extraInitializers = [];
    let _currentStock_decorators;
    let _currentStock_initializers = [];
    let _currentStock_extraInitializers = [];
    let _reservedStock_decorators;
    let _reservedStock_initializers = [];
    let _reservedStock_extraInitializers = [];
    let _availableStock_decorators;
    let _availableStock_initializers = [];
    let _availableStock_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class CheckInventoryResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _available_decorators = [(0, class_validator_1.IsBoolean)()];
            _currentStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _reservedStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _availableStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _available_decorators, { kind: "field", name: "available", static: false, private: false, access: { has: obj => "available" in obj, get: obj => obj.available, set: (obj, value) => { obj.available = value; } }, metadata: _metadata }, _available_initializers, _available_extraInitializers);
            __esDecorate(null, null, _currentStock_decorators, { kind: "field", name: "currentStock", static: false, private: false, access: { has: obj => "currentStock" in obj, get: obj => obj.currentStock, set: (obj, value) => { obj.currentStock = value; } }, metadata: _metadata }, _currentStock_initializers, _currentStock_extraInitializers);
            __esDecorate(null, null, _reservedStock_decorators, { kind: "field", name: "reservedStock", static: false, private: false, access: { has: obj => "reservedStock" in obj, get: obj => obj.reservedStock, set: (obj, value) => { obj.reservedStock = value; } }, metadata: _metadata }, _reservedStock_initializers, _reservedStock_extraInitializers);
            __esDecorate(null, null, _availableStock_decorators, { kind: "field", name: "availableStock", static: false, private: false, access: { has: obj => "availableStock" in obj, get: obj => obj.availableStock, set: (obj, value) => { obj.availableStock = value; } }, metadata: _metadata }, _availableStock_initializers, _availableStock_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        available = __runInitializers(this, _available_initializers, void 0);
        currentStock = (__runInitializers(this, _available_extraInitializers), __runInitializers(this, _currentStock_initializers, void 0));
        reservedStock = (__runInitializers(this, _currentStock_extraInitializers), __runInitializers(this, _reservedStock_initializers, void 0));
        availableStock = (__runInitializers(this, _reservedStock_extraInitializers), __runInitializers(this, _availableStock_initializers, void 0));
        message = (__runInitializers(this, _availableStock_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.CheckInventoryResponseDto = CheckInventoryResponseDto;
let ReserveStockRequestDto = (() => {
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    return class ReserveStockRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _customerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        orderId = __runInitializers(this, _orderId_initializers, void 0);
        productId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
        quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
        customerId = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
        constructor() {
            __runInitializers(this, _customerId_extraInitializers);
        }
    };
})();
exports.ReserveStockRequestDto = ReserveStockRequestDto;
let ReserveStockResponseDto = (() => {
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _reservationId_decorators;
    let _reservationId_initializers = [];
    let _reservationId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _reservedQuantity_decorators;
    let _reservedQuantity_initializers = [];
    let _reservedQuantity_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class ReserveStockResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, class_validator_1.IsBoolean)()];
            _reservationId_decorators = [(0, class_validator_1.IsUUID)()];
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _reservedQuantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _reservationId_decorators, { kind: "field", name: "reservationId", static: false, private: false, access: { has: obj => "reservationId" in obj, get: obj => obj.reservationId, set: (obj, value) => { obj.reservationId = value; } }, metadata: _metadata }, _reservationId_initializers, _reservationId_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _reservedQuantity_decorators, { kind: "field", name: "reservedQuantity", static: false, private: false, access: { has: obj => "reservedQuantity" in obj, get: obj => obj.reservedQuantity, set: (obj, value) => { obj.reservedQuantity = value; } }, metadata: _metadata }, _reservedQuantity_initializers, _reservedQuantity_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        success = __runInitializers(this, _success_initializers, void 0);
        reservationId = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _reservationId_initializers, void 0));
        orderId = (__runInitializers(this, _reservationId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        productId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
        reservedQuantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _reservedQuantity_initializers, void 0));
        message = (__runInitializers(this, _reservedQuantity_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.ReserveStockResponseDto = ReserveStockResponseDto;
let ReleaseStockRequestDto = (() => {
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    return class ReleaseStockRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        orderId = __runInitializers(this, _orderId_initializers, void 0);
        productId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
        quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
        constructor() {
            __runInitializers(this, _quantity_extraInitializers);
        }
    };
})();
exports.ReleaseStockRequestDto = ReleaseStockRequestDto;
let ReleaseStockResponseDto = (() => {
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _releasedQuantity_decorators;
    let _releasedQuantity_initializers = [];
    let _releasedQuantity_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class ReleaseStockResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, class_validator_1.IsBoolean)()];
            _orderId_decorators = [(0, class_validator_1.IsUUID)()];
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _releasedQuantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _releasedQuantity_decorators, { kind: "field", name: "releasedQuantity", static: false, private: false, access: { has: obj => "releasedQuantity" in obj, get: obj => obj.releasedQuantity, set: (obj, value) => { obj.releasedQuantity = value; } }, metadata: _metadata }, _releasedQuantity_initializers, _releasedQuantity_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        success = __runInitializers(this, _success_initializers, void 0);
        orderId = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
        productId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
        releasedQuantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _releasedQuantity_initializers, void 0));
        message = (__runInitializers(this, _releasedQuantity_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.ReleaseStockResponseDto = ReleaseStockResponseDto;
let InventoryItemDto = (() => {
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _productName_decorators;
    let _productName_initializers = [];
    let _productName_extraInitializers = [];
    let _currentStock_decorators;
    let _currentStock_initializers = [];
    let _currentStock_extraInitializers = [];
    let _reservedStock_decorators;
    let _reservedStock_initializers = [];
    let _reservedStock_extraInitializers = [];
    let _availableStock_decorators;
    let _availableStock_initializers = [];
    let _availableStock_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return class InventoryItemDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsUUID)()];
            _productName_decorators = [(0, class_validator_1.IsString)()];
            _currentStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _reservedStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _availableStock_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _status_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: obj => "productName" in obj, get: obj => obj.productName, set: (obj, value) => { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
            __esDecorate(null, null, _currentStock_decorators, { kind: "field", name: "currentStock", static: false, private: false, access: { has: obj => "currentStock" in obj, get: obj => obj.currentStock, set: (obj, value) => { obj.currentStock = value; } }, metadata: _metadata }, _currentStock_initializers, _currentStock_extraInitializers);
            __esDecorate(null, null, _reservedStock_decorators, { kind: "field", name: "reservedStock", static: false, private: false, access: { has: obj => "reservedStock" in obj, get: obj => obj.reservedStock, set: (obj, value) => { obj.reservedStock = value; } }, metadata: _metadata }, _reservedStock_initializers, _reservedStock_extraInitializers);
            __esDecorate(null, null, _availableStock_decorators, { kind: "field", name: "availableStock", static: false, private: false, access: { has: obj => "availableStock" in obj, get: obj => obj.availableStock, set: (obj, value) => { obj.availableStock = value; } }, metadata: _metadata }, _availableStock_initializers, _availableStock_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        productId = __runInitializers(this, _productId_initializers, void 0);
        productName = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _productName_initializers, void 0));
        currentStock = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _currentStock_initializers, void 0));
        reservedStock = (__runInitializers(this, _currentStock_extraInitializers), __runInitializers(this, _reservedStock_initializers, void 0));
        availableStock = (__runInitializers(this, _reservedStock_extraInitializers), __runInitializers(this, _availableStock_initializers, void 0));
        status = (__runInitializers(this, _availableStock_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        constructor() {
            __runInitializers(this, _status_extraInitializers);
        }
    };
})();
exports.InventoryItemDto = InventoryItemDto;
let BulkCheckInventoryRequestDto = (() => {
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    return class BulkCheckInventoryRequestDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [(0, class_validator_1.IsUUID)(undefined, { each: true })];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        items = __runInitializers(this, _items_initializers, void 0);
        constructor() {
            __runInitializers(this, _items_extraInitializers);
        }
    };
})();
exports.BulkCheckInventoryRequestDto = BulkCheckInventoryRequestDto;
let BulkCheckInventoryResponseDto = (() => {
    let _allAvailable_decorators;
    let _allAvailable_initializers = [];
    let _allAvailable_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    return class BulkCheckInventoryResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _allAvailable_decorators = [(0, class_validator_1.IsBoolean)()];
            _summary_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _allAvailable_decorators, { kind: "field", name: "allAvailable", static: false, private: false, access: { has: obj => "allAvailable" in obj, get: obj => obj.allAvailable, set: (obj, value) => { obj.allAvailable = value; } }, metadata: _metadata }, _allAvailable_initializers, _allAvailable_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        allAvailable = __runInitializers(this, _allAvailable_initializers, void 0);
        items = __runInitializers(this, _allAvailable_extraInitializers);
        summary = __runInitializers(this, _summary_initializers, void 0);
        constructor() {
            __runInitializers(this, _summary_extraInitializers);
        }
    };
})();
exports.BulkCheckInventoryResponseDto = BulkCheckInventoryResponseDto;
//# sourceMappingURL=inventory.dto.js.map