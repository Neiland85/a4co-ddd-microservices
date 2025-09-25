"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ProductController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Products'), (0, common_1.Controller)('products')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getProductById_decorators;
    let _getProductBySku_decorators;
    let _getProductBySlug_decorators;
    let _createProduct_decorators;
    let _updateProduct_decorators;
    let _deleteProduct_decorators;
    let _publishProduct_decorators;
    let _archiveProduct_decorators;
    var ProductController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getProductById_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' })];
            _getProductBySku_decorators = [(0, common_1.Get)('sku/:sku'), (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por SKU' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' })];
            _getProductBySlug_decorators = [(0, common_1.Get)('slug/:slug'), (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por slug' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' })];
            _createProduct_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo producto' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' })];
            _updateProduct_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Actualizar producto' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' })];
            _deleteProduct_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Eliminar producto' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto eliminado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' })];
            _publishProduct_decorators = [(0, common_1.Post)(':id/publish'), (0, swagger_1.ApiOperation)({ summary: 'Publicar producto' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto publicado exitosamente' })];
            _archiveProduct_decorators = [(0, common_1.Post)(':id/archive'), (0, swagger_1.ApiOperation)({ summary: 'Archivar producto' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto archivado exitosamente' })];
            __esDecorate(this, null, _getProductById_decorators, { kind: "method", name: "getProductById", static: false, private: false, access: { has: obj => "getProductById" in obj, get: obj => obj.getProductById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getProductBySku_decorators, { kind: "method", name: "getProductBySku", static: false, private: false, access: { has: obj => "getProductBySku" in obj, get: obj => obj.getProductBySku }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getProductBySlug_decorators, { kind: "method", name: "getProductBySlug", static: false, private: false, access: { has: obj => "getProductBySlug" in obj, get: obj => obj.getProductBySlug }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createProduct_decorators, { kind: "method", name: "createProduct", static: false, private: false, access: { has: obj => "createProduct" in obj, get: obj => obj.createProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateProduct_decorators, { kind: "method", name: "updateProduct", static: false, private: false, access: { has: obj => "updateProduct" in obj, get: obj => obj.updateProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteProduct_decorators, { kind: "method", name: "deleteProduct", static: false, private: false, access: { has: obj => "deleteProduct" in obj, get: obj => obj.deleteProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _publishProduct_decorators, { kind: "method", name: "publishProduct", static: false, private: false, access: { has: obj => "publishProduct" in obj, get: obj => obj.publishProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveProduct_decorators, { kind: "method", name: "archiveProduct", static: false, private: false, access: { has: obj => "archiveProduct" in obj, get: obj => obj.archiveProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProductController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        productService = __runInitializers(this, _instanceExtraInitializers);
        constructor(productService) {
            this.productService = productService;
        }
        async getProductById(id) {
            return await this.productService.getProductById(id);
        }
        async getProductBySku(sku) {
            return await this.productService.getProductBySku(sku);
        }
        async getProductBySlug(slug) {
            return await this.productService.getProductBySlug(slug);
        }
        async createProduct(productData) {
            return await this.productService.createProduct(productData);
        }
        async updateProduct(id, productData) {
            const updateDto = { ...productData, id };
            return await this.productService.updateProduct(updateDto);
        }
        async deleteProduct(id) {
            return await this.productService.deleteProduct(id);
        }
        async publishProduct(id) {
            return await this.productService.publishProduct(id);
        }
        async archiveProduct(id) {
            return await this.productService.archiveProduct(id);
        }
    };
    return ProductController = _classThis;
})();
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map